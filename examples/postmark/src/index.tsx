import { render } from "@react-email/render";
import postmark from "postmark";
import * as React from "react";
import { Email } from "./email";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY || "");

const emailHtml = render(<Email url="https://example.com" />);

const options = {
  From: "you@example.com",
  To: "user@gmail.com",
  Subject: "hello world",
  HtmlBody: emailHtml,
};

client.sendEmail(options);
