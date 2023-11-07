import { render } from "@react-email/render";
import { Tailwind as CurrentTailwind } from "../../../packages/tailwind/dist";
import EmailWithTailwind from "./emails/with-tailwind.js";

render(EmailWithTailwind({ Tailwind: CurrentTailwind }));
