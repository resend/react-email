// https://stackoverflow.com/a/61410824

export const styleToString = (style: React.CSSProperties) => {
  return (Object.keys(style) as (keyof React.CSSProperties)[]).reduce(
    (acc, key) =>
      acc +
      key
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase() +
      ':' +
      style[key] +
      ';',
    '',
  );
};
