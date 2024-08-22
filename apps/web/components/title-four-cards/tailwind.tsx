import {
  Button,
  Row,
  Column,
  Img,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <Section className="m-[16px]">
    <Section>
      <Row>
        <Text className="m-0 text-[20px] leading-[28px] font-semibold text-gray-900">
          Unleash Creativity
        </Text>
        <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
          Unleash your inner designer with our customizable furniture options,
          allowing you to create a space that reflects your unique vision
        </Text>
      </Row>
      <Row className="mt-[16px]">
        <Column align="left" className="w-1/2 pr-[8px]" colSpan={1}>
          <Img
            alt="A picture of a pink background with varios items laid out. Shoes, lipstick, sunglasses, some leafs and part of a purse."
            className="w-full rounded-[8px] object-cover"
            height={180}
            src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
          <Text className="m-0 mt-[24px] text-[20px] leading-[28px] font-semibold text-gray-900">
            Sleek study
          </Text>
          <Text className="m-0 mt-[16px] text-[16px] leading-[24px] text-gray-500">
            Minimalist design with ample workspace
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] leading-[24px] font-semibold text-gray-900">
            $999.99
          </Text>
          <Button
            className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
            href="https://react.email"
          >
            Buy
          </Button>
        </Column>
        <Column align="left" className="w-1/2 pl-[8px]" colSpan={1}>
          <Img
            alt="A picture of a two shampoos beside a box. All of them have text on them that reads 'Cureology'."
            className="w-full rounded-[8px] object-cover"
            height={180}
            src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=2789&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
          <Text className="m-0 mt-[24px] text-[20px] leading-[28px] font-semibold text-gray-900">
            Sleek study
          </Text>
          <Text className="m-0 mt-[16px] text-[16px] leading-[24px] text-gray-500">
            Minimalist design with ample workspace
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] leading-[24px] font-semibold text-gray-900">
            $999.99
          </Text>
          <Button
            className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
            href="https://react.email"
          >
            Buy
          </Button>
        </Column>
      </Row>
    </Section>
    <Hr className="mx-0 my-[24px] w-full border border-solid border-gray-200" />
    <Section>
      <Row>
        <Column align="left" className="w-1/2 pr-[8px]" colSpan={1}>
          <Img
            alt="A picture of various Apple products laid out on a table. There is an Apple Watch with its box bellow it, there is a MacBook Pro with its box bellow it, there is an Iphone with some box bellow it, there is an Apple Keyboard, and some other items that can't quite be recognized from the picture"
            className="w-full rounded-[8px] object-cover"
            height={180}
            src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
          <Text className="m-0 mt-[24px] text-[20px] leading-[28px] font-semibold text-gray-900">
            Sleek study
          </Text>
          <Text className="m-0 mt-[16px] text-[16px] leading-[24px] text-gray-500">
            Minimalist design with ample workspace
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] leading-[24px] font-semibold text-gray-900">
            $999.99
          </Text>
          <Button
            className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
            href="https://react.email"
          >
            Buy
          </Button>
        </Column>
        <Column align="left" className="w-1/2 pl-[8px]" colSpan={1}>
          <Img
            alt="A picture of a very nice looking product in a bottle. The bottle has a black tap and it looks like it is brown overall. The product is sitting in front of a bage wall and on top of some wooden round board"
            className="w-full rounded-[8px] object-cover"
            height={180}
            src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
          <Text className="m-0 mt-[24px] text-[20px] leading-[28px] font-semibold text-gray-900">
            Sleek study
          </Text>
          <Text className="m-0 mt-[16px] text-[16px] leading-[24px] text-gray-500">
            Minimalist design with ample workspace
          </Text>
          <Text className="m-0 mt-[8px] text-[16px] leading-[24px] font-semibold text-gray-900">
            $999.99
          </Text>
          <Button
            className="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
            href="https://react.email"
          >
            Buy
          </Button>
        </Column>
      </Row>
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
