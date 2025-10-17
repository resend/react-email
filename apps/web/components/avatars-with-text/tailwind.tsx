import { Column, Img, Link, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Column align="center">
      <Link href="https://github.com/zehfernandes" className="block w-fit">
        <div className="flex items-center">
          <div className="inline-block h-9 w-9 overflow-hidden rounded-full">
            <Img
              src="https://github.com/zehfernandes.png?size=100"
              width="36"
              height="36"
              alt="Zeh Fernandes"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="ml-3 text-xs leading-relaxed font-medium text-gray-500">
            <p className="m-0 text-sm text-gray-700">Zeh Fernandes</p>
            <p className="m-0">Founding Designer</p>
          </div>
        </div>
      </Link>
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
