import { Column, Img, Row, Section } from "@react-email/components";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export const title = "With menu";

export const HeaderWithMenu = (
  props: ComponentPropsWithoutRef<typeof Section>,
) => {
  return (
    <Section
      className="py-[40px] px-[32px] mx-auto my-[40px] rounded border border-solid border-gray-200 bg-white"
      {...props}
    >
      <Row>
        <Column className="w-[80%]">
          <Img
            alt="company-logo"
            height="42"
            src="/static/company-logo.png"
          />
        </Column>
        <Column align="right">
          <Row align="right">
            <Column>
              <Link className="px-[8px] text-gray-600 [text-decoration:none]" href="#">
                About
              </Link>
            </Column>
            <Column>
              <Link className="px-[8px] text-gray-600 [text-decoration:none]" href="#">
                Company
              </Link>
            </Column>
            <Column>
              <Link className="px-[8px] text-gray-600 [text-decoration:none]" href="#">
                Blog
              </Link>
            </Column>
          </Row>
        </Column>
      </Row>
    </Section>
  );
};

export default HeaderWithMenu;
