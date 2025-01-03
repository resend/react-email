import { getEmailComponent, type GetEmailComponentResult } from './get-email-component';

export const componentCache = new Map<string, GetEmailComponentResult>();

export const cachedGetEmailComponent = (
  emailPath: string,
  invalidatingCache = false,
) => {
  if (invalidatingCache) componentCache.delete(emailPath);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (componentCache.has(emailPath)) return componentCache.get(emailPath)!;

  return getEmailComponent(emailPath);
};
