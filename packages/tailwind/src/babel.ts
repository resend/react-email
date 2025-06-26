/** biome-ignore-all lint/nursery/noNestedComponentDefinitions: there are no React components her, just some functions */
import { type NodePath, type PluginObj, parseSync } from "@babel/core";
import * as t from "@babel/types";
import { getReactInlinedStylesFor } from "./utils/css/get-react-inlined-styles-for";
import { setupTailwind } from "./utils/tailwindcss/setup-tailwind";
import type { TailwindConfig } from "./utils/tailwindcss/setup-tailwind-context";

const reactEmailComponents = [
	"Body",
	"Button",
	"CodeBlock",
	"CodeInline",
	"Column",
	"Container",
	"Font",
	"Head",
	"Heading",
	"Hr",
	"Html",
	"Img",
	"Link",
	"Markdown",
	"Preview",
	"Row",
	"Section",
	"Text",
];

const getName = (
	node:
		| t.JSXOpeningElement
		| t.JSXNamespacedName
		| t.JSXMemberExpression
		| t.JSXIdentifier,
): string => {
	if (node.type === "JSXIdentifier") {
		return node.name;
	}

	if (node.type === "JSXMemberExpression") {
		return `${node.property.name}.${getName(node.object)}`;
	}

	if (node.type === "JSXOpeningElement") {
		return getName(node.name);
	}

	if (node.type === "JSXNamespacedName") {
		return `${node.namespace.name}:${node.name.name}`;
	}

	return ""; // should never happen
};

export default function tailwindcss(config: TailwindConfig): PluginObj {
	const tailwind = setupTailwind(config);
	const root = tailwind.createDefaultRoot();

	const stylesPerClassName = {} as Record<string, Record<string, string>>;

	const jsxAttributesProcessed: t.JSXAttribute[] = [];

	return {
		visitor: {
			Program: {
				exit(path) {
					const runtimeInlinerCode = parseSync(
						`
const stylesPerClassName = ${JSON.stringify(stylesPerClassName, null, 2)};
function inlineReactEmailTailwindStylesAtRuntime(element) {
  const newProps = { ...element.props };
  if (newProps.className) {
    const classes = newProps.className.split(/\\s+/).filter(Boolean);
    for (const className of classes) {
      const styles = stylesPerClassName[className];
      if (styles) {
        newProps.style = {
          ...newProps.style,
          ...styles,
        };
      }
    }
    delete newProps.className;
  }
  return { ...element, props: newProps };
}`,
						{},
					);
					if (!runtimeInlinerCode) {
						throw new Error(
							"Failed to parse runtime inliner code, this is a bug",
						);
					}
					path.unshiftContainer("body", runtimeInlinerCode.program.body);
				},
			},
			JSXAttribute(path) {
				if (jsxAttributesProcessed.includes(path.node)) {
					return;
				}

				jsxAttributesProcessed.push(path.node);
				if (path.node.name.type !== "JSXIdentifier") {
					return;
				}

				const name = path.node.name.name;

				if (name !== "className") {
					return;
				}

				const openingElement = path.findParent((p) =>
					p.isJSXOpeningElement(),
				) as NodePath<t.JSXOpeningElement> | null;

				if (!openingElement) {
					return;
				}

				const openingElementName: string = getName(openingElement.node);

				const shouldInlineStyles =
					openingElementName[0].toLowerCase() === openingElementName[0] ||
					reactEmailComponents.includes(openingElementName);

				let classes: string[] = [];

				let hasTemplateLiteral = false;

				if (path.node.value?.type === "StringLiteral") {
					const attributeClasses = path.node.value.value
						.split(/\s+/)
						.filter(Boolean);

					const rules = tailwind.generateRules(new Set(attributeClasses));
					root.append(...rules);
					tailwind.processTailwindFeatures(root);

					if (shouldInlineStyles) {
						path.remove();
					}

					classes = [...classes, ...attributeClasses];
				} else if (path.node.value?.type === "JSXExpressionContainer") {
					path.traverse({
						StringLiteral(stringLiteralPath) {
							const literalClasses = stringLiteralPath.node.value
								.split(/\s+/)
								.filter(Boolean);
							const rules = tailwind.generateRules(new Set(literalClasses));
							root.append(...rules);

							classes = [...classes, ...literalClasses];
						},
						TemplateLiteral(templateLiteralPath) {
							if (templateLiteralPath.node.expressions.length > 0) {
								hasTemplateLiteral = true;
							}
						},
						TemplateElement(templateElementPath) {
							const templateElementClasses = templateElementPath.node.value.raw
								.split(/\s+/)
								.filter(Boolean);

							const rules = tailwind.generateRules(
								new Set(templateElementClasses),
							);
							root.append(...rules);

							classes = [...classes, ...templateElementClasses];
						},
					});
				}

				tailwind.processTailwindFeatures(root);

				let stylesToAdd: Record<string, string> = {};

				for (const className of classes) {
					const styles = getReactInlinedStylesFor(className, root);
					stylesPerClassName[className] = styles;
					stylesToAdd = {
						...stylesToAdd,
						...styles,
					};
				}

				if (shouldInlineStyles) {
					let styleAttributePath = null as NodePath<t.JSXAttribute> | null;
					openingElement.traverse({
						JSXAttribute(path) {
							if (path.node.name.type !== "JSXIdentifier") {
								return;
							}

							if (path.node.name.name === "style") {
								styleAttributePath = path;
							}
						},
					});
					const stylesToAddNode = t.objectExpression(
						Object.entries(stylesToAdd).map(([key, value]) =>
							t.objectProperty(t.identifier(key), t.stringLiteral(value)),
						),
					);
					if (styleAttributePath) {
						if (
							styleAttributePath.node.value?.type === "JSXExpressionContainer"
						) {
							styleAttributePath.node.value.expression = t.objectExpression([
								t.spreadElement(
									styleAttributePath.node.value.expression.type ===
										"JSXEmptyExpression"
										? t.objectExpression([])
										: styleAttributePath.node.value.expression,
								),
								t.spreadElement(stylesToAddNode),
							]);
						}
					} else {
						openingElement.node.attributes.push(
							t.jsxAttribute(
								t.jsxIdentifier("style"),
								t.jsxExpressionContainer(stylesToAddNode),
							),
						);
					}
				}

				if (hasTemplateLiteral) {
					const elementWrappedInFunctionCall = t.callExpression(
						t.identifier("inlineReactEmailTailwindStylesAtRuntime"),
						[openingElement.parent as t.JSXElement],
					);
					openingElement.parentPath.replaceWith(elementWrappedInFunctionCall);
				}
			},
		},
	};
}
