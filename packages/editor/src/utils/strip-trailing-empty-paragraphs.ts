import type { JSONContent } from '@tiptap/core';

const isEmptyParagraph = (node: JSONContent): boolean =>
  node.type === 'paragraph' && (!node.content || node.content.length === 0);

export const stripTrailingEmptyParagraphs = (
  content: JSONContent,
): JSONContent => {
  if (!content.content || content.content.length === 0) {
    return content;
  }

  const processedChildren = content.content.map((child) =>
    stripTrailingEmptyParagraphs(child),
  );

  if (content.type !== 'container') {
    return { ...content, content: processedChildren };
  }

  const lastChild = processedChildren[processedChildren.length - 1];
  if (!lastChild || !isEmptyParagraph(lastChild)) {
    return { ...content, content: processedChildren };
  }

  const trimmed = processedChildren.slice(0, -1);

  return {
    ...content,
    content: trimmed.length > 0 ? trimmed : processedChildren,
  };
};
