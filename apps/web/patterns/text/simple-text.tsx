import { Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple text";

export const None = () => {
  return (
    <Text>A simple paragraph</Text>
  );
};

export default () => <Layout><None/></Layout>;
