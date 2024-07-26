import { Button as BaseButton } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "One button";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <BaseButton
        className="w-full box-border px-3 rounded-lg text-center bg-indigo-600 py-3 font-semibold text-white"
        href="https://react.email"
      >
        Example button
      </BaseButton>
      {/* end pattern code */}
    </Layout>
  );
};

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <BaseButton
        href="https://react.email"
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: 12,
          fontWeight: 600,
          borderRadius: 8,
          textAlign: "center",
          backgroundColor: "rgb(79,70,229)",
          color: "rgb(255,255,255)",
        }}
      >
        Example button
      </BaseButton>
      {/* end pattern code */}
    </Layout>
  );
};

export default InlineStyles;
