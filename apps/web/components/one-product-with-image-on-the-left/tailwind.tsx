import { Button, Img, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <table className="w-full">
      <tbody className="w-full">
        <tr className="w-full">
          <td className="box-border w-1/2 pr-[32px]">
            <Img
              alt="Braun Vintage"
              className="w-full rounded-[8px] object-cover"
              height={220}
              src="/static/braun-vintage.jpg"
            />
          </td>
          <td className="w-1/2 align-baseline">
            <Text className="m-0 mt-[8px] text-[20px] font-semibold leading-[28px] text-gray-900">
              Great Timepiece
            </Text>
            <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
              Renowned for their minimalist design and high functionality,
              celebrating the principles of simplicity and clarity.
            </Text>
            <Text className="mt-[8px] text-[18px] font-semibold leading-[28px] text-gray-900">
              $120.00
            </Text>
            <Button
              className="w-3/4 rounded-[8px] bg-indigo-600 px-[16px] py-[12px] text-center font-semibold text-white"
              href="https://react.email"
            >
              Buy
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
