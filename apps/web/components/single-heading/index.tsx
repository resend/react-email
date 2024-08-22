import { Heading } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = <Heading>Simple h1 heading</Heading>;

export default () => {
  return <Layout>{component}</Layout>;
};
