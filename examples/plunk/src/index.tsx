import { render } from "@react-email/render";
import Plunk from "@plunk/node";
import * as React from "react";
import { Email } from "./email";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const plunk = new Plunk(process.env.PLUNK_API_KEY || "");

const emailHtml = render(<Email url="https://example.com" />);

plunk.emails.send({
  to: "hello@useplunk.com",
  subject: "Hello world",
  body: emailHtml,
});
