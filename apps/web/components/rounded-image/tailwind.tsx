import { Img } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <Img
    alt="Stagg Electric Kettle"
    className="mx-auto rounded-[12px]"
    height={250}
    src="/static/stagg-eletric-kettle.jpg"
  />
);

export default () => {
  return <Layout>{component}</Layout>;
};
