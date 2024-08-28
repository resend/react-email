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
    <Hr style={{ borderColor: "#CCCCCC", margin: "16px 0" }} />
    <Section>
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
          align="left"
          key={index}
          style={{
            width: "50%",
            paddingLeft: author.showDivider ? "0" : "16px",
            borderRight: author.showDivider ? "1px solid #CCCCCC" : "none",
          }}
        >
          <Section
            style={{
              display: "inline-block",
              marginTop: "5px",
              maxHeight: "48px",
              maxWidth: "48px",
              textAlign: "left",
            }}
          >
            <Img
              alt={author.name}
              src={author.imgSrc}
              style={{
                borderRadius: "50%",
                display: "block",
                height: "48px",
                objectFit: "cover",
                objectPosition: "center",
                width: "48px",
              }}
            />
          </Section>
          <Section
            style={{
              display: "inline-block",
              marginLeft: "18px",
              maxWidth: "120px",
              textAlign: "left",
              verticalAlign: "top",
            }}
          >
            <Heading
              as="h3"
              style={{
                color: "#1A202C",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "20px",
                margin: 0,
              }}
            >
              {author.name}
            </Heading>
            <Text
              style={{
                color: "#718096",
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: "14px",
                margin: 0,
              }}
            >
              {author.title}
            </Text>
            <Section style={{ marginTop: "4px" }}>
              <Link
                href="#"
                style={{
                  color: "#9CA3AF",
                  height: "12px",
                  width: "12px",
                }}
              >
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
              <Link
                href="#"
                style={{
                  color: "#9CA3AF",
                  height: "12px",
                  marginLeft: "8px",
                  width: "12px",
                }}
              >
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
