import {
  Heading,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Layout } from "../_components/layout";

export const component = (
  <Row>
    <Hr className="mb-[0px] mt-[16px] border-gray-300" />
    <Section>
      {[
        {
          name: "Steve Jobs",
          title: "Co-Founder & CEO",
          imgSrc: "/static/steve-jobs.jpg",
          showDivider: true,
        },
        {
          name: "Steve Wozniak",
          title: "Co-Founder & CTO",
          imgSrc: "/static/steve-wozniak.jpg",
          showDivider: false,
        },
      ].map((author, index) => (
        <>
          <Section className="mt-[16px] max-w-[288px] text-left" key={index}>
            <Section className="mt-[6px] inline-block max-h-[48px] max-w-[48px] text-left">
              <Img
                alt={author.name}
                className="block h-[48px] w-[48px] rounded-full object-cover object-center"
                src={author.imgSrc}
              />
            </Section>
            <Section className="ml-[16px] inline-block max-w-[120px] text-left align-top">
              <Heading
                as="h3"
                className="m-0 text-[14px] font-medium leading-[20px] text-gray-900"
              >
                {author.name}
              </Heading>
              <Text className="m-0 text-[12px] font-medium leading-[16px] text-gray-500">
                {author.title}
              </Text>
              <Section className="mt-[4px]">
                <Link className="inline-flex h-[12px] w-[12px]" href="#">
                  <Img
                    alt="X"
                    src="/static/x-icon.png"
                    style={{ height: "12px", width: "12px" }}
                  />
                </Link>
                <Link
                  className="ml-[8px] inline-flex h-[12px] w-[12px]"
                  href="#"
                >
                  <Img
                    alt="LinkedIn"
                    src="/static/in-icon.png"
                    style={{ height: "12px", width: "12px" }}
                  />
                </Link>
              </Section>
            </Section>
          </Section>
          {author.showDivider ? (
            <Hr className="float-left mr-[16px] inline-block h-[58px] w-[1px] border-none bg-gray-300" />
          ) : null}
        </>
      ))}
    </Section>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
