import { Img } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Image with varying sizes";

export const ImageWithVaryingSizes = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Img
        alt="Picture of part of a camera with other things around it, all unfocused except the camera piece."
        height={175}
        src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      <Img
        alt="Picture of part of a camera with other things around it, all unfocused except the camera piece."
        height={300}
        src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      <Img
        alt="Picture of part of a camera with other things around it, all unfocused except the camera piece."
        height={475}
        src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      {/* end pattern code */}
    </Layout>
  );
};

export default ImageWithVaryingSizes;
