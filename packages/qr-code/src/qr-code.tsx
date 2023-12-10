import * as React from "react";
import QRCode from "qrcode.react";

export interface QrProps {
  value: string;
  renderAs?: "canvas" | "svg" | undefined;
  size: number;
  style?: React.CSSProperties;
  bgColor?: string | undefined;
  fgColor?: string | undefined;
  correctionLevel: "L" | "M" | "H";
  includeMargin?: boolean | undefined;
  iconSrc?: string | undefined;
  iconSize?: number | undefined;
  iconBg?: boolean | undefined;
}

interface IconSettings {
  src: string;
  x: number | undefined;
  y: number | undefined;
  height: number;
  width: number;
  excavate: boolean;
}

export const QrCode: React.FC<QrProps> = ({
  value,
  renderAs,
  size,
  style,
  bgColor,
  fgColor,
  correctionLevel,
  includeMargin,
  iconSrc,
  iconSize,
  iconBg,
  ...props
}) => {
  if (!value) {
    return null;
  }

  if (iconSrc) {
    const imgSettings: IconSettings = {
      src: iconSrc || "",
      excavate: typeof iconBg === "undefined" ? true : iconBg,
      height: iconSize || size / 10,
      width: iconSize || size / 10,
      x: undefined,
      y: undefined,
    };
    return (
      <div {...props} style={style}>
        <QRCode
          bgColor={typeof bgColor === "undefined" ? "#FFFFFF" : bgColor}
          fgColor={typeof fgColor === "undefined" ? "#000000" : fgColor}
          imageSettings={imgSettings}
          includeMargin={
            typeof includeMargin === "undefined" ? false : includeMargin
          }
          level={correctionLevel}
          renderAs={typeof renderAs === "undefined" ? "canvas" : renderAs}
          size={size}
          value={value}
        />
      </div>
    );
  } else {
    return (
      <div {...props} style={style}>
        <QRCode
          bgColor={typeof bgColor === "undefined" ? "#FFFFFF" : bgColor}
          fgColor={typeof fgColor === "undefined" ? "#000000" : fgColor}
          includeMargin={
            typeof includeMargin === "undefined" ? false : includeMargin
          }
          level={correctionLevel}
          renderAs={typeof renderAs === "undefined" ? "canvas" : renderAs}
          size={size}
          value={value}
        />
      </div>
    );
  }
};
