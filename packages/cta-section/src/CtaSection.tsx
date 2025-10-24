import * as React from "react";

export interface CtaSectionProps {
  title: string;
  description?: string;
  buttonText: string;
  buttonUrl: string;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  title,
  description,
  buttonText,
  buttonUrl,
}) => (
  <section style={{ padding: "24px", textAlign: "center" }}>
    <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>{title}</h2>
    {description && <p style={{ marginBottom: "16px" }}>{description}</p>}
    <a
      href={buttonUrl}
      style={{
        display: "inline-block",
        padding: "12px 24px",
        background: "#0070f3",
        color: "#fff",
        borderRadius: "4px",
        textDecoration: "none",
        fontWeight: "bold",
      }}
    >
      {buttonText}
    </a>
  </section>
);
