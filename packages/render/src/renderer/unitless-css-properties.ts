// Same as react-dom's source code but slightly modified at the end
// from: https://github.com/facebook/react/blob/18-3-1/packages/react-dom/src/shared/CSSProperty.js

/**
 * CSS properties which accept numbers but are not in units of "px".
 */
export const isPropWithUnitlessNumber: Record<string, boolean | undefined> = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};

/**
 * @param prefix vendor-specific prefix, eg: Webkit
 * @param prop style name, eg: transitionDuration
 * @return style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function propWithPrefix(prefix: string, prop: string): string {
  return prefix + prop.charAt(0).toUpperCase() + prop.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */
const prefixes = ["Webkit", "ms", "Moz", "O"] as const;

for (const key in isPropWithUnitlessNumber) {
  const prop = key;
  for (const prefix of prefixes) {
    isPropWithUnitlessNumber[propWithPrefix(prefix, prop)] = isPropWithUnitlessNumber[prop];
  }
}
