export const pages = [
  {
    title: '_app.tsx',
    content:
      "import '../styles/globals.css';\nimport type { AppProps } from 'next/app';\nimport { Inter } from '@next/font/google';\nimport classnames from 'classnames';\nimport Head from 'next/head';\nimport { Tooltip } from '../components/tooltip';\n\nexport const inter = Inter({\n  subsets: ['latin'],\n  variable: '--font-inter',\n});\n\nfunction MyApp({ Component, pageProps }: AppProps) {\n  return (\n    <div className={classnames(inter.variable, 'font-sans')}>\n      <Head>\n        <title>React Email</title>\n      </Head>\n      <Tooltip.Provider>\n        <Component {...pageProps} />\n      </Tooltip.Provider>\n    </div>\n  );\n}\n\nexport default MyApp;\n",
  },
  {
    title: '_document.tsx',
    content:
      'import { Html, Head, Main, NextScript } from \'next/document\';\n\nexport default function Document() {\n  return (\n    <Html lang="en">\n      <Head />\n      <body className="bg-black text-slate-12 font-sans">\n        <Main />\n        <NextScript />\n      </body>\n    </Html>\n  );\n}\n',
  },
  {
    title: 'index.tsx',
    content:
      "import { promises as fs } from 'fs';\nimport path from 'path';\nimport { Button, Heading, Text } from '../components';\nimport { Layout } from '../components/layout';\nimport Link from 'next/link';\n\ninterface HomeProps {}\n\nexport const CONTENT_DIR = 'emails';\n\nconst getEmails = async () => {\n  const emailsDirectory = path.join(process.cwd(), CONTENT_DIR);\n\n  const filenames = await fs.readdir(emailsDirectory);\n  const emails = filenames\n    .map((file) => file.replace(/\\.(jsx|tsx)$/g, ''))\n    .filter((file) => file !== 'components');\n\n  return emails;\n};\n\nexport async function getStaticProps({ params }) {\n  try {\n    const emails = await getEmails();\n    return emails\n      ? { props: { navItems: emails } }\n      : { props: { navItems: [] } };\n  } catch (error) {\n    console.error(error);\n    return { props: { navItems: [] } };\n  }\n}\n\nconst Home: React.FC<Readonly<HomeProps>> = ({ navItems }: any) => {\n  return (\n    <Layout navItems={navItems}>\n      <div className=\"max-w-md border border-slate-6 mx-auto mt-56 rounded-md p-8\">\n        <Heading as=\"h2\" weight=\"medium\">\n          Welcome to the React Email preview!\n        </Heading>\n        <Text as=\"p\" className=\"mt-2 mb-4\">\n          To start developing your next email template, you can create a{' '}\n          <code>.jsx</code> or <code>.tsx</code> file under the \"emails\" folder.\n        </Text>\n\n        <Button asChild>\n          <Link href=\"https://react.email/docs\">Check the docs</Link>\n        </Button>\n      </div>\n    </Layout>\n  );\n};\n\nexport default Home;\n",
  },
  {
    dir: 'preview',
    title: '[slug].tsx',
    content:
      "import * as React from 'react';\nimport { promises as fs } from 'fs';\nimport path from 'path';\nimport { render } from '@react-email/render';\nimport { GetStaticPaths } from 'next';\nimport { Layout } from '../../components/layout';\nimport { CodeContainer } from '../../components/code-container';\nimport Head from 'next/head';\nimport { useRouter } from 'next/router';\n\ninterface PreviewProps {\n  navItems: string;\n  markup: string;\n  reactMarkup: string;\n  slug: string;\n}\n\nexport const CONTENT_DIR = 'emails';\n\nconst getEmails = async () => {\n  const emailsDirectory = path.join(process.cwd(), CONTENT_DIR);\n  const filenames = await fs.readdir(emailsDirectory);\n  const emails = filenames\n    .map((file) => file.replace(/\\.(jsx|tsx)$/g, ''))\n    .filter((file) => file !== 'components');\n  return { emails, filenames };\n};\n\nexport const getStaticPaths: GetStaticPaths = async () => {\n  const { emails } = await getEmails();\n  const paths = emails.map((email) => {\n    return { params: { slug: email } };\n  });\n  return { paths, fallback: true };\n};\n\nexport async function getStaticProps({ params }) {\n  try {\n    const { emails, filenames } = await getEmails();\n    const template = filenames.filter((email) => {\n      const [fileName] = email.split('.');\n      return params.slug === fileName;\n    });\n\n    const Email = (await import(`../../../emails/${params.slug}`)).default;\n    const markup = render(<Email />, { pretty: true });\n    const plainText = render(<Email />, { plainText: true });\n    const path = `${process.cwd()}/${CONTENT_DIR}/${template[0]}`;\n    const reactMarkup = await fs.readFile(path, {\n      encoding: 'utf-8',\n    });\n\n    return emails\n      ? {\n          props: {\n            navItems: emails,\n            slug: params.slug,\n            markup,\n            reactMarkup,\n            plainText,\n          },\n        }\n      : { notFound: true };\n  } catch (error) {\n    console.error(error);\n    return { notFound: true };\n  }\n}\n\nconst Preview: React.FC<Readonly<PreviewProps>> = ({\n  navItems,\n  markup,\n  reactMarkup,\n  plainText,\n  slug,\n}: any) => {\n  const title = `${slug} — React Email`;\n  const router = useRouter();\n  const [viewMode, setViewMode] = React.useState('desktop');\n\n  const handleViewMode = (mode: string) => {\n    setViewMode(mode);\n\n    router.push({\n      pathname: router.pathname,\n      query: {\n        ...router.query,\n        view: mode,\n      },\n    });\n  };\n\n  React.useEffect(() => {\n    if (router.query.view === 'source' || router.query.view === 'desktop') {\n      setViewMode(router.query.view);\n    }\n  }, [router.query.view]);\n\n  return (\n    <Layout\n      navItems={navItems}\n      title={slug}\n      viewMode={viewMode}\n      setViewMode={handleViewMode}\n      markup={markup}\n    >\n      <Head>\n        <title>{title}</title>\n      </Head>\n      {viewMode === 'desktop' ? (\n        <iframe srcDoc={markup} className=\"w-full h-[calc(100vh_-_70px)]\" />\n      ) : (\n        <div className=\"flex gap-6 mx-auto p-6 max-w-3xl\">\n          <CodeContainer\n            markups={[\n              { language: 'jsx', content: reactMarkup },\n              { language: 'markup', content: markup },\n              { language: 'markdown', content: plainText },\n            ]}\n          />\n        </div>\n      )}\n    </Layout>\n  );\n};\n\nexport default Preview;\n",
  },
];
