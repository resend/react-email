import { Klotty } from 'klotty';
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import is from '@sindresorhus/is';

const klotty = new Klotty(process.env.KLOTTY_API_KEY);
const supabaseUrl = 'https://ahszndesjmltbfzmckge.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sendEmail(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const data = req.body;

    const saveEmail = supabase
      .from('react_email_contacts')
      .insert([{ email_address: data.email_address }]);

    const sendEmail = klotty.sendEmail({
      from: 'Zeno Rocha <zeno@react.email>',
      to: data.email_address,
      subject: `Coming soon: react.email`,
      html: `Thanks for subscribing! I'll send you a note when we have something new to share.<br /><br />Cheers,<br />Zeno Rocha`,
    });

    await Promise.all([saveEmail, sendEmail]);

    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    if (is.error(error)) {
      return res.status(500).json({ error: error.message });
    }
  }
}
