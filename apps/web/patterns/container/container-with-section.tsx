import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Butcherman } from "next/font/google";

export const title = "Container with section";

export const ContainerWithSection = () => {
  return (
    <Html>
      <Head>
        <Font
          fallbackFontFamily="Helvetica"
          fontFamily="Inter"
          fontStyle="normal"
          fontWeight={400}
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter&display=swap",
            format: "woff2",
          }}
        />
      </Head>

      <Body>
        <Tailwind>
          {/* start pattern code */}
          <Container>
            <Section>
              <Row>
                <Column>This is something amazing</Column>
                <Column align="right">
                  <Img
                    src="/static/logo.png"
                  />
                </Column>
              </Row>
            </Section>

            <Section align="center" className="my-4">
              <Button
                className="bg-indigo-600 text-white w-full px-6 box-border py-3 text-center rounded-md"
                href="https://react.email"
              >
                See more
              </Button>
            </Section>
          </Container>
          {/* end pattern code */}
        </Tailwind>
      </Body>
    </Html>
  );
};

export default ContainerWithSection;
