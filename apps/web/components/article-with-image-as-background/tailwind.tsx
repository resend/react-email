import { Button, Heading, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const title = 'Article with image as background';

// Notes for future exploration on finding a way to do this inside of
// Desktop Outlook:
// - https://backgrounds.cm/
// - use VML https://learn.microsoft.com/en-us/windows/win32/vml/msdn-online-vml-fill-element

export const component = (
  <table
    align="center"
    border={0}
    cellPadding="0"
    cellSpacing="0"
    className="my-[16px] h-[424px] rounded-[12px] bg-blue-600"
    role="presentation"
    style={{
      // This url must be in quotes for Yahoo
      backgroundImage: "url('/static/my-image.png')",
      backgroundSize: '100% 100%',
    }}
    width="100%"
  >
    <tbody>
      <tr>
        <td align="center" className="p-[40px] text-center">
          <Text className="m-0 font-semibold text-gray-200">New article</Text>
          <Heading as="h1" className="m-0 mt-[4px] font-bold text-white">
            Artful Accents
          </Heading>
          <Text className="m-0 mt-[8px] text-[16px] leading-[24px] text-white">
            Uncover the power of accent furniture in transforming your space
            with subtle touches of style, personality, and functionality, as we
            explore the art of curating captivating accents.
          </Text>
          <Button
            className="mt-[24px] rounded-[8px] border border-solid border-gray-200 bg-white px-[40px] py-[12px] font-semibold text-gray-900"
            href="https://react.email"
          >
            Read more
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
);

export default () => {
  return <Layout>{component}</Layout>;
};
