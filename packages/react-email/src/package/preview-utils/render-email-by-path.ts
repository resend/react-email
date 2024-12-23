import fs from "node:fs";
import { getEmailComponent } from "./get-email-component";
import { improveErrorWithSourceMap } from "./utils/improve-error-with-source-map";

export interface RenderedEmailMetadata {
  markup: string;
  plainText: string;
  reactMarkup: string;
}

export type EmailRenderingResult =
  | RenderedEmailMetadata
  | {
      error: Error;
    };

export const renderEmailByPath = async (
  emailPath: string,
): Promise<EmailRenderingResult> => {
  const result = await getEmailComponent(emailPath);

  if ("error" in result) {
    return { error: result.error };
  }

  const {
    emailComponent: Email,
    createElement,
    render,
    sourceMapToOriginalFile,
  } = result;

  const previewProps = Email.PreviewProps || {};
  const EmailComponent = Email as React.FC;
  try {
    const markup = await render(createElement(EmailComponent, previewProps), {
      pretty: true,
    });
    const plainText = await render(
      createElement(EmailComponent, previewProps),
      {
        plainText: true,
      },
    );

    const reactMarkup = await fs.promises.readFile(emailPath, "utf-8");

    return {
      // This ensures that no null byte character ends up in the rendered
      // markup making users suspect of any issues. These null byte characters
      // only seem to happen with React 18, as it has no similar incident with React 19.
      markup: markup.replaceAll("\0", ""),
      plainText,
      reactMarkup,
    };
  } catch (exception) {
    const error = exception as Error;

    return {
      error: improveErrorWithSourceMap(
        error,
        emailPath,
        sourceMapToOriginalFile,
      ),
    };
  }
};
