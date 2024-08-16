import { Button, Column, Row } from "@react-email/components";

export const component =  (
  <Row>
    <Column align="center">
      <Row>
        <td
          align="center"
          colSpan={1}
          style={{ paddingRight: 16, width: "50%" }}
        >
          <Button
            href="https://react.email"
            style={{
              width: "100%",
              boxSizing: "border-box",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 12,
              paddingBottom: 12,
              borderRadius: 8,
              backgroundColor: "rgb(79,70,229)",
              textAlign: "center",
              fontWeight: 600,
              color: "rgb(255,255,255)",
            }}
          >
            Explore
          </Button>
        </td>
        <td
          align="center"
          colSpan={1}
          style={{ paddingLeft: 16, width: "50%" }}
        >
          <Button
            className="box-border w-full rounded-lg border border-solid border-gray-200 bg-white px-5 py-3 text-center font-semibold text-gray-900"
            href="https://react.email"
            style={{
              width: "100%",
              boxSizing: "border-box",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 12,
              paddingBottom: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "rgb(229,231,235)",
              textAlign: "center",
              backgroundColor: "rgb(255,255,255)",
              fontWeight: 600,
              color: "rgb(17,24,39)",
            }}
          >
            Buy
          </Button>
        </td>
      </Row>
    </Column>
  </Row>
);
