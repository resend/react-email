import { readdir } from 'fs-extra';
import { normalize } from 'node:path';

/**
 * @description Equivalent to doing a glob search like `${emailsDir}/*.jsx,.tsx`.
 * @param emailsDir The path to the emails directory, relative or absolute does not matter
 * 
 * @returns A promise containing the list of files that match the glob pattern `${emailsDir}/*.jsx,.tsx`
 */
export async function getAllEmails(emailsDir: string) {
    const allFiles = await readdir(normalize(emailsDir));

    return allFiles
        .filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'))
        .map(f => `${emailsDir}/${f}`);
}