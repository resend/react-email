import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
} from "@react-email/components";

import { CodeBlock, themes } from "@react-email/code-block";

export const CodeBlockExample = () => {
  const code = `export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const html = await renderAsync(
      EmailTemplate({ firstName: 'John' }) as React.ReactElement
    );
    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json({ error });
  }
}`;

  return (
    <Html>
      <Head />
      <Preview>#CodePenChallenge: Cubes</Preview>
      <Body
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <Container
          style={{
            paddingLeft: "12px",
            paddingRight: "12px",
            margin: "0 auto",
          }}
        >
          <Heading
            style={{
              color: "#333",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
              fontSize: "24px",
              fontWeight: "bold",
              margin: "40px 0",
              padding: "0",
            }}
          >
            Hey, Gabriel Miranda,
          </Heading>

          <Text style={paragraphStyle}>
            This is the code that has the issue, can you please take a look into
            fixing it?
          </Text>
          <CodeBlock code={code} theme={themes.dracula} language="rust" />
          <Text style={paragraphStyle}>
            It seems that the problem is very critical, if you can solve it as
            quickly as possible that would be awesome!
          </Text>
          <br />
          <Text style={paragraphStyle}>
            Thanks in advance, <br />
            Someone Jr
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const paragraphStyle = {
  color: "#333",
  marginTop: "14px",
  marginBottom: "16px",
};

export default CodeBlockExample;
