/**
 * Creates a style inlining function that converts an element's className into inlined React styles - based on the
 * {@link stylePerClass} map - for all classes also.
 *
 * Also returns residual classes that could not be found on the map.
 */
export function useStyleInlining(
  stylePerClass: Record<string, React.CSSProperties>,
) {
  return (className: string) => {
    const classes = className.split(" ");

    const residualClasses = [];
    let styles: React.CSSProperties = {};

    for (const singleClass of classes) {
      if (singleClass in stylePerClass) {
        styles = {
          ...styles,
          ...stylePerClass[singleClass],
        };
      } else {
        residualClasses.push(singleClass);
      }
    }

    return {
      styles,
      residualClassName: residualClasses.join(" "),
    };
  };
}
