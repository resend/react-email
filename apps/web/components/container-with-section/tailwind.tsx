import {
  Button,
  Column,
  Container,
  Img,
  Row,
  Section,
} from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <Container>
    <Section>
      <Row>
        <Column>This is something amazing</Column>
        <Column align="right">
          <Img src="/static/logo-without-background.png" />
        </Column>
      </Row>
    </Section>

    <Section align="center" className="m-[16px]">
      <Button
        className="box-border w-full rounded-md bg-indigo-600 px-[24px] py-[12px] text-center text-white"
        href="https://react.email"
      >
        See more
      </Button>
    </Section>
  </Container>
);

export default () => {
  return <Layout>{component}</Layout>;
};
