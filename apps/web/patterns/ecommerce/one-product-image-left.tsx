import { Button, Img, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "One product with image on the left";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Section className="my-4">
        <table className="w-full">
          <tbody className="w-full">
            <tr className="w-full">
              <td className="w-1/2 pr-8 box-border">
                <Img
                  alt="An aesthetic picture taken of an Iphone, flowers, glasses and a card that reads 'Gucci, bloom' coming out of a leathered bag with a ziper"
                  className="rounded-lg w-full object-cover"
                  height={220}
                  src="https://images.unsplash.com/photo-1611254666354-d75bfe3cadbc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </td>
              <td className="w-1/2 align-baseline">
                <Text className="m-0 mt-2 text-xl font-semibold text-gray-900">
                  Sleek Storage
                </Text>
                <Text className="mt-2 text-base text-gray-500">
                  Contemporary design with ample storage space, perfect for
                  organizing your essentials.
                </Text>
                <Text className="mt-2 text-lg font-semibold text-gray-900">
                  $599.99
                </Text>
                <Button
                  className="w-3/4 rounded-lg bg-indigo-600 py-3 px-4 text-center font-semibold text-white"
                  href="https://react.email"
                >
                  Buy
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Section style={{ marginTop: 16, marginBottom: 16 }}>
        <table style={{ width: "100%" }}>
          <tbody style={{ width: "100%" }}>
            <tr style={{ width: "100%" }}>
              <td
                style={{
                  width: "50%",
                  paddingRight: 32,
                  boxSizing: "border-box",
                }}
              >
                <Img
                  alt="An aesthetic picture taken of an Iphone, flowers, glasses and a card that reads 'Gucci, bloom' coming out of a leathered bag with a ziper"
                  height={220}
                  src="https://images.unsplash.com/photo-1611254666354-d75bfe3cadbc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  style={{
                    borderRadius: 8,
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </td>
              <td style={{ width: "50%", verticalAlign: "baseline" }}>
                <Text
                  style={{
                    margin: 0,
                    marginTop: 8,
                    fontSize: 20,
                    lineHeight: 28,
                    fontWeight: 600,
                    color: "rgb(17,24,39)",
                  }}
                >
                  Sleek Storage
                </Text>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 16,
                    lineHeight: 24,
                    color: "rgb(107,114,128)",
                  }}
                >
                  Contemporary design with ample storage space, perfect for
                  organizing your essentials.
                </Text>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 18,
                    lineHeight: 28,
                    fontWeight: 600,
                    color: "rgb(17,24,39)",
                  }}
                >
                  $599.99
                </Text>
                <Button
                  href="https://react.email"
                  style={{
                    width: "75%",
                    borderRadius: 8,
                    backgroundColor: "rgb(79,70,229)",
                    paddingTop: 12,
                    paddingBottom: 12,
                    paddingLeft: 16,
                    paddingRight: 16,
                    textAlign: "center",
                    fontWeight: 600,
                    color: "rgb(255,255,255)",
                  }}
                >
                  Buy
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export default Tailwind;
