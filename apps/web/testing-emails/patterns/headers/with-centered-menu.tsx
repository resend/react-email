import { Column, Img, Row, Section } from "@react-email/components";
import Link from "next/link";

export const title = "Header with centered menu";

export const headerWithCenteredMenu = (
  /* start pattern code */
  <Section className="py-10 px-8 my-10">
    <Row>
      <Column align="center">
        <Img alt="company-logo" height="42" src="/static/logo.png" />
      </Column>
    </Row>
    <Row className="mt-10">
      <Column align="center">
        <table>
          <tr>
            <td className="px-2">
              <Link className="text-gray-600 [text-decoration:none]" href="#">
                About
              </Link>
            </td>
            <td className="px-2">
              <Link className="text-gray-600 [text-decoration:none]" href="#">
                Company
              </Link>
            </td>
            <td className="px-2">
              <Link className="text-gray-600 [text-decoration:none]" href="#">
                Blog
              </Link>
            </td>
            <td className="px-2">
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
