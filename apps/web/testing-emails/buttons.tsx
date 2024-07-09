import {
  Body,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
} from "@react-email/components";
import { button } from "./patterns/buttons/button";
import { twoButtons } from "./patterns/buttons/two-buttons";
import { downloadAppButtons } from "./patterns/buttons/download-app-buttons";
import tailwindConfig from "./tailwind.config";

const Buttons = () => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-white font-sans antialiased">
          <Container className="my-[40px] rounded-[4px]">
            <Section>
              {button}
            </Section>
            <Section>
              {twoButtons}
            </Section>
            <Section>
              {downloadAppButtons}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Buttons;
