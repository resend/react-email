import { Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <>
    <Text className="font-semibold text-[24px] text-indigo-400 leading-[32px]">
      Amazing content
    </Text>
    <Text>
      This is the actual content that the accented text above refers to.
    </Text>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
