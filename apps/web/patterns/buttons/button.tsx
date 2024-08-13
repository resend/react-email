import { Button as BaseButton } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "One button";

export const Tailwind = () => {
  return (
    <BaseButton
      className="box-border w-full rounded-lg bg-indigo-600 px-3 py-3 text-center font-semibold text-white"
      href="https://react.email"
    >
      Example button
    </BaseButton>
  );
};

export const InlineStyles = () => {
  return (
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
  );
};

export default () => {
  return (
    <Layout>
      <InlineStyles />
    </Layout>
  );
};
