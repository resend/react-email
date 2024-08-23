import { Column, Row } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <>
    <Row>
      <Column align="center" className="h-[40px] w-1/2 bg-emerald-400/60">
        Half
      </Column>
      <Column align="center" className="h-[40px] w-1/2 bg-cyan-400/60">
        Half
      </Column>
    </Row>
    <Row>
      <Column align="center" className="h-[40px] w-1/3 bg-pink-400/60">
        A third
      </Column>
      <Column align="center" className="h-[40px] w-2/3 bg-purple-400/60">
        Two thirds
      </Column>
    </Row>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
