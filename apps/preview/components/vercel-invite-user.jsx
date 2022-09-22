import React from 'react';
import { Button } from '@react-email/button';
import { Img } from '@react-email/img';

function VercelInviteUser() {
  return (
    <>
      <table style={box} width="100%" border="0" cellSpacing="0" cellPadding="0">
        <tr>
          <td align="center">
            <table style={container} width="600" border="0" cellSpacing="0" cellPadding="40">
              <tr>
                <td align="center">
                  <div style={section}>
                    <table style={box} width="100%" border="0" cellSpacing="0" cellPadding="0">
                      <tr>
                        <td align="center">
                          <div>
                            <Img src="https://assets.vercel.com/email/vercel.png" width="40" height="37" alt="Vercel" />
                          </div>
                          <h1 style={h1}>Join <strong>My Project</strong> on <strong>Vercel</strong></h1>
                        </td>
                      </tr>
                    </table>
                    <p style={text}>Hello zenorocha,</p>
                    <p style={text}><strong>bukinoshita</strong> (<a href="mailto:bukinoshita@example.com" style={link}>bukinoshita@example.com</a>) has invited you to the <strong>My Project</strong> team on <strong>Vercel</strong>.</p>
                    <table style={box} width="100%" border="0" cellSpacing="0" cellPadding="0">
                      <tr>
                        <td align="center">
                          <table style={spacing} border="0" cellPadding="0" cellSpacing="10">
                            <tr>
                              <td style={center} align="left" valign="middle">
                                <Img style={primaryAvatar} src="https://vercel.com/api/www/avatar/?u=zenorocha&amp;s=240&amp;format=png" width="60" height="60" alt="zenorocha" />
                              </td>
                              <td style={center} align="left" valign="middle">
                                <Img src="https://assets.vercel.com/email/team-invite-arrow.png" width="12" height="9" alt="invited you to" />
                              </td>
                              <td style={center} align="left" valign="middle">
                                <Img style={secondaryAvatar} src="https://vercel.com/api/www/avatar/?teamId=team_3e17ZatpKJ1imLQdTyrLeBoX&amp;s=240&amp;format=png" width="60" height="60" alt="My Project" />
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <table style={box} width="100%" border="0" cellSpacing="0" cellPadding="0">
                      <tr>
                        <td align="center">
                          <div>
                            <Button style={btn} href="https://vercel.com/teams/invite/foo">JOIN TEAM</Button>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <p style={text}><br />or copy and paste this URL into your browser: <a href="https://vercel.com/teams/invite/foo" target="_blank" style={link} rel="noreferrer">https://vercel.com/teams/invite/foo</a></p>
                    <hr style={hr}></hr>
                    <p style={footer}>This invitation was intended for <span style={black}>zenorocha</span>.This invite was sent from <span style={black}>204.13.186.218</span> located in <span style={black}>São Paulo, Brazil</span>. If you were not expecting this invitation, you can ignore this email. If you are concerned about your account's safety, please reply to this email to get in touch with us.</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </>
  );
}

const box = {
  width: "100% !important"
};

const container = {
  border: "1px solid #eaeaea",
  borderRadius: "5px",
  margin: "40px 0"
};

const section = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  textAlign: "left",
  width: "465px"
};

const h1 = {
  color: "#000",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "normal",
  margin: "30px 0",
  padding: "0"
};

const link = {
  color: "#067df7",
  textDecoration: "none"
};

const text = {
  color: "#000",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  lineHeight: "24px"
};

const black = {
  color: "black"
};

const center = {
  verticalAlign: "middle"
};

const primaryAvatar = {
  borderRadius: "50%",
  overflow: "hidden"
};

const secondaryAvatar = {
  borderRadius: "50%",
  overflow: "hidden",
  border: "1px solid #eaeaea",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.12)"
};

const btn = {
  backgroundColor: "#000",
  borderRadius: "5px",
  color: "#fff",
  display: "inline-block",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  fontWeight: 500,
  lineHeight: "50px",
  textAlign: "center",
  textDecoration: "none",
  width: "200px"
};

const spacing = {
  marginBottom: "26px"
};

const hr = {
  border: "none",
  borderTop: "1px solid #eaeaea",
  margin: "26px 0",
  width: "100%"
};

const footer = {
  color: "#666666",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "24px"
};

export default VercelInviteUser;