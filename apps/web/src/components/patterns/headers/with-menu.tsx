import { Column, Img, Row, Section } from "@react-email/components";
import Link from "next/link";

export const title = "With menu";

export const headerWithMenu = (
  <Section className="py-[40px] px-[32px] my-[40px]">
    <Row>
      <Column className="w-[80%]">
        <Img alt="company-logo" height="42" src="/static/company-logo.png" />
      </Column>
      <Column align="right">
        <Row align="right">
          <Column className="px-[8px]">
            <Link className="text-gray-600 [text-decoration:none]" href="#">
              About
            </Link>
          </Column>
          <Column className="px-[8px]">
            <Link className="text-gray-600 [text-decoration:none]" href="#">
              Company
            </Link>
          </Column>
          <Column className="px-[8px]">
            <Link className="text-gray-600 [text-decoration:none]" href="#">
              Blog
            </Link>
          </Column>
        </Row>
      </Column>
    </Row>
  </Section>
);

export default headerWithMenu;
