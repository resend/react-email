import type * as React from 'react';

interface BorderWrapperProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

interface BorderProperties {
  border?: React.CSSProperties['border'];
  borderTop?: React.CSSProperties['borderTop'];
  borderRight?: React.CSSProperties['borderRight'];
  borderBottom?: React.CSSProperties['borderBottom'];
  borderLeft?: React.CSSProperties['borderLeft'];
  borderWidth?: React.CSSProperties['borderWidth'];
  borderStyle?: React.CSSProperties['borderStyle'];
  borderColor?: React.CSSProperties['borderColor'];
  borderRadius?: React.CSSProperties['borderRadius'];
  borderTopLeftRadius?: React.CSSProperties['borderTopLeftRadius'];
  borderTopRightRadius?: React.CSSProperties['borderTopRightRadius'];
  borderBottomLeftRadius?: React.CSSProperties['borderBottomLeftRadius'];
  borderBottomRightRadius?: React.CSSProperties['borderBottomRightRadius'];
}

/**
 * Detects if both border and borderRadius are present in the style object
 */
export const hasBorderAndBorderRadius = (
  style?: React.CSSProperties,
): boolean => {
  if (!style) return false;

  const hasBorder =
    style.border ||
    style.borderTop ||
    style.borderRight ||
    style.borderBottom ||
    style.borderLeft ||
    style.borderWidth ||
    style.borderStyle ||
    style.borderColor;

  const hasBorderRadius =
    style.borderRadius ||
    style.borderTopLeftRadius ||
    style.borderTopRightRadius ||
    style.borderBottomLeftRadius ||
    style.borderBottomRightRadius;

  return Boolean(hasBorder && hasBorderRadius);
};

/**
 * Extracts border properties from style object
 */
export const extractBorderProperties = (
  style?: React.CSSProperties,
): BorderProperties | null => {
  if (!style) return null;

  const borderProps: BorderProperties = {
    border: style.border,
    borderTop: style.borderTop,
    borderRight: style.borderRight,
    borderBottom: style.borderBottom,
    borderLeft: style.borderLeft,
    borderWidth: style.borderWidth,
    borderStyle: style.borderStyle,
    borderColor: style.borderColor,
    borderRadius: style.borderRadius,
    borderTopLeftRadius: style.borderTopLeftRadius,
    borderTopRightRadius: style.borderTopRightRadius,
    borderBottomLeftRadius: style.borderBottomLeftRadius,
    borderBottomRightRadius: style.borderBottomRightRadius,
  };

  // Check if any border properties exist
  const hasBorderProps = Object.values(borderProps).some(Boolean);
  return hasBorderProps ? borderProps : null;
};

/**
 * Creates a wrapper table that simulates border with background color and padding
 * This approach provides full border-radius support across all email clients
 */
export const BorderWrapper: React.FC<BorderWrapperProps> = ({
  children,
  style,
  ...props
}) => {
  const borderProps = extractBorderProperties(style);

  if (!borderProps) {
    // No border properties, render children directly
    return <>{children}</>;
  }

  // Extract border color and width for the wrapper
  const borderColor =
    borderProps.borderColor ||
    (typeof borderProps.border === 'string' &&
    borderProps.border.includes('solid')
      ? borderProps.border.split('solid')[1]?.trim()
      : undefined);

  const borderWidth =
    borderProps.borderWidth ||
    (typeof borderProps.border === 'string'
      ? Number.parseInt(borderProps.border.split('px')[0]) || 1
      : 1);

  // Create style without border properties for the inner element
  const innerStyle = { ...style };
  delete innerStyle.border;
  delete innerStyle.borderTop;
  delete innerStyle.borderRight;
  delete innerStyle.borderBottom;
  delete innerStyle.borderLeft;
  delete innerStyle.borderWidth;
  delete innerStyle.borderStyle;
  delete innerStyle.borderColor;

  return (
    <table
      align="center"
      width="100%"
      border={0}
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={{
        backgroundColor: borderColor,
        padding: borderWidth,
        borderRadius: borderProps.borderRadius,
        borderTopLeftRadius: borderProps.borderTopLeftRadius,
        borderTopRightRadius: borderProps.borderTopRightRadius,
        borderBottomLeftRadius: borderProps.borderBottomLeftRadius,
        borderBottomRightRadius: borderProps.borderBottomRightRadius,
      }}
      {...props}
    >
      <tbody>
        <tr>
          <td style={innerStyle}>{children}</td>
        </tr>
      </tbody>
    </table>
  );
};
