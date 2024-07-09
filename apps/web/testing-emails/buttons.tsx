import {
  Body,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
} from "@react-email/components";
import { button } from "../src/components/patterns/buttons/button";
import { twoButtons } from "../src/components/patterns/buttons/two-buttons";

const Buttons = () => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans antialiased">
          <Container className="my-[40px] rounded-[4px]">
            <Section>
              {button}
            </Section>
            <Section>
              {twoButtons}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Buttons;
