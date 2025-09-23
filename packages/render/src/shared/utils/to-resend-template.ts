import * as ts from 'typescript';

interface ConditionalPattern {
  type: 'conditional';
  pattern: 'ternary' | 'logical-and' | 'logical-or' | 'iife' | 'function-call';
  node: ts.Node;
  condition?: ts.Expression;
}

interface LoopPattern {
  type: 'loop';
  pattern: 'map' | 'filter-map' | 'iife-loop' | 'flatmap' | 'reduce';
  node: ts.Node;
  iterable?: ts.Expression;
}

interface PropertyInfo {
  key: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | null; // null for complex/ignored types
  fallbackValue: string | number | boolean | null;
}

function getTypeFromTypeNode(
  typeNode: ts.TypeNode,
): 'string' | 'number' | 'boolean' | null {
  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = typeNode.typeName;
    if (ts.isIdentifier(typeName)) {
      switch (typeName.text) {
        case 'string':
        case 'Date':
          return 'string';
        case 'number':
          return 'number';
        case 'boolean':
          return 'boolean';
        default:
          return null; // Complex type, ignore
      }
    }
  }

  if (typeNode.kind === ts.SyntaxKind.StringKeyword) {
    return 'string';
  }
  if (typeNode.kind === ts.SyntaxKind.NumberKeyword) {
    return 'number';
  }
  if (typeNode.kind === ts.SyntaxKind.BooleanKeyword) {
    return 'boolean';
  }

  // For arrays, objects, unions, etc., return null to ignore
  return null;
}

function analyzeJSX(
  sourceFile: ts.SourceFile,
): (ConditionalPattern | LoopPattern)[] {
  const patterns: (ConditionalPattern | LoopPattern)[] = [];

  function visit(node: ts.Node) {
    // Detect conditionals
    if (ts.isConditionalExpression(node)) {
      // Ternary: condition ? true : false
      patterns.push({
        type: 'conditional',
        pattern: 'ternary',
        node,
        condition: node.condition,
      });
    }

    if (ts.isBinaryExpression(node)) {
      if (node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) {
        // Logical AND: condition && <Component />
        patterns.push({
          type: 'conditional',
          pattern: 'logical-and',
          node,
          condition: node.left,
        });
      }
      if (node.operatorToken.kind === ts.SyntaxKind.BarBarToken) {
        // Logical OR: condition || <Component />
        patterns.push({
          type: 'conditional',
          pattern: 'logical-or',
          node,
          condition: node.left,
        });
      }
    }

    // Detect loops
    if (ts.isCallExpression(node)) {
      if (ts.isPropertyAccessExpression(node.expression)) {
        const methodName = node.expression.name.text;

        if (methodName === 'map') {
          patterns.push({
            type: 'loop',
            pattern: 'map',
            node,
            iterable: node.expression.expression,
          });
        }

        if (methodName === 'flatMap') {
          patterns.push({
            type: 'loop',
            pattern: 'flatmap',
            node,
            iterable: node.expression.expression,
          });
        }

        // Detect filter().map() chains
        if (
          methodName === 'map' &&
          ts.isCallExpression(node.expression.expression) &&
          ts.isPropertyAccessExpression(
            node.expression.expression.expression,
          ) &&
          node.expression.expression.expression.name.text === 'filter'
        ) {
          patterns.push({
            type: 'loop',
            pattern: 'filter-map',
            node,
            iterable: node.expression.expression.expression.expression,
          });
        }
      }
    }

    // Detect IIFE patterns
    if (
      ts.isCallExpression(node) &&
      ts.isArrowFunction(node.expression) &&
      !node.arguments.length
    ) {
      // This could be an IIFE - need to analyze the body
      const body = node.expression.body;
      if (ts.isBlock(body)) {
        // Look for if statements or loops in the block
        body.statements.forEach((stmt) => {
          if (ts.isIfStatement(stmt)) {
            patterns.push({
              type: 'conditional',
              pattern: 'iife',
              node,
              condition: stmt.expression,
            });
          }
          if (
            ts.isForStatement(stmt) ||
            ts.isForOfStatement(stmt) ||
            ts.isForInStatement(stmt)
          ) {
            patterns.push({
              type: 'loop',
              pattern: 'iife-loop',
              node,
            });
          }
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return patterns;
}

function inferTypeFromValue(
  value: ts.Expression,
): 'string' | 'number' | 'boolean' | null {
  if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) {
    return 'string';
  }
  if (ts.isNumericLiteral(value)) {
    return 'number';
  }
  if (
    value.kind === ts.SyntaxKind.TrueKeyword ||
    value.kind === ts.SyntaxKind.FalseKeyword
  ) {
    return 'boolean';
  }
  if (
    ts.isNewExpression(value) &&
    ts.isIdentifier(value.expression) &&
    value.expression.text === 'Date'
  ) {
    return 'string'; // Treat Date objects as strings for fallback
  }
  return null;
}

function extractValueWithType(
  value: ts.Expression,
): string | number | boolean | null {
  if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) {
    return value.text;
  }
  if (ts.isNumericLiteral(value)) {
    return Number(value.text);
  }
  if (value.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }
  if (value.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }
  if (
    ts.isNewExpression(value) &&
    ts.isIdentifier(value.expression) &&
    value.expression.text === 'Date'
  ) {
    // Handle Date constructor
    if (!value.arguments || value.arguments.length === 0) {
      // new Date() with no arguments - return current date
      return new Date().toISOString();
    }

    if (value.arguments.length === 1) {
      // new Date("some string") - try to parse the argument
      const arg = value.arguments[0];
      if (ts.isStringLiteral(arg)) {
        try {
          const date = new Date(arg.text);
          return date.toISOString();
        } catch (_error) {
          // If parsing fails, return the original string
          return arg.text;
        }
      }
    }
    // For complex Date constructor calls, return the source text
    return value.getText();
  }
  // For complex expressions, return the source text
  return value.getText();
}

function analyzeJSXComponentProps(sourceFile: ts.SourceFile): PropertyInfo[] {
  const properties: PropertyInfo[] = [];
  const previewPropsMap = new Map<
    string,
    {
      type: 'string' | 'number' | 'boolean' | null;
      fallbackValue: string | number | boolean | null;
    }
  >();

  function extractPropsFromDestructuring(
    bindingPattern: ts.ObjectBindingPattern,
  ): Array<{ name: string; defaultValue?: string | number | boolean | null }> {
    const props: Array<{
      name: string;
      defaultValue?: string | number | boolean | null;
    }> = [];
    for (const element of bindingPattern.elements) {
      if (ts.isBindingElement(element) && ts.isIdentifier(element.name)) {
        const propInfo: {
          name: string;
          defaultValue?: string | number | boolean | null;
        } = {
          name: element.name.text,
        };

        // Check if there's a default value
        if (element.initializer) {
          propInfo.defaultValue = extractValueWithType(element.initializer);
        }

        props.push(propInfo);
      }
    }
    return props;
  }

  function visit(node: ts.Node) {
    // Look for PreviewProps assignments to infer types and fallback values
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isPropertyAccessExpression(node.left) &&
      node.left.name.text === 'PreviewProps' &&
      ts.isObjectLiteralExpression(node.right)
    ) {
      // Extract type information and fallback values from PreviewProps
      for (const prop of node.right.properties) {
        if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
          const type = inferTypeFromValue(prop.initializer);
          const fallbackValue = extractValueWithType(prop.initializer);
          if (type) {
            previewPropsMap.set(prop.name.text, { type, fallbackValue });
          }
        }
      }
    }

    // Look for function components (arrow functions and function declarations)
    if (ts.isArrowFunction(node) || ts.isFunctionDeclaration(node)) {
      const params = node.parameters;
      if (params.length > 0) {
        const firstParam = params[0];
        // Check if the first parameter is destructured (JSX props pattern)
        if (firstParam.name && ts.isObjectBindingPattern(firstParam.name)) {
          const propInfos = extractPropsFromDestructuring(firstParam.name);
          for (const propInfo of propInfos) {
            const previewData = previewPropsMap.get(propInfo.name);
            const inferredType = previewData?.type || 'string'; // Fallback to string
            const fallbackValue =
              propInfo.defaultValue || // Use destructuring default first
              previewData?.fallbackValue || // Then PreviewProps value
              null; // Finally null

            properties.push({
              key: propInfo.name,
              required: !propInfo.defaultValue, // If there's a default, it's not required
              type: inferredType,
              fallbackValue,
            });
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return properties;
}

function analyzeInterfaceProperties(sourceFile: ts.SourceFile): PropertyInfo[] {
  const properties: PropertyInfo[] = [];
  let foundInterfaces = false;
  const interfacePropsMap = new Map<
    string,
    { type: 'string' | 'number' | 'boolean' | null; required: boolean }
  >();
  const componentDefaultsMap = new Map<
    string,
    string | number | boolean | null
  >();
  const previewPropsMap = new Map<
    string,
    {
      type: 'string' | 'number' | 'boolean' | null;
      fallbackValue: string | number | boolean | null;
    }
  >();

  function extractPropsFromDestructuring(
    bindingPattern: ts.ObjectBindingPattern,
  ): Array<{ name: string; defaultValue?: string | number | boolean | null }> {
    const props: Array<{
      name: string;
      defaultValue?: string | number | boolean | null;
    }> = [];
    for (const element of bindingPattern.elements) {
      if (ts.isBindingElement(element) && ts.isIdentifier(element.name)) {
        const propInfo: {
          name: string;
          defaultValue?: string | number | boolean | null;
        } = {
          name: element.name.text,
        };

        // Check if there's a default value
        if (element.initializer) {
          propInfo.defaultValue = extractValueWithType(element.initializer);
        }

        props.push(propInfo);
      }
    }
    return props;
  }

  function visit(node: ts.Node) {
    // Collect interface properties
    if (ts.isInterfaceDeclaration(node)) {
      foundInterfaces = true;
      // Found an interface, analyze its members
      for (const member of node.members) {
        if (ts.isPropertySignature(member)) {
          // Get property name
          const key =
            member.name && ts.isIdentifier(member.name)
              ? member.name.text
              : member.name && ts.isStringLiteral(member.name)
                ? member.name.text
                : '';

          if (!key) continue;

          // Check if property is required (no question token)
          const required = !member.questionToken;

          // Get the type
          const type = member.type ? getTypeFromTypeNode(member.type) : null;

          // Only include properties with primitive types
          if (type !== null) {
            interfacePropsMap.set(key, { type, required });
          }
        }
      }
    }

    // Look for PreviewProps assignments to get fallback values
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isPropertyAccessExpression(node.left) &&
      node.left.name.text === 'PreviewProps' &&
      ts.isObjectLiteralExpression(node.right)
    ) {
      // Extract type information and fallback values from PreviewProps
      for (const prop of node.right.properties) {
        if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
          const type = inferTypeFromValue(prop.initializer);
          const fallbackValue = extractValueWithType(prop.initializer);
          if (type) {
            previewPropsMap.set(prop.name.text, { type, fallbackValue });
          }
        }
      }
    }

    // Look for component functions to get default values from destructuring
    if (ts.isArrowFunction(node) || ts.isFunctionDeclaration(node)) {
      const params = node.parameters;
      if (params.length > 0) {
        const firstParam = params[0];
        // Check if the first parameter is destructured (JSX props pattern)
        if (firstParam.name && ts.isObjectBindingPattern(firstParam.name)) {
          const propInfos = extractPropsFromDestructuring(firstParam.name);
          for (const propInfo of propInfos) {
            if (propInfo.defaultValue) {
              componentDefaultsMap.set(propInfo.name, propInfo.defaultValue);
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // If interfaces were found, combine interface info with component defaults
  if (foundInterfaces && interfacePropsMap.size > 0) {
    for (const [key, interfaceInfo] of interfacePropsMap) {
      const componentDefault = componentDefaultsMap.get(key);
      const previewData = previewPropsMap.get(key);

      // Determine the final fallback value
      const fallbackValue =
        componentDefault || // Use component destructuring default first
        previewData?.fallbackValue || // Then PreviewProps value
        null; // Finally null

      // Update required status if there's a default value
      const required = interfaceInfo.required && !componentDefault;

      properties.push({
        key,
        required,
        type: interfaceInfo.type,
        fallbackValue,
      });
    }
    return properties;
  }

  // If no interfaces found, fall back to JSX component analysis
  return analyzeJSXComponentProps(sourceFile);
}

export function getPatterns(content: string) {
  const sourceFile = ts.createSourceFile(
    'temp.tsx',
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  return analyzeJSX(sourceFile);
}

export function getProperties(content: string) {
  const sourceFile = ts.createSourceFile(
    'temp.tsx',
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  return analyzeInterfaceProperties(sourceFile);
}
