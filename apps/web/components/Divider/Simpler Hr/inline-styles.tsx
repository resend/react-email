import { Hr, Text } from "@react-email/components";

export const component = (
  <>
    <Text>Before hr</Text>
    <Hr style={{ marginTop: 16, marginBottom: 16, borderTopWidth: 2 }} />
    <Text>After hr</Text>
  </>
);
