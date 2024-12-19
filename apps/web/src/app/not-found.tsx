import PageTransition from "@/components/page-transition";

export const metadata = {
  title: "404 Not found",
  alternates: {
    canonical: "/not-found",
  },
};

const NotFound = () => (
  <>
    <div className="pointer-events-none absolute inset-0 flex justify-center">
      <div className="hidden h-full w-full max-w-7xl grid-cols-2 gap-4 px-4 lg:grid">
        <div className="border-l border-l-slate-4 border-r-slate-3" />
        <div className="border-r border-r-slate-4" />
      </div>
    </div>
    <PageTransition
      className="flex w-full flex-col items-center justify-center gap-2 px-8 pb-10 pt-16 text-center"
      key="not-found"
      tag="main"
    >
      <h1 className="text-2xl font-bold uppercase italic text-slate-12">
        <span className="font-mono">404</span> <br />
        Not Found
      </h1>
      <div className="mt-1 leading-loose">
        <p>This page does not exist.</p>
        <p>Please check the URL and try again.</p>
      </div>
    </PageTransition>
  </>
);

export default NotFound;
