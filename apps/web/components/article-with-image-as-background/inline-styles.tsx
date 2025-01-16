import { Button, Heading, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

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
    role="presentation"
    style={{
      height: 424,
      marginTop: 16,
      marginBottom: 16,
      borderRadius: 12,
      backgroundColor: 'rgb(37,99,235)',
      // This url must be in quotes for Yahoo
      backgroundImage: "url('/static/my-image.png')",
      backgroundSize: '100% 100%',
    }}
    width="100%"
  >
    <tbody>
      <tr>
        <td align="center" style={{ padding: 40, textAlign: 'center' }}>
          <Text
            style={{
              margin: '0px',
              fontWeight: 600,
              color: 'rgb(229,231,235)',
            }}
          >
            New article
          </Text>
          <Heading
            as="h1"
            style={{
              margin: '0px',
              marginTop: 4,
              fontWeight: 700,
              color: 'rgb(255,255,255)',
            }}
          >
            Artful Accents
          </Heading>
          <Text
            style={{
              margin: '0px',
              marginTop: 8,
              fontSize: 16,
              lineHeight: '24px',
              color: 'rgb(255,255,255)',
            }}
          >
            Uncover the power of accent furniture in transforming your space
            with subtle touches of style, personality, and functionality, as we
            explore the art of curating captivating accents.
          </Text>
          <Button
            href="https://react.email"
            style={{
              marginTop: 24,
              borderRadius: 8,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
              backgroundColor: 'rgb(255,255,255)',
              paddingLeft: 40,
              paddingRight: 40,
              paddingTop: 12,
              paddingBottom: 12,
              fontWeight: 600,
              color: 'rgb(17,24,39)',
            }}
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
