import { Button, Column, Row } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Two buttons";

export const Tailwind = () => {
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

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Row>
        <Column align="center">
          <Row>
            <td
              align="center"
              colSpan={1}
              style={{ paddingRight: 16, width: "50%" }}
            >
              <Button
                href="https://react.email"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 12,
                  paddingBottom: 12,
                  borderRadius: 8,
                  backgroundColor: "rgb(79,70,229)",
                  textAlign: "center",
                  fontWeight: 600,
                  color: "rgb(255,255,255)",
                }}
              >
                Explore
              </Button>
            </td>
            <td
              align="center"
              colSpan={1}
              style={{ paddingLeft: 16, width: "50%" }}
            >
              <Button
                href="https://react.email"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 12,
                  paddingBottom: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "rgb(229,231,235)",
                  textAlign: "center",
                  fontWeight: 600,
                  color: "rgb(255,255,255)",
                }}
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

export default Tailwind;
