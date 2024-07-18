import { Button, Column, Row } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Two buttons";

export const TwoButtons = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Row>
        <Column align="center">
          <Row>
            <td align="center" className="pr-4 w-1/2" colSpan={1}>
              <Button
                className="w-full box-border px-5 py-3 rounded-lg bg-indigo-600 text-center font-semibold text-white"
                href="https://react.email"
              >
                Explore
              </Button>
            </td>
            <td align="center" className="pl-4 w-1/2" colSpan={1}>
              <Button
                className="w-full box-border px-5 py-3 rounded-lg border border-solid text-center border-gray-200 bg-white font-semibold text-gray-900"
                href="https://react.email"
              >
                Buy
              </Button>
            </td>
          </Row>
        </Column>
      </Row>
      {/* end pattern code */}
    </Layout>
  );
};

export default TwoButtons;
