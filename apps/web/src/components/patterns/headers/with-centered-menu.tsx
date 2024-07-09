import { Column, Img, Row, Section } from "@react-email/components";
import Link from "next/link";

export const title = "Header with centered menu";

export const headerWithCenteredMenu = (
  /* start pattern code */
  <Section className="py-[40px] px-[32px] my-[40px]">
    <Row>
      <Column align="center">
        <Img alt="company-logo" height="42" src="/static/company-logo.png" />
      </Column>
    </Row>
    <Row className="mt-[40px]">
      <Column align="center">
        <table>
          <tr>
            <td className="px-[8px]">
              <Link className="text-gray-600 [text-decoration:none]" href="#">
                About
              </Link>
            </td>
            <td className="px-[8px]">
              <Link className="text-gray-600 [text-decoration:none]" href="#">
                Company
              </Link>
            </td>
            <td className="px-[8px]">
              <Link className="text-gray-600 [text-decoration:none]" href="#">
                Blog
              </Link>
            </td>
            <td className="px-[8px]">
              <Link className="text-gray-600 [text-decoration:none]" href="#">
                Contacts
              </Link>
            </td>
          </tr>
        </table>
      </Column>
    </Row>
  </Section>
  /* end pattern code */
);

export default headerWithCenteredMenu;
