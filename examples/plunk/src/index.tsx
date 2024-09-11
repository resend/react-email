import { render } from "@react-email/components";
import Plunk from "@plunk/node";
import { Email } from "./email";

const plunk = new Plunk(process.env.PLUNK_API_KEY || "");

const emailHtml = await render(<Email url="https://example.com" />);

await plunk.emails.send({
  to: "hello@useplunk.com",
  subject: "Hello world",
  body: emailHtml,
});
