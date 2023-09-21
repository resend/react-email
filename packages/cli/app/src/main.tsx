import { render } from '@jsx-email/render';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import { create, type Struct } from 'superstruct';
import titleize from 'titleize';

import { Error } from './error.tsx';
import { Home } from './home.tsx';
import { Layout } from './layout.tsx';
import { Preview } from './preview.tsx';

interface TemplateExports {
  Name?: string;
  PreviewProps?: () => any;
  Struct?: Struct;
  Template: React.ExoticComponent;
}

interface TemplateData extends TemplateExports {
  jsx: string;
}

const parseName = (path: string) => {
  const chunks = path.replace('\\', '/').split('/');
  const segment = chunks.at(-1);
  const basename = segment!.split(/\.[^.]+$/)[0];

  return titleize(basename);
};

const templatePaths = JSON.parse(import.meta.env.VITE_EMAIL_COMPONENTS) as string[];
const templates = await Promise.all(
  templatePaths.map<Promise<TemplateData>>(async (path) => {
    const fileName = path.split(/[/\\]/).at(-1);
    const template = (await import(/* @vite-ignore */ path)) as TemplateExports;
    const response = await fetch(`/${fileName}`);
    const source = await response.text();
    const result: TemplateData = {
      jsx: source,
      Name: template.Name || parseName(path),
      PreviewProps: template.PreviewProps,
      Struct: template.Struct,
      Template: template.Template || (template as any).default
    };

    return result;
  })
);

const templateNames = templates.map((template) => template.Name!);

const templateRoutes: RouteObject[] = templates.map((template) => {
  const { Name, PreviewProps, Struct, Template } = template;
  let props: any;

  if (Struct) props = create({}, Struct);
  else if (PreviewProps) props = PreviewProps();
  else if ((Template as any).PreviewProps) {
    console.warn(
      `jsx-email: ${Name} → PreviewProps as a property of a component is deprecated. Please used a named export.`
    );
    props = (Template as any).PreviewProps;
  }

  const html = render(<Template {...props} />, { pretty: true });
  const plainText = render(<Template {...props} />, { plainText: true });
  const element = (
    <Layout>
      <Preview {...{ html, jsx: template.jsx, plainText, templateNames, title: Name! }} />
    </Layout>
  );
  return { element, path: `/${template.Name}` };
});

const router = createBrowserRouter([
  {
    element: (
      <Layout>
        <Home templateNames={templateNames} />
      </Layout>
    ),
    errorElement: <Error />,
    path: '/'
  },
  ...templateRoutes
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
