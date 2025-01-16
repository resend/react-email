import { Heading } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <>
    <Heading as="h1" style={{ textAlign: 'center' }}>
      Jordan Walke
    </Heading>
    <Heading as="h2" style={{ textAlign: 'center' }}>
      Andrew Clark
    </Heading>
    <Heading as="h3" style={{ textAlign: 'center' }}>
      Dan Abramov
    </Heading>
    <Heading as="h4" style={{ textAlign: 'center' }}>
      Jason Bonta
    </Heading>
    <Heading as="h5" style={{ textAlign: 'center' }}>
      Joe Savona
    </Heading>
    <Heading as="h6" style={{ textAlign: 'center' }}>
      Josh Story
    </Heading>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
