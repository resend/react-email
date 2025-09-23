import { resend } from '../../lib/resend';

export interface ExportTemplateToResendProps {
  html: string;
  name: string;
}

export const exportTemplateToResend = async (
  template: ExportTemplateToResendProps,
) => {
  const response = await resend.templates.create({
    name: template.name,
    html: template.html,
  });

  return response;
};
