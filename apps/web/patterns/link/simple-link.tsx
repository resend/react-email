import { Link } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple link";

export const SimpleLink = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Link href="https://react.email">React Email</Link>
      {/* end pattern code */}
    </Layout>
  );
};

export default SimpleLink;
