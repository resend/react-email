import { Button as BaseButton } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "One button";

export const Button = () => {
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

export default Button;
