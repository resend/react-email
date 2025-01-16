import { CodeInline, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Text style={{ textAlign: 'center' }}>
    Install the{' '}
    <CodeInline
      style={{
        backgroundColor: 'rgb(209,213,219)',
        borderRadius: 6,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 2,
        paddingBottom: 2,
      }}
    >
      @react-email/components
    </CodeInline>{' '}
    package
  </Text>
);

export default () => {
  return <Layout>{component}</Layout>;
};
