import { Klotty } from 'klotty';
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import is from '@sindresorhus/is';
import { render } from '@react-email/render';
import Email from '../../components/react-email-survey';

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

    const save = supabase
      .from('react_email_contacts')
      .insert([{ email_address: data.email_address }]);

    const html = render(<Email />);

    const send = klotty.sendEmail({
      from: 'zeno@react.email',
      to: data.email_address,
      subject: '⚛️ React Email - Move up the line',
      html,
    });

    await Promise.all([save, send]);

    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    if (is.error(error)) {
      return res.status(500).json({ error: error.message });
    }
  }
}
