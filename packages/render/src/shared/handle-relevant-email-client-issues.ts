import { decode } from 'he';

export const handleRelevantEmailClientIssues = (html: string): string => {
  return html
    .replaceAll(/href='([^']+)'/g, (match, content: string) => {
      const decodedContent = decode(content, {
        isAttributeValue: true,
      });
      console.log(decodedContent);
      if (decodedContent.includes("'")) {
        throw new Error(
          'Decoded href contains single quotes, which cannot be safely replaced without breaking the link. Keep your links free of duplicated quotes like this.',
        );
      }
      return match.replace(content, decodedContent);
    })
    .replaceAll(/href="([^"]+)"/g, (match, content: string) => {
      const decodedContent = decode(content, {
        isAttributeValue: true,
      });
      if (decodedContent.includes('"')) {
        throw new Error(
          'Decoded href contains double quotes, which cannot be safely replaced without breaking the href="...". Keep your links free of duplicated quotes like this.',
        );
      }
      return match.replace(content, decodedContent);
    });
};
