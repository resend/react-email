import { Button, Column, Row } from "@react-email/components";

export const title = "Two buttons";

export const twoButtons = (
  /* start pattern code */
  <Row>
    <Column align="center">
      <table className="w-full">
        <tr>
          <td className="pr-2 w-1/2" colSpan={1}>
            <Button
              className="w-full py-[12px] rounded-[8px] bg-indigo-600 text-center font-semibold text-white"
              href="#"
            >
              Explore
            </Button>
          </td>
          <td className="pl-2 w-1/2" colSpan={1}>
            <Button
              className="w-full py-[12px] rounded-[8px] border border-solid text-center border-gray-200 bg-white font-semibold text-gray-900"
              href="#"
            >
              Buy
            </Button>
          </td>
        </tr>
      </table>
    </Column>
  </Row>
  /* end pattern code */
);

export default twoButtons;
