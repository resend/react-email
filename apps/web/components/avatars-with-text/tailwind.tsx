import { Column, Img, Link, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Column align="center">
      <Link href="https://github.com/zehfernandes">
        <Row className="w-auto table-fixed border-collapse border-spacing-0">
          <Column className="h-[44px] w-[44px] overflow-hidden rounded-full p-0 text-center align-middle leading-[0px]">
            <Img
              src="https://github.com/zehfernandes.png?size=100"
              width="36"
              height="36"
              alt="Zeh Fernandes"
              className="h-full w-full object-cover object-center"
            />
          </Column>
          <Column className="pl-3 text-[14px] leading-[20px] font-medium text-gray-500">
            <p className="m-0 text-gray-700">Zeh Fernandes</p>
            <p className="m-0 text-[12px] leading-[14px]">Founding Designer</p>
          </Column>
        </Row>
      </Link>
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
