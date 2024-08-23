import { Column, Row } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <>
    <Row cellSpacing={8}>
      <Column
        align="center"
        style={{
          width: "50%",
          height: 40,
          backgroundColor: "rgb(52,211,153,0.6)",
        }}
      >
        Half
      </Column>
      <Column
        align="center"
        style={{
          width: "50%",
          height: 40,
          backgroundColor: "rgb(34,211,238,0.6)",
        }}
      >
        Half
      </Column>
    </Row>
    <Row>
      <Column
        align="center"
        style={{
          width: "33.3333%",
          height: 40,
          backgroundColor: "rgb(244,114,182,0.6)",
        }}
      >
        A third
      </Column>
      <Column
        align="center"
        style={{
          width: "66.6666%",
          height: 40,
          backgroundColor: "rgb(192,132,252,0.6)",
        }}
      >
        Two thirds
      </Column>
    </Row>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
