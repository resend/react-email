import {
  type GetEmailComponentResult,
  getEmailComponent,
} from './get-email-component';

export const componentCache = new Map<string, GetEmailComponentResult>();

export const cachedGetEmailComponent = async (
  emailPath: string,
  invalidatingCache = false,
) => {
  if (process.env.NEXT_PUBLIC_IS_BUILDING === 'true') {
  }

  if (invalidatingCache) componentCache.delete(emailPath);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (componentCache.has(emailPath)) return componentCache.get(emailPath)!;

  const result = await getEmailComponent(emailPath);

  componentCache.set(emailPath, result);

  return result;
};
