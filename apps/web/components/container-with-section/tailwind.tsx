import {
  Button,
  Column,
  Container,
  Img,
  Row,
  Section,
} from "@react-email/components";

export const component =  (
  <Container>
    <Section>
      <Row>
        <Column>This is something amazing</Column>
        <Column align="right">
          <Img src="/static/logo-without-background.png" />
        </Column>
      </Row>
    </Section>

    <Section align="center" className="my-4">
      <Button
        className="box-border w-full rounded-md bg-indigo-600 px-6 py-3 text-center text-white"
        href="https://react.email"
      >
        See more
      </Button>
    </Section>
  </Container>
);
