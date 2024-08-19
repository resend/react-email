import { Button, Column, Row } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component =  (
  <Row>
    <Column align="center">
      <Row>
        <td align="center" className="w-1/2 pr-4" colSpan={1}>
          <Button
            className="box-border w-full rounded-lg bg-indigo-600 px-5 py-3 text-center font-semibold text-white"
            href="https://react.email"
          >
            Explore
          </Button>
        </td>
        <td align="center" className="w-1/2 pl-4" colSpan={1}>
          <Button
            className="box-border w-full rounded-lg border border-solid border-gray-200 bg-white px-5 py-3 text-center font-semibold text-gray-900"
            href="https://react.email"
          >
            Buy
          </Button>
        </td>
      </Row>
    </Column>
  </Row>
);

export default () => {
  return <Layout>
    {component}
  </Layout>;
};
