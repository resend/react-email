import { createRule } from "../utils/create-rule";

export default createRule({
  meta: {
    type: "problem",
    schema: [],
    messages: {
      "base-64-image":
        "Base64 images may not be supported on your email client, see https://www.caniemail.com/features/image-base64/",
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        const attributeName = context.sourceCode.getText(node.name);
        // if the parent is an opening of a jsx element
        if (
          "name" in node.parent &&
          "attributes" in node.parent &&
          attributeName === "src" &&
          node.value
        ) {
          const elementName = context.sourceCode.getText(node.parent.name);

          if (elementName === "img" || elementName === "Img") {
            const value = context.sourceCode.getText(node.value);
            const regex = /data:image\/[^;]+;base64[^"]+/g;

            if (regex.test(value)) {
              context.report({
                node,
                messageId: "base-64-image",
              });
            }
          }
        }
      },
    };
  },
});
