import { parsePointingTableRows } from './parse-pointing-table-rows';

const spamdResponse = `Received: from localhost by gabriels-computer
        with SpamAssassin (version 4.0.1);
        Mon, 10 Feb 2025 09:21:23 -0300
X-Spam-Checker-Version: SpamAssassin 4.0.1 (2024-03-26) on gabriels-computer
X-Spam-Flag: YES
X-Spam-Level: **********
X-Spam-Status: Yes, score=10.2 required=5.0 tests=DRUGS_ERECTILE,HTML_MESSAGE,
        MISSING_DATE,MISSING_FROM,MISSING_HEADERS,MISSING_MID,MISSING_SUBJECT,
        MONEY_BACK,NO_HEADERS_MESSAGE,NO_RECEIVED,NO_RELAYS autolearn=no
        autolearn_force=no version=4.0.1
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="----------=_67A9EF43.EC247F5D"

This is a multi-part message in MIME format.

------------=_67A9EF43.EC247F5D
Content-Type: text/plain; charset=UTF-8
Content-Disposition: inline
Content-Transfer-Encoding: 8bit

Spam detection software, running on the system "gabriels-computer",
has identified this incoming email as possible spam.  The original
message has been attached to this so you can view it or label
similar future email.  If you have any questions, see
root@localhost for details.

Content preview:  This email is spam. We sell rolexss for cheap. Get your viagra.
   We also sell weight loss pills today. Money back guaranteed. sEnd me $500
   and I'll send you back $700. don't tell anyone. Send this emai [...] 

Content analysis details:   (10.2 points, 5.0 required)

 pts rule name              description
---- ---------------------- --------------------------------------------------
 1.8 MISSING_SUBJECT        Missing Subject: header                           
 1.4 MISSING_DATE           Missing Date: header                              
 0.1 MISSING_MID            Missing Message-Id: header                        
 1.0 MISSING_FROM           Missing From: header                              
-0.0 NO_RECEIVED            Informational: message has no Received headers    
 1.2 MISSING_HEADERS        Missing To: header                                
-0.0 NO_RELAYS              Informational: message was not relayed via SMTP   
 2.5 MONEY_BACK             BODY: Money back guarantee                        
 0.0 HTML_MESSAGE           BODY: HTML included in message
 0.0 NO_HEADERS_MESSAGE     Message appears to be missing most RFC-822 headers
 2.2 DRUGS_ERECTILE         Refers to an erectile drug

The original message was not completely plain text, and may be unsafe to
open with some email clients; in particular, it may contain a virus,
or confirm that your address can receive spam.  If you wish to view
it, it may be safer to save it to a file and open it with an editor.


------------=_67A9EF43.EC247F5D
Content-Type: message/rfc822; x-spam-type=original
Content-Description: original message before SpamAssassin
Content-Disposition: attachment
Content-Transfer-Encoding: 8bit

MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="Part_af7eace217e10ccb689dd03f0d264877"

--Part_af7eace217e10ccb689dd03f0d264877
Content-Type: text/plain; charset="UTF-8"

This email is spam. We sell rolexss for cheap. Get your viagra. We also
sell weight loss pills today. Money back guaranteed. sEnd me $500 and
I'll send you back $700. don't tell anyone. Send this email to ten
friends

--Part_af7eace217e10ccb689dd03f0d264877
Content-Type: text/html; charset="UTF-8"

<html>
  <body>
    What
  </body>
</html>

--Part_af7eace217e10ccb689dd03f0d264877--


------------=_67A9EF43.EC247F5D--
`;

test('parsePointingTableRows()', () => {
  expect(parsePointingTableRows(spamdResponse)).toMatchSnapshot();
});
