import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarImage } from '@react-email/avatar';
import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Text } from '@react-email/text';
import { Preview } from '@react-email/preview';
export default function Email() {
    return (_jsxs(Html, { children: [_jsx(Head, {}), _jsx(Preview, { children: "Join bukinoshita on Vercel" }), _jsx("table", Object.assign({ style: box, width: "100%", border: 0, cellSpacing: "0", cellPadding: "0" }, { children: _jsx("tr", { children: _jsx("td", Object.assign({ align: "center" }, { children: _jsx(Container, Object.assign({ style: container }, { children: _jsxs("div", Object.assign({ style: section }, { children: [_jsx("table", Object.assign({ style: box, width: "100%", border: 0, cellSpacing: "0", cellPadding: "0" }, { children: _jsx("tr", { children: _jsxs("td", Object.assign({ align: "center" }, { children: [_jsx("div", Object.assign({ style: { marginTop: '32px' } }, { children: _jsx(Img, { src: "https://demo.react.email/static/images/vercel-logo.png", width: "40", height: "37", alt: "Vercel" }) })), _jsxs(Heading, Object.assign({ as: "h1", style: h1 }, { children: ["Join ", _jsx("strong", { children: "My Project" }), " on", ' ', _jsx("strong", { children: "Vercel" })] }))] })) }) })), _jsx(Text, Object.assign({ style: text }, { children: "Hello zenorocha," })), _jsxs(Text, Object.assign({ style: text }, { children: [_jsx("strong", { children: "bukinoshita" }), " (", _jsx(Link, Object.assign({ href: "mailto:bukinoshita@example.com", style: link }, { children: "bukinoshita@example.com" })), ") has invited you to the ", _jsx("strong", { children: "My Project" }), " team on", ' ', _jsx("strong", { children: "Vercel" }), "."] })), _jsx("table", Object.assign({ style: box, width: "100%", border: 0, cellSpacing: "0", cellPadding: "0" }, { children: _jsx("tr", { children: _jsx("td", Object.assign({ align: "center" }, { children: _jsx("table", Object.assign({ style: spacing, border: 0, cellPadding: "0", cellSpacing: "10" }, { children: _jsxs("tr", { children: [_jsx("td", Object.assign({ style: center, align: "left", valign: "middle" }, { children: _jsx(Avatar, { children: _jsx(AvatarImage, { style: avatar, src: "https://vercel.com/api/www/avatar/?u=zenorocha&s=240&format=png", width: "64", height: "64" }) }) })), _jsx("td", Object.assign({ style: center, align: "left", valign: "middle" }, { children: _jsx(Img, { src: "https://demo.react.email/static/images/vercel-arrow.png", width: "12", height: "9", alt: "invited you to" }) })), _jsx("td", Object.assign({ style: center, align: "left", valign: "middle" }, { children: _jsx(Avatar, { children: _jsx(AvatarImage, { style: avatar, src: "https://vercel.com/api/www/avatar/?teamId=team_3e17ZatpKJ1imLQdTyrLeBoX&s=240&format=png", width: "64", height: "64" }) }) }))] }) })) })) }) })), _jsx("table", Object.assign({ style: box, width: "100%", border: 0, cellSpacing: "0", cellPadding: "0" }, { children: _jsx("tr", { children: _jsx("td", Object.assign({ align: "center" }, { children: _jsx("div", { children: _jsx(Button, Object.assign({ style: btn, href: "https://vercel.com/teams/invite/foo" }, { children: "Join the team" })) }) })) }) })), _jsxs(Text, Object.assign({ style: text }, { children: [_jsx("br", {}), "or copy and paste this URL into your browser:", ' ', _jsx(Link, Object.assign({ href: "https://vercel.com/teams/invite/foo", target: "_blank", style: link, rel: "noreferrer" }, { children: "https://vercel.com/teams/invite/foo" }))] })), _jsx(Hr, { style: hr }), _jsxs(Text, Object.assign({ style: footer }, { children: ["This invitation was intended for", ' ', _jsx("span", Object.assign({ style: black }, { children: "zenorocha" })), ".This invite was sent from", ' ', _jsx("span", Object.assign({ style: black }, { children: "204.13.186.218" })), " located in", ' ', _jsx("span", Object.assign({ style: black }, { children: "S\u00E3o Paulo, Brazil" })), ". If you were not expecting this invitation, you can ignore this email. If you are concerned about your account's safety, please reply to this email to get in touch with us."] }))] })) })) })) }) }))] }));
}
const box = {
    width: '100% !important',
    background: 'white',
};
const container = {
    border: '1px solid #eaeaea',
    borderRadius: '5px',
    margin: '40px 0',
};
const section = {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    textAlign: 'left',
    width: '465px',
};
const h1 = {
    color: '#000',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '24px',
    fontWeight: 'normal',
    margin: '30px 0',
    padding: '0',
};
const avatar = {
    borderRadius: '100%',
};
const link = {
    color: '#067df7',
    textDecoration: 'none',
};
const text = {
    color: '#000',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '14px',
    lineHeight: '24px',
};
const black = {
    color: 'black',
};
const center = {
    verticalAlign: 'middle',
};
const btn = {
    backgroundColor: '#000',
    borderRadius: '5px',
    color: '#fff',
    display: 'inline-block',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '50px',
    textDecoration: 'none',
    textAlign: 'center',
};
const spacing = {
    marginBottom: '26px',
};
const hr = {
    border: 'none',
    borderTop: '1px solid #eaeaea',
    margin: '26px 0',
    width: '100%',
};
const footer = {
    color: '#666666',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '12px',
    lineHeight: '24px',
};
