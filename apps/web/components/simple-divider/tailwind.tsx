import { Hr, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <>
    <Text>Before divider</Text>
    <Hr className="my-[16px] border-gray-300 border-t-2" />
    <Text>After divider</Text>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
