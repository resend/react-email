import { Button } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Button
    href="https://react.email"
    style={{
      width: '100%',
      boxSizing: 'border-box',
      padding: 12,
      fontWeight: 600,
      borderRadius: 8,
      textAlign: 'center',
      backgroundColor: 'rgb(79,70,229)',
      color: 'rgb(255,255,255)',
    }}
  >
    Get started
  </Button>
);

export default () => {
  return <Layout>{component}</Layout>;
};
