const CodeSnippet = ({ children }) => {
  return (
    <code className="m-0.5 inline-block rounded-md bg-white/10 p-1 font-mono leading-none text-slate-12">
      {children}
    </code>
  );
};

export default CodeSnippet;
