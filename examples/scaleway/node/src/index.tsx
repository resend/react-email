import { render } from '@react-email/components';
import { TransactionalEmail, createClient } from '@scaleway/sdk';
import { Email } from './email.js';

const client = createClient({
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  defaultProjectId: process.env.PROJECT_ID,
  defaultRegion: 'fr-par',
  defaultZone: 'fr-par-1',
});

const transactionalEmailClient = new TransactionalEmail.v1alpha1.API(client);

const sender = {
  email: 'react-email@transactional.email.fr',
  subject: 'TEST',
  name: 'Team',
};

const userInvited = {
  email: 'XXXX@scaleway.com',
  name: 'TEST',
  teamName: 'Team',
};

const userInvitedBy = {
  email: 'XXXX@scaleway.com',
  name: 'TEST',
  teamName: 'Team',
};

const emailHtml = await render(
  <Email
    invitedByEmail={userInvitedBy.email}
    invitedByUsername={userInvitedBy.name}
    teamName={userInvited.teamName}
    url="https://www.scaleway.com/"
    username={userInvited.name}
  />,
);

await transactionalEmailClient.createEmail({
  from: {
    email: sender.email,
    name: sender.name,
  },
  to: [
    {
      email: userInvited.email,
      name: userInvited.name,
    },
  ],
  subject: sender.subject,
  text: '',
  html: emailHtml,
});
