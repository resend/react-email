import { Heading } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Multiple headings";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Heading as="h1">Header</Heading>
      <Heading as="h2">Header</Heading>
      <Heading as="h3">Header</Heading>
      <Heading as="h4">Header</Heading>
      <Heading as="h5">Header</Heading>
      <Heading as="h6">Header</Heading>
      {/* end pattern code */}
    </Layout>
  );
};

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Heading as="h1">Header</Heading>
      <Heading as="h2">Header</Heading>
      <Heading as="h3">Header</Heading>
      <Heading as="h4">Header</Heading>
      <Heading as="h5">Header</Heading>
      <Heading as="h6">Header</Heading>
      {/* end pattern code */}
    </Layout>
  );
};

export default Tailwind;
