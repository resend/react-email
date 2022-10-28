import { Head } from '@react-email/head';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Link } from '@react-email/link';
import { Text } from '@react-email/text';
import { Preview } from '@react-email/preview';
import * as React from 'react';

interface ReactEmailSurveyProps {}

export const ReactEmailSurvey: React.FC<
  Readonly<ReactEmailSurveyProps>
> = () => {
  const link = 'https://rd8yncr0wr5.typeform.com/react-email';

  return (
    <Html>
      <Head />
      <Preview>
        We have a massive backlog in front of us, so we would love your input to
        help us prioritize what's most important to you.
      </Preview>
      <Text style={body}>Hey, it's Zeno Rocha.</Text>
      <Text style={body}>
        Thanks for signing up. We're super excited about React Email!
      </Text>
      <Text style={body}>
        <em>
          Quick question: Which email service do you use? SendGrid? Postmark?
        </em>
      </Text>
      <Text style={body}>
        We have a massive backlog in front of us, so we would love your input to
        help us <b>prioritize what's most important to you</b>.
      </Text>
      <Text style={body}>
        By filling up this form, you will also move up the waiting list, so what
        are you waiting for?
      </Text>
      <Text style={body}>
        <Link href={link}>{link}</Link>
      </Text>
      <Text style={body}>Thanks!</Text>
      <Hr />
      <Text style={footer}>
        You are receiving this email because you opted in at react.email
      </Text>
      <Text style={footer}>185 Royal Way - Upland, CA 91786</Text>
    </Html>
  );
};

const body = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const footer = {
  color: '#898989',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
};

export default ReactEmailSurvey;
