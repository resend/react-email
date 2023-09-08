import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import type { Struct } from 'superstruct';
import titleize from 'titleize';
import App from './App.tsx';
import RootLayout from './layout.tsx';
import ErrorPage from './error.tsx';
import './index.css';
import './globals.css';

interface TemplateExports {
  Template: React.ExoticComponent;
  TemplateName?: string;
  TemplateStruct?: Struct;
}

const parseName = (path: string) => {
  const chunks = path.replace('\\', '/').split('/');
  const segment = chunks.at(-1);
  const basename = segment!.split(/\.[^.]+$/)[0];

  return titleize(basename);
};

const templatePaths = JSON.parse(import.meta.env.VITE_EMAIL_COMPONENTS) as string[];
const templates = await Promise.all(
  templatePaths.map<Promise<TemplateExports>>(async (path) => {
    const template = (await import(/* @vite-ignore */ path)) as TemplateExports;
    const result: TemplateExports = {
      Template: template.Template || (template as any).default,
      TemplateName: template.TemplateName || parseName(path),
      TemplateStruct: template.TemplateStruct
    };

    return result;
  })
);

const templateRoutes: RouteObject[] = templates.map((template) => {
  const Component = template.Template || (template as any).default;
  const element = (
    <>
      <pre>
        <Component />
      </pre>
    </>
  );
  return { element, path: `/${template.TemplateName}` };
});

const templateNames = templates.map((template) => template.TemplateName!);

const router = createBrowserRouter([
  {
    element: (
      <RootLayout>
        <App navItems={templateNames} />
      </RootLayout>
    ),
    errorElement: <ErrorPage />,
    path: '/'
  },
  ...templateRoutes
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
