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
    <Hr className="my-4 border-gray-300" />
    <Section className="flex">
      {[
        {
          name: "Zeno Rocha",
          title: "Co-Founder & CEO",
          imgSrc: "/static/zeno-rocha.jpeg",
          showDivider: true,
        },
        {
          name: "Bu Kinoshita",
          title: "Co-Founder & CTO",
          imgSrc: "/static/bu-kinoshita.jpeg",
          showDivider: false,
        },
      ].map((author, index) => (
        <Section
          className={`w-1/2 pl-${author.showDivider ? "0" : "4"} ${
            author.showDivider ? "border-r border-gray-300" : ""
          }`}
          key={index}
        >
          <Section className="mt-1.5 inline-block max-h-12 max-w-12 text-left">
            <Img
              alt={author.name}
              className="block h-12 w-12 rounded-full object-cover object-center"
              src={author.imgSrc}
            />
          </Section>
          <Section className="ml-4 inline-block max-w-[120px] text-left align-top">
            <Heading
              as="h3"
              className="m-0 text-sm font-medium leading-5 text-gray-900"
            >
              {author.name}
            </Heading>
            <Text className="m-0 text-xs font-medium leading-4 text-gray-500">
              {author.title}
            </Text>
            <Section className="mt-1">
              <Link className="h-3 w-3 text-gray-400" href="#">
                <svg
                  fill="currentColor"
                  height="12"
                  viewBox="0 0 16 16"
                  width="12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                </svg>
              </Link>
              <Link className="ml-2 h-3 w-3 text-gray-400" href="#">
                <svg
                  fill="currentColor"
                  height="12"
                  viewBox="0 0 16 16"
                  width="12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                </svg>
              </Link>
            </Section>
          </Section>
        </Section>
      ))}
    </Section>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
