import type { NextApiRequest, NextApiResponse } from "next";
import { WaitlistEmail } from "../../../transactional/emails/waitlist";
import { resend } from "../../lib/resend";

const send = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "POST": {
      const data = await resend.sendEmail({
        from: "bu@resend.dev",
        to: "bu@resend.com",
        subject: "Waitlist",
        react: WaitlistEmail({ name: "Bu" }),
      });

      return res.status(200).send({ data: "Email sent successfully" });
    }
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default send;
