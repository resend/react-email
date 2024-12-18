import { Button } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Button
    className="box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white"
    href="https://react.email"
  >
    Get started
  </Button>
);

export default () => {
  return <Layout>{component}</Layout>;
};
