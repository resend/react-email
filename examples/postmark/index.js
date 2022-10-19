import { render } from "@react-email/render";
import postmark from "postmark";
import Email from "./Email";

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

const emailHtml = render(<Email url="https://example.com" />);

const options = {
  From: "you@example.com",
  To: "user@gmail.com",
  Subject: "hello world",
  HtmlBody: emailHtml,
};

client.sendEmail(options);