import { CodeInline, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Text className="text-center">
    Install the{' '}
    <CodeInline className="rounded-[6px] bg-gray-300 px-[4px] py-[2px]">
      @react-email/components
    </CodeInline>{' '}
    package
  </Text>
);

export default () => {
  return <Layout>{component}</Layout>;
};
