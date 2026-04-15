import { createHash } from 'node:crypto';
import { removeFilenameExtension } from './contains-email-template';

const RESEND_TEMPLATE_ALIAS_PREFIX = 'react-email';
const RESEND_TEMPLATE_ALIAS_NAME_MAX_LENGTH = 32;
const RESEND_TEMPLATE_SEARCH_LIMIT = 100;

interface ResendError {
  message: string;
  name: string;
  statusCode: number | null;
}

interface ResendResponse<Data> {
  data: Data | null;
  error: ResendError | null;
}

interface ResendTemplateIdentifier {
  id: string;
}

interface ResendTemplateSummary {
  alias: string | null;
  created_at: string;
  id: string;
  name: string;
}

interface ResendTemplatesApi {
  create(payload: {
    alias: string;
    html: string;
    name: string;
  }): PromiseLike<ResendResponse<ResendTemplateIdentifier>>;
  get(identifier: string): Promise<ResendResponse<ResendTemplateIdentifier>>;
  list(options: { after?: string; limit: number }): Promise<
    ResendResponse<{
      data: ResendTemplateSummary[];
      has_more: boolean;
    }>
  >;
  update(
    identifier: string,
    payload: {
      alias: string;
      html: string;
      name: string;
    },
  ): Promise<ResendResponse<ResendTemplateIdentifier>>;
}

interface ResendApi {
  templates: ResendTemplatesApi;
}

interface UpsertResendTemplateOptions {
  html: string;
  legacyName?: string;
  name: string;
  resend: ResendApi;
}

export type ResendTemplateSyncOperation = 'created' | 'updated';

export type UpsertResendTemplateResult =
  | {
      id: string;
      operation: ResendTemplateSyncOperation;
    }
  | {
      error: ResendError;
    };

const sanitizeTemplateAliasName = (templateName: string) => {
  const sanitized = removeFilenameExtension(templateName)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, RESEND_TEMPLATE_ALIAS_NAME_MAX_LENGTH);

  if (sanitized.length === 0) {
    return 'template';
  }

  return sanitized;
};

export const getResendTemplateAlias = (templateName: string) => {
  const sanitizedName = sanitizeTemplateAliasName(templateName);
  const templateHash = createHash('sha256')
    .update(removeFilenameExtension(templateName))
    .digest('hex')
    .slice(0, 8);

  return `${RESEND_TEMPLATE_ALIAS_PREFIX}-${sanitizedName}-${templateHash}`;
};

const chooseOldestTemplate = (templates: ResendTemplateSummary[]) => {
  return [...templates].sort((leftTemplate, rightTemplate) => {
    return (
      new Date(leftTemplate.created_at).getTime() -
      new Date(rightTemplate.created_at).getTime()
    );
  })[0];
};

const getTemplateToUpdate = (
  templates: ResendTemplateSummary[],
  {
    alias,
    legacyName,
    name,
  }: {
    alias: string;
    legacyName?: string;
    name: string;
  },
) => {
  const exactAliasMatch = templates.find(
    (template) => template.alias === alias,
  );

  if (exactAliasMatch) {
    return exactAliasMatch;
  }

  const exactNameMatches = templates.filter(
    (template) => template.name === name,
  );
  if (exactNameMatches.length > 0) {
    return chooseOldestTemplate(exactNameMatches);
  }

  if (legacyName) {
    const legacyNameMatches = templates.filter(
      (template) => template.name === legacyName,
    );

    if (legacyNameMatches.length > 0) {
      return chooseOldestTemplate(legacyNameMatches);
    }
  }

  return undefined;
};

const createMissingTemplateResponse = (message: string): ResendError => ({
  message,
  name: 'application_error',
  statusCode: null,
});

const isMissingTemplateError = (error: ResendError | null) => {
  return error?.statusCode === 404 || error?.name === 'not_found';
};

const findExistingTemplate = async ({
  alias,
  legacyName,
  name,
  resend,
}: {
  alias: string;
  legacyName?: string;
  name: string;
  resend: ResendApi;
}) => {
  let after: string | undefined;

  while (true) {
    const listResponse = await resend.templates.list({
      after,
      limit: RESEND_TEMPLATE_SEARCH_LIMIT,
    });

    if (listResponse.error || !listResponse.data?.data) {
      return {
        error:
          listResponse.error ??
          createMissingTemplateResponse(
            `Failed listing templates before syncing ${name}.`,
          ),
      };
    }

    const templateToUpdate = getTemplateToUpdate(listResponse.data.data, {
      alias,
      legacyName,
      name,
    });

    if (templateToUpdate) {
      return {
        template: templateToUpdate,
      };
    }

    if (!listResponse.data.has_more || listResponse.data.data.length === 0) {
      return {
        template: undefined,
      };
    }

    after = listResponse.data.data.at(-1)?.id;

    if (!after) {
      return {
        error: createMissingTemplateResponse(
          `Failed paginating templates before syncing ${name}.`,
        ),
      };
    }
  }
};

export const upsertResendTemplate = async ({
  html,
  legacyName,
  name,
  resend,
}: UpsertResendTemplateOptions): Promise<UpsertResendTemplateResult> => {
  const alias = getResendTemplateAlias(name);
  const existingTemplateResponse = await resend.templates.get(alias);

  if (existingTemplateResponse.data?.id) {
    const updateResponse = await resend.templates.update(alias, {
      alias,
      html,
      name,
    });

    if (updateResponse.error || !updateResponse.data?.id) {
      return {
        error:
          updateResponse.error ??
          createMissingTemplateResponse(
            `Failed updating the template for ${name}.`,
          ),
      };
    }

    return {
      id: updateResponse.data.id,
      operation: 'updated',
    };
  }

  if (
    existingTemplateResponse.error &&
    !isMissingTemplateError(existingTemplateResponse.error)
  ) {
    return {
      error: existingTemplateResponse.error,
    };
  }

  const existingTemplateLookup = await findExistingTemplate({
    alias,
    legacyName,
    name,
    resend,
  });

  if ('error' in existingTemplateLookup) {
    return existingTemplateLookup;
  }

  if (existingTemplateLookup.template) {
    const updateResponse = await resend.templates.update(
      existingTemplateLookup.template.id,
      {
        alias,
        html,
        name,
      },
    );

    if (updateResponse.error || !updateResponse.data?.id) {
      return {
        error:
          updateResponse.error ??
          createMissingTemplateResponse(
            `Failed updating the template for ${name}.`,
          ),
      };
    }

    return {
      id: updateResponse.data.id,
      operation: 'updated',
    };
  }

  const createResponse = await resend.templates.create({
    alias,
    html,
    name,
  });

  if (createResponse.error || !createResponse.data?.id) {
    return {
      error:
        createResponse.error ??
        createMissingTemplateResponse(
          `Failed creating the template for ${name}.`,
        ),
    };
  }

  return {
    id: createResponse.data.id,
    operation: 'created',
  };
};
