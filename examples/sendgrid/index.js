import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import Email from "./Email";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const emailHtml = render(<Email url="https://example.com" />);

const options = {
  from: "you@example.com",
  to: "user@gmail.com",
  subject: "hello world",
  html: emailHtml,
};

sendgrid.send(options);