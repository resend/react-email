import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Section } from '@react-email/section';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Text } from '@react-email/text';
export default function Email() {
    return (_jsxs(Html, { children: [_jsx(Head, {}), _jsxs(Container, Object.assign({ style: container }, { children: [_jsx(Img, { src: "https://assets.react.email/demo/plaid.png", width: "212", height: "88", alt: "Plaid", style: logo }), _jsx(Text, Object.assign({ style: tertiary }, { children: "Verify Your Identity" })), _jsx(Text, Object.assign({ style: secondary }, { children: "Enter the following code to finish linking Venmo." })), _jsx(Section, Object.assign({ style: codeContainer }, { children: _jsx(Text, Object.assign({ style: code }, { children: "144833" })) })), _jsx(Text, Object.assign({ style: paragraph }, { children: "Not expecting this email?" })), _jsxs(Text, Object.assign({ style: paragraph }, { children: ["Contact", ' ', _jsx(Link, Object.assign({ href: "mailto:login@plaid.com", style: link }, { children: "login@plaid.com" })), ' ', "if you did not request this code."] }))] })), _jsx(Text, Object.assign({ style: footer }, { children: "Securely powered by Plaid." }))] }));
}
const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: '0 5px 10px rgba(20,50,70,.2)',
    marginTop: '20px',
    width: '360px',
    margin: '0 auto',
    padding: '68px 0 130px',
};
const logo = {
    margin: '0 auto',
};
const tertiary = {
    color: '#0a85ea',
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
    height: '16px',
    letterSpacing: '0',
    lineHeight: '16px',
    margin: '16px 8px 8px 8px',
    textTransform: 'uppercase',
    textAlign: 'center',
};
const secondary = {
    color: '#000',
    display: 'inline-block',
    fontFamily: 'HelveticaNeue-Medium,Helvetica,Arial,sans-serif',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '24px',
    marginBottom: '0',
    marginTop: '0',
    textAlign: 'center',
};
const codeContainer = {
    background: 'rgba(0,0,0,.05)',
    borderRadius: '4px',
    margin: '16px auto 14px',
    verticalAlign: 'middle',
    width: '280px',
};
const code = {
    color: '#000',
    display: 'inline-block',
    fontFamily: 'HelveticaNeue-Bold',
    fontSize: '32px',
    fontWeight: 700,
    letterSpacing: '6px',
    lineHeight: '40px',
    paddingBottom: '8px',
    paddingTop: '8px',
    margin: '0 auto',
    width: '100%',
    textAlign: 'center',
};
const paragraph = {
    color: '#444',
    fontSize: '15px',
    fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
    letterSpacing: '0',
    lineHeight: '23px',
    padding: '0 40px',
    margin: '0',
    textAlign: 'center',
};
const link = {
    color: '#444',
    textDecoration: 'underline',
};
const footer = {
    color: '#000',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0',
    lineHeight: '23px',
    margin: '0',
    marginTop: '20px',
    fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
    textAlign: 'center',
    textTransform: 'uppercase',
};
