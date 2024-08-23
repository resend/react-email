import { Img } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <>
    <Img
      alt="Atoms Vacuum Canister"
      className="mx-auto my-[12px] rounded-[12px]"
      height={150}
      src="/static/atmos-vacuum-canister.jpg"
    />
    <Img
      alt="Atoms Vacuum Canister"
      className="mx-auto my-[12px] rounded-[12px]"
      height={200}
      src="/static/atmos-vacuum-canister.jpg"
    />
    <Img
      alt="Atoms Vacuum Canister"
      className="mx-auto my-[12px] rounded-[12px]"
      height={250}
      src="/static/atmos-vacuum-canister.jpg"
    />
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
