import { CodeInline, Text } from "@react-email/components";

export const component =  (
  <Text>
    Install the{" "}
    <CodeInline
      style={{
        backgroundColor: "rgb(134,239,172)",
        borderRadius: 6,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 2,
        paddingBottom: 2,
      }}
    >
      @react-email/components
    </CodeInline>{" "}
    package
  </Text>
);
