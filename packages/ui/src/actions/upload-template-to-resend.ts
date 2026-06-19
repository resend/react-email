import type { Resend } from 'resend';

export type UploadTemplateResult =
  | { name: string; status: 'failed' }
  | { name: string; status: 'succeeded'; id: string };

/**
 * Uploads a single email template to Resend.
 *
 * Looks the template up by name first so that re-uploading the same template
 * updates it in place instead of creating a duplicate (`welcome`, `welcome (1)`,
 * `welcome (2)`, ...). Resend template names are not unique, so the update only
 * happens when exactly one template matches the name. On zero or several matches
 * it falls back to creating a new template, which is the previous behavior.
 *
 * See https://github.com/resend/react-email/issues/3194.
 */
export const uploadTemplateToResend = async (
  resend: Resend,
  template: { name: string; html: string },
): Promise<UploadTemplateResult> => {
  const existing = await resend.templates.list();
  if (existing.error) {
    console.error('Error listing templates', existing.error);
    return { name: template.name, status: 'failed' };
  }

  const matches = existing.data.data.filter(
    (item) => item.name === template.name,
  );
  const match = matches.length === 1 ? matches[0] : undefined;

  if (match) {
    const updated = await resend.templates.update(match.id, {
      html: template.html,
    });
    if (updated.error) {
      console.error('Error updating single template', updated.error);
      return { name: template.name, status: 'failed' };
    }
    return { name: template.name, status: 'succeeded', id: updated.data.id };
  }

  const created = await resend.templates.create({
    name: template.name,
    html: template.html,
  });
  if (created.error) {
    console.error('Error creating single template', created.error);
    return { name: template.name, status: 'failed' };
  }
  return { name: template.name, status: 'succeeded', id: created.data.id };
};
