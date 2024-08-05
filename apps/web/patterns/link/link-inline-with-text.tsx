import { Link, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Link inline with text";

export const None = () => {
  return (
    <Text>
      This is <Link href="https://react.email">React Email</Link>
    </Text>
  );
};

export default () => <Layout><None/></Layout>;
