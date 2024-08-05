import { Img } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Rounded image";

export const Tailwind = () => {
  return (
    <Img
      alt="Picture of part of a camera with other things around it, all unfocused except the camera piece."
      className="rounded-xl"
      height={250}
      src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    />
  );
};

export const InlineStyles = () => {
  return (
    <Img
      alt="Picture of part of a camera with other things around it, all unfocused except the camera piece."
      height={250}
      src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      style={{ borderRadius: 12 }}
    />
  );
};

export default () => {
  return <Layout>
    <InlineStyles/>
  </Layout>
};
