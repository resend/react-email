import { Button as BaseButton } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <BaseButton
    className="box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white"
    href="https://react.email"
  >
    Get started
  </BaseButton>
);

export default () => {
  return <Layout>{component}</Layout>;
};
