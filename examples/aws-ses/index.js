import { render } from "@react-email/render";
import AWS from "aws-sdk";
import Email from "./Email";

AWS.config.update({ region: process.env.AWS_SES_REGION });

const emailHtml = render(<Email url="https://example.com" />);

const options = {
  Source: "you@example.com",
  Destination: {
    ToAddresses: ["user@gmail.com"],
  },
  Message: {
    Body: {
      Html: {
        Charset: "UTF-8",
        Data: emailHtml,
      },
    },
    Subject: {
      Charset: "UTF-8",
      Data: "hello world",
    },
  },
};

const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
  .sendEmail(options)
  .promise();