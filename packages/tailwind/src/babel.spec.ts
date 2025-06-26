import { transformAsync } from '@babel/core';
import { render } from '@react-email/components';
import React from 'react';
import { tailwindcss } from './babel';

const transform = (code: string) => {
  return transformAsync(code, {
    targets: 'defaults',
    filename: 'test.tsx',
    presets: ['@babel/preset-react'],
    plugins: [tailwindcss({})],
  });
};

describe('tailwindcss babel plugin', async () => {
  it('shuold inline styles with HTML elements', async () => {
    const code = `<p className="bg-red-500 text-white p-4">some text</p>`;
    const transformed = await transform(code);

    expect(transformed).toBeDefined();

    expect(transformed?.code).toMatchSnapshot();
  });

  it('should inline styles even when there are already inline styles', async () => {
    const code = `
<p 
  className="bg-red-500 text-white p-4" 
  style={{ backgroundColor: "rgb(0,0,0)" }}
>
  some text
</p>`;
    const transformed = await transform(code);

    expect(transformed).toBeDefined();
    expect(transformed?.code).toMatchSnapshot();
  });

  it("should inline styles with React Email's components", async () => {
    const code = `import { Text } from "@react-email/components";
    <Text className="bg-red-500 text-white p-4">some text</Text>`;
    const transformed = await transform(code);
    expect(transformed).toBeDefined();
    expect(transformed?.code).toMatchSnapshot();
  });

  it('should not inline styles for cunstom component instances', async () => {
    const code = `function MyCustomComponent({ className, style }) {
      return <></>;
    }

    <MyCustomComponent className="bg-red-500 text-white p-4" />`;

    const transformed = await transform(code);

    expect(transformed).toBeDefined();
    expect(transformed?.code).toMatchSnapshot();
  });

  it('should dynamic strings with a runtime inlining function', async () => {
    const code = `function MyCustomComponent({ className, style, children }) {
      return <button className={\`bg-blue-300 \${className}\`} style={style}>{children}</button>;
    }

    output.element = <MyCustomComponent className="bg-red-500 text-white p-4">Hello</MyCustomComponent>`;
    const transformed = await transform(code);
    expect(transformed).toBeDefined();
    expect(transformed?.code).toMatchSnapshot();

    const getElement = new Function('React', 'output', transformed!.code!);

    const output: { element: React.ReactNode | undefined } = {
      element: undefined,
    };
    getElement(React, output);

    expect(await render(output.element, { pretty: true })).toMatchSnapshot();
  });
});
