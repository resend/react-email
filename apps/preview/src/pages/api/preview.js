import VercelInviteUser from '../../components/templates/vercel-invite-user';
import { render } from '@react-email/render';

export default async function preview(req, res) {
  try {
    const html = render(<VercelInviteUser />);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    return res.end(html);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
