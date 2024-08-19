import { Button, Row, Img, Section, Text } from "@react-email/components";
import { ResponsiveRow, ResponsiveColumn } from "@responsive-email/react-email";
import { Layout } from "../_components/layout";

export const component = (
  <Section className="my-4">
    <Row>
      <Text className="m-0 text-xl font-semibold text-gray-900">
        Unleash Creativity
      </Text>
      <Text className="mt-2 text-base text-gray-500">
        Unleash your inner designer with our customizable furniture options,
        allowing you to create a space that reflects your unique vision
      </Text>
    </Row>
    <ResponsiveRow className="mt-4">
      <ResponsiveColumn className="py-4 pr-1 text-left">
        <Img
          alt="A picture of a pink background with varios items laid out. Shoes, lipstick, sunglasses, some leafs and part of a purse."
          className="w-full rounded-lg object-cover"
          height={180}
          src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Text className="m-0 mt-6 text-xl font-semibold text-gray-900">
          Sleek study
        </Text>
        <Text className="m-0 mt-4 text-base text-gray-500">
          Minimalist design with ample workspace
        </Text>
        <Text className="m-0 mt-2 text-base font-semibold text-gray-900">
          $999.99
        </Text>
        <Button
          className="mt-4 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white"
          href="https://react.email"
        >
          Buy
        </Button>
      </ResponsiveColumn>
      <ResponsiveColumn className="px-1 py-4 text-left">
        <Img
          alt="A picture of a two shampoos beside a box. All of them have text on them that reads 'Cureology'."
          className="w-full rounded-lg object-cover"
          height={180}
          src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=2789&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Text className="m-0 mt-6 text-xl font-semibold text-gray-900">
          Sleek study
        </Text>
        <Text className="m-0 mt-4 text-base text-gray-500">
          Minimalist design with ample workspace
        </Text>
        <Text className="m-0 mt-2 text-base font-semibold text-gray-900">
          $999.99
        </Text>
        <Button
          className="mt-4 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white"
          href="https://react.email"
        >
          Buy
        </Button>
      </ResponsiveColumn>
      <ResponsiveColumn className="py-4 pl-1 text-left">
        <Img
          alt="A picture of various Apple products laid out on a table. There is an Apple Watch with its box bellow it, there is a MacBook Pro with its box bellow it, there is an Iphone with some box bellow it, there is an Apple Keyboard, and some other items that can't quite be recognized from the picture"
          className="w-full rounded-lg object-cover"
          height={180}
          src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Text className="m-0 mt-6 text-xl font-semibold text-gray-900">
          Sleek study
        </Text>
        <Text className="m-0 mt-4 text-base text-gray-500">
          Minimalist design with ample workspace
        </Text>
        <Text className="m-0 mt-2 text-base font-semibold text-gray-900">
          $999.99
        </Text>
        <Button
          className="mt-4 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white"
          href="https://react.email"
        >
          Buy
        </Button>
      </ResponsiveColumn>
    </ResponsiveRow>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
