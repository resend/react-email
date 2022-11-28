import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Text } from '@react-email/text';
export default function Email() {
    return (_jsxs(Html, { children: [_jsx(Head, {}), _jsx("table", Object.assign({ style: main, width: "100%", border: 0, cellSpacing: "0", cellPadding: "0" }, { children: _jsx("tr", { children: _jsx("td", { children: _jsx(Container, Object.assign({ style: container }, { children: _jsxs("div", Object.assign({ style: box }, { children: [_jsx(Img, { src: "https://demo.react.email/static/images/stripe-logo.png", width: "49", height: "21", alt: "Stripe" }), _jsx(Hr, { style: hr }), _jsx(Text, Object.assign({ style: paragraph }, { children: "Thanks for submitting your account information. You're now ready to make live transactions with Stripe!" })), _jsx(Text, Object.assign({ style: paragraph }, { children: "You can view your payments and a variety of other information about your account right from your dashboard." })), _jsx(Button, Object.assign({ style: button, href: "https://dashboard.stripe.com/login" }, { children: "View your Stripe Dashboard" })), _jsx(Hr, { style: hr }), _jsxs(Text, Object.assign({ style: paragraph }, { children: ["If you haven't finished your integration, you might find our", ' ', _jsx(Link, Object.assign({ style: anchor, href: "https://stripe.com/docs" }, { children: "docs" })), ' ', "handy."] })), _jsxs(Text, Object.assign({ style: paragraph }, { children: ["Once you're ready to start accepting payments, you'll just need to use your live", ' ', _jsx(Link, Object.assign({ style: anchor, href: "https://dashboard.stripe.com/login?redirect=%2Fapikeys" }, { children: "API keys" })), ' ', "instead of your test API keys. Your account can simultaneously be used for both test and live requests, so you can continue testing while accepting live payments. Check out our", ' ', _jsx(Link, Object.assign({ style: anchor, href: "https://stripe.com/docs/dashboard" }, { children: "tutorial about account basics" })), "."] })), _jsxs(Text, Object.assign({ style: paragraph }, { children: ["Finally, we've put together a", ' ', _jsx(Link, Object.assign({ style: anchor, href: "https://stripe.com/docs/checklist/website" }, { children: "quick checklist" })), ' ', "to ensure your website conforms to card network standards."] })), _jsxs(Text, Object.assign({ style: paragraph }, { children: ["We'll be here to help you with any step along the way. You can find answers to most questions and get in touch with us on our", ' ', _jsx(Link, Object.assign({ style: anchor, href: "https://support.stripe.com/" }, { children: "support site" })), "."] })), _jsx(Text, Object.assign({ style: paragraph }, { children: "\u2014 The Stripe team" })), _jsx(Hr, { style: hr }), _jsx(Text, Object.assign({ style: footer }, { children: "Stripe, 354 Oyster Point Blvd, South San Francisco, CA 94080" }))] })) })) }) }) }))] }));
}
const main = {
    backgroundColor: '#f6f9fc',
};
const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};
const box = {
    padding: '0 48px',
};
const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};
const paragraph = {
    color: '#525f7f',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'left',
};
const anchor = {
    color: '#556cd6',
};
const button = {
    backgroundColor: '#656ee8',
    borderRadius: '5px',
    color: '#fff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
    width: '100%',
};
const footer = {
    color: '#8898aa',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    fontSize: '12px',
    lineHeight: '16px',
};
