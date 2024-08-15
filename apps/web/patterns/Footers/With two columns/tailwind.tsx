import { Column, Link, Img, Row, Section, Text } from "@react-email/components";

export const pattern = (
  <Section>
    <Row>
      <Column colSpan={4}>
        <Img
          alt="React Email logo"
          height="42"
          src="/static/logo-without-background.png"
        />
        <Text className="my-2 text-base font-semibold text-gray-900">
          Acme corporation
        </Text>
        <Text className="mt-1 text-base text-gray-500">Think different</Text>
      </Column>
      <Column align="left" className="table-cell align-bottom">
        <Row className="table-cell h-11 w-14 align-bottom">
          <Column className="pr-2">
            <Link href="#">
              <Img
                alt="Facebook"
                height="36"
                src="/static/facebook-logo.png"
                width="36"
              />
            </Link>
          </Column>
          <Column className="pr-2">
            <Link href="#">
              <Img alt="X" height="36" src="/static/x-logo.png" width="36" />
            </Link>
          </Column>
          <Column>
            <Link href="#">
              <Img
                alt="Instagram"
                height="36"
                src="/static/instagram-logo.png"
                width="36"
              />
            </Link>
          </Column>
        </Row>
        <Row>
          <Text className="my-2 text-base text-gray-500">
            123 Main Street Anytown, CA 12345
          </Text>
          <Text className="mt-1 text-base text-gray-500">
            mail@example.com +123456789
          </Text>
        </Row>
      </Column>
    </Row>
  </Section>
);