import { EmailClient } from "@azure/communication-email";
import { render } from "@react-email/components";
import { Email } from "./email";

const client = new EmailClient(process.env.AZURE_EMAIL_CONNECTION_STRING);

const from = "you@example.com";
const emailHtml = await render(<Email url="https://example.com" />);

const message = {
  senderAddress: from,
  content: {
    subject: "hello world",
    html: emailHtml,
  },
  recipients: {
    to: [{ address: "user@gmail.com" }],
  },
};

const poller = await client.beginSend(message);

await poller.pollUntilDone();
