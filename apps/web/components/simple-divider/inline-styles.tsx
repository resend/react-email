import { Hr, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <>
    <Text>Before divider</Text>
    <Hr
      style={{
        marginTop: 16,
        borderColor: "#cccccc",
        marginBottom: 16,
        borderTopWidth: 2,
      }}
    />
    <Text>After divider</Text>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
