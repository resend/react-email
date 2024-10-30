import * as React from "react";

const ResolvePromise = ({ dataPromise }: { dataPromise: Promise<string> }) => {
  const data = React.use(dataPromise);
  return <div dangerouslySetInnerHTML={{ __html: data }} />;
};

export const WithSuspense = () => {
  const exampleData = fetch("https://example.com").then((res) => res.text());

  return (
    <React.Suspense fallback={<div>loading...</div>}>
      <ResolvePromise dataPromise={exampleData} />
    </React.Suspense>
  );
};
