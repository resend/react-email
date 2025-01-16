import { Button, Column, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Column align="center">
      <Row>
        <td align="center" className="w-1/2 pr-[16px]" colSpan={1}>
          <Button
            className="box-border w-full rounded-[8px] bg-indigo-600 px-[20px] py-[12px] text-center font-semibold text-white"
            href="https://react.email"
          >
            Login
          </Button>
        </td>
        <td align="center" className="w-1/2 pl-[16px]" colSpan={1}>
          <Button
            className="box-border w-full rounded-[8px] border border-solid border-gray-200 bg-white px-[20px] py-[12px] text-center font-semibold text-gray-900"
            href="https://react.email"
          >
            Sign up
          </Button>
        </td>
      </Row>
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
