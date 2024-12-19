import { Heading } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <>
    <Heading as="h1" className="text-center">
      Jordan Walke
    </Heading>
    <Heading as="h2" className="text-center">
      Andrew Clark
    </Heading>
    <Heading as="h3" className="text-center">
      Dan Abramov
    </Heading>
    <Heading as="h4" className="text-center">
      Jason Bonta
    </Heading>
    <Heading as="h5" className="text-center">
      Joe Savona
    </Heading>
    <Heading as="h6" className="text-center">
      Josh Story
    </Heading>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
