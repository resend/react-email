import { Link } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple link";

export const None = () => {
  return <Link href="https://react.email">React Email</Link>;
};

export default () => (
  <Layout>
    <None />
  </Layout>
);
