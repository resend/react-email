import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Column } from '@react-email/column';
import { Text } from '@react-email/text';
import * as React from 'react';

export default function Email() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

  return (
    <Html>
      <Head />
      <Preview>Apple Receipt</Preview>
      <Section style={main}>
        <Container style={container}>
          <Section>
            <Column>
              <Img
                src={`${baseUrl}/static/apple-logo.png`}
                width="42"
                height="42"
                alt="Apple Logo"
              />
            </Column>

            <Column align="right" style={tableCell}>
              <Text style={heading}>Receipt</Text>
            </Column>
          </Section>
          <Section>
            <Text style={cupomText}>
              Save 3% on all your Apple purchases with Apple Card.
              <sup style={supStyle}>1</sup>{' '}
              <Link href="https://www.apple.com/apple-card">
                Apply and use in minutes
              </Link>
              <sup style={supStyle}>2</sup>
            </Text>
          </Section>
          <table style={informationTable}>
            <tbody>
              <tr style={informationTableRow}>
                <td style={informationTableColumn} width={320} colSpan={2}>
                  <span style={informationTableLabel}>APPLE ID</span>
                  <br />
                  <Link>zeno.rocha@gmail.com</Link>
                </td>
                <td width={340} style={informationTableColumn} rowSpan={3}>
                  <span style={informationTableLabel}>BILLED TO</span>
                  <br />
                  Visa .... 7461 (Apple Pay)
                  <br />
                  Zeno Rocha
                  <br />
                  2125 Chestnut St
                  <br />
                  San Francisco, CA 94123
                  <br />
                  USA
                </td>
              </tr>
              <tr style={informationTableRow}>
                <td style={informationTableColumn} colSpan={2}>
                  <span style={informationTableLabel}>DATE</span>
                  <br />
                  Jul 20, 2023
                </td>
              </tr>
              <tr style={informationTableRow}>
                <td style={informationTableColumn}>
                  <span style={informationTableLabel}>ORDER ID</span>
                  <br />
                  <Link
                    href="https://support.apple.com/kb/HT204088?cid=email_receipt_itunes_article_HT204088"
                  >
                    ML4F5L8522
                  </Link>
                </td>
                <td style={informationTableColumn}>
                  <span style={informationTableLabel}>DOCUMENT NO.</span>
                  <br />
                  <Link>121565300446</Link>
                </td>
              </tr>
            </tbody>
          </table>

          <Section style={productTitleTable}>
            <Column>
              <Text style={productsTitle}>App Store</Text>
            </Column>
          </Section>
          <Section>
            <Column>
              <Img
                src={`${baseUrl}/static/apple-hbo-max-icon.jpeg`}
                width="64"
                height="64"
                alt="HBO Max"
                style={productIcon}
              />
            </Column>
            <Column>
              <Text style={productDescriptionWrapper}>
                <span dir="auto" style={productTitle}>
                  HBO Max: Stream TV &amp; Movies
                </span>
                <br />
                <span style={productDescription}>
                  HBO Max Ad-Free (Monthly)
                </span>
                <br />
                <span style={productDescription}>Renews Aug 20, 2023</span>
                <br />
                <Link
                  href="https://userpub.itunes.apple.com/WebObjects/MZUserPublishing.woa/wa/addUserReview?cc=us&amp;id=1497977514&amp;o=i&amp;type=Subscription%20Renewal"
                  style={productLink}
                  data-saferedirecturl="https://www.google.com/url?q=https://userpub.itunes.apple.com/WebObjects/MZUserPublishing.woa/wa/addUserReview?cc%3Dus%26id%3D1497977514%26o%3Di%26type%3DSubscription%2520Renewal&amp;source=gmail&amp;ust=1673963081204000&amp;usg=AOvVaw2DFCLKMo1snS-Swk5H26Z1"
                >
                  Write a Review
                </Link>
                &nbsp;|&nbsp;<span>&nbsp;</span>
                <span>&nbsp;</span>
                <Link
                  href="https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/reportAProblem?a=1497977514&amp;cc=us&amp;d=683263808&amp;o=i&amp;p=29065684906671&amp;pli=29092219632071&amp;s=1"
                  style={productLink}
                  data-saferedirecturl="https://www.google.com/url?q=https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/reportAProblem?a%3D1497977514%26cc%3Dus%26d%3D683263808%26o%3Di%26p%3D29065684906671%26pli%3D29092219632071%26s%3D1&amp;source=gmail&amp;ust=1673963081204000&amp;usg=AOvVaw3y47L06B2LTrL6qsmaW2Hq"
                >
                  Report a Problem
                </Link>
              </Text>
            </Column>

            <Column style={productPriceWrapper} align="right">
              <span style={productPrice}>$14.99</span>
            </Column>
          </Section>
          <Hr style={productPriceLine} />
          <Section align="right">
            <Column style={tableCell} align="right">
              <Text style={productPriceTotal}>TOTAL</Text>
            </Column>
            <Column style={productPriceVerticalLine}></Column>
            <Column style={productPriceLargeWrapper}>
              <Text style={productPriceLarge}>$14.99</Text>
            </Column>
          </Section>
          <Hr style={productPriceLineBottom} />
          <Section>
            <Column align="center" style={block}>
              <Img
                src={`${baseUrl}/static/apple-card-icon.png`}
                width="60"
                height="17"
                alt="Apple Card"
              />
            </Column>
          </Section>
          <Section>
            <Column align="center" style={ctaTitle}>
              <Text style={ctaText}>Save 3% on all your Apple purchases.</Text>
            </Column>
          </Section>
          <Section>
            <Column align="center" style={walletWrapper}>
              <Link
                href="https://wallet.apple.com/apple-card/setup/feature/ccs?referrer=cid%3Dapy-120-100003"
                style={walletLink}
              >
                <Img
                  src={`${baseUrl}/static/apple-wallet.png`}
                  width="28"
                  height="28"
                  alt="Apple Wallet"
                  style={walletImage}
                />
                <span style={walletLinkText}>Apply and use in minutes</span>
              </Link>
            </Column>
          </Section>
          <Hr style={walletBottomLine} />
          <Text style={footerText}>
            1. 3% savings is earned as Daily Cash and is transferred to your
            Apple Cash card when transactions post to your Apple Card account.
            If you do not have an Apple Cash card, Daily Cash can be applied by
            you as a credit on your statement balance. 3% is the total amount of
            Daily Cash earned for these purchases. See the Apple Card Customer
            Agreement for more details on Daily Cash and qualifying
            transactions.
            <br />
            <br />
            2. Subject to credit approval.
            <br />
            <br />
            To access and use all the features of Apple Card, you must add Apple
            Card to Wallet on an iPhone or iPad with iOS or iPadOS 13.2 or
            later. Update to the latest version of iOS or iPadOS by going to
            Settings &gt; General &gt; Software Update. Tap Download and
            Install.
            <br />
            <br />
            Available for qualifying applicants in the United States.
            <br />
            <br />
            Apple Card is issued by Goldman Sachs Bank USA, Salt Lake City
            Branch.
            <br />
            <br />
            If you reside in the US territories, please call Goldman Sachs at
            877-255-5923 with questions about Apple Card.
          </Text>
          <Text style={footerTextCenter}>
            Privacy: We use a
            <Link
              href="http://support.apple.com/kb/HT207233"
              style={footerLink}
            >
              {' '}
              Subscriber ID{' '}
            </Link>
            to provide reports to developers.
          </Text>
          <Text style={footerTextCenter}>
            Get help with subscriptions and purchases.
            <Link
              href="https://support.apple.com/billing?cid=email_receipt"
              style={footerLink}
            >
              Visit Apple Support.
            </Link>
            <br />
            <br />
            Learn how to{' '}
            <Link
              href="https://support.apple.com/kb/HT204030?cid=email_receipt_itunes_article_HT204030"
            >
              manage your password preferences
            </Link>{' '}
            for iTunes, Apple Books, and App Store purchases.
            <br />
            <br />
            <br />
            You have the option to stop receiving email receipts for your
            subscription renewals. If you have opted out, you can still view
            your receipts in your account under Purchase History. To manage
            receipts or to opt in again, go to{' '}
            <Link
              href="https://finance-app.itunes.apple.com/account/subscriptions?unsupportedRedirectUrl=https://apps.apple.com/US/invoice"
            >
              Account Settings.
            </Link>
          </Text>

          <Section>
            <Column align="center" style={footerIcon}>
              <Img
                src={`${baseUrl}/static/apple-logo.png`}
                width="26"
                height="26"
                alt="Apple Card"
              />
            </Column>
          </Section>

          <Text style={footerLinksWrapper}>
            <Link
              href="https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/accountSummary?mt=8"
            >
              Account Settings
            </Link>{' '}
            •{' '}
            <Link
              href="https://www.apple.com/legal/itunes/us/sales.html"
            >
              Terms of Sale
            </Link>{' '}
            •{' '}
            <Link href="https://www.apple.com/legal/privacy/">
              Privacy Policy{' '}
            </Link>
          </Text>

          <Text style={footerCopyright}>
            Copyright © 2023 Apple Inc. <br />{' '}
            <Link href="https://www.apple.com/legal/">
              All rights reserved
            </Link>
          </Text>
        </Container>
      </Section>
    </Html>
  );
}

const fontFamily = '"Helvetica Neue",Helvetica,Arial,sans-serif';

const fontFamilySystem =
  'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif';

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '660px',
};

const tableCell = { display: 'table-cell' };

const heading = {
  fontFamily,
  fontSize: '32px',
  fontWeight: '300',
  color: '#888888',
};

const cupomText = {
  fontFamily: fontFamilySystem,
  textAlign: 'center' as const,
  margin: '36px 0 40px 0',
  fontSize: '14px',
  fontWeight: '500',
  color: '#111111',
};

const supStyle = {
  fontWeight: '300',
};

const informationTable = {
  fontFamily,
  borderCollapse: 'collapse' as const,
  borderSpacing: '0px',
  color: 'rgb(51,51,51)',
  backgroundColor: 'rgb(250,250,250)',
  borderRadius: '3px',
  fontSize: '12px',
};
const informationTableRow = {
  height: '46px',
};

const informationTableColumn = {
  paddingLeft: '20px',
  borderStyle: 'solid',
  borderColor: 'white',
  borderWidth: '0px 1px 1px 0px',
};

const informationTableLabel = {
  color: 'rgb(102,102,102)',
  fontSize: '10px',
};

const productTitleTable = {
  ...informationTable,
  margin: '30px 0 15px 0',
  height: '24px',
};

const productsTitle = {
  background: '#fafafa',
  paddingLeft: '10px',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const productIcon = {
  margin: '0 0 0 20px',
  borderRadius: '14px',
  border: '1px solid rgba(128,128,128,0.2)',
};

const productDescriptionWrapper = {
  lineHeight: 'auto',
  margin: '0 20px',
  width: '100%',
};

const productTitle = { fontFamily, fontSize: '12px', fontWeight: '600' };

const productDescription = {
  fontFamily,
  fontSize: '12px',
  color: 'rgb(102,102,102)',
};

const productLink = {
  fontFamily,
  fontSize: '12px',
  color: 'rgb(0,112,201)',
  textDecoration: 'none',
};

const productPriceTotal = {
  fontFamily,
  margin: '0',
  color: 'rgb(102,102,102)',
  fontSize: '10px',
  fontWeight: '600',
  padding: '0px 30px 0px 0px',
  textAlign: 'right' as const,
};

const productPrice = {
  fontFamily,
  fontSize: '12px',
  fontWeight: '600',
  margin: '0',
};

const productPriceLarge = {
  fontFamily,
  margin: '0px 20px 0px 0px',
  fontSize: '16px',
  fontWeight: '600',
  whiteSpace: 'nowrap' as const,
  textAlign: 'right' as const,
};

const productPriceWrapper = {
  display: 'table-cell',
  padding: '0px 20px 0px 0px',
  width: '100px',
  verticalAlign: 'top',
};

const productPriceLine = { margin: '30px 0 0 0' };

const productPriceVerticalLine = {
  height: '48px',
  borderLeft: '1px solid',
  borderColor: 'rgb(238,238,238)',
};

const productPriceLargeWrapper = { display: 'table-cell', width: '90px' };

const productPriceLineBottom = { margin: '0 0 75px 0' };

const block = { display: 'block' };

const ctaTitle = {
  fontFamily: fontFamilySystem,
  display: 'block',
  margin: '15px 0 0 0',
};

const ctaText = { fontFamily, fontSize: '24px', fontWeight: '500' };

const walletWrapper = { display: 'table-cell', margin: '10px 0 0 0' };

const walletLink = { color: 'rgb(0,126,255)', textDecoration: 'none' };

const walletImage = {
  display: 'inherit',
  paddingRight: '8px',
  verticalAlign: 'middle',
};

const walletBottomLine = { margin: '65px 0 20px 0' };

const footerText = {
  fontFamily,
  fontSize: '12px',
  color: 'rgb(102,102,102)',
  margin: '0',
  lineHeight: 'auto',
};

const footerTextCenter = {
  fontFamily,
  fontSize: '12px',
  color: 'rgb(102,102,102)',
  margin: '20px 0 0 0',
  lineHeight: 'auto',
  textAlign: 'center' as const,
};

const footerLink = { color: 'rgb(0,115,255)' };

const footerIcon = { display: 'block', margin: '40px 0 0 0' };

const footerLinksWrapper = {
  fontFamily,
  margin: '8px 0 0 0',
  textAlign: 'center' as const,
  fontSize: '12px',
  color: 'rgb(102,102,102)',
};

const footerCopyright = {
  fontFamily,
  margin: '25px 0 0 0',
  textAlign: 'center' as const,
  fontSize: '12px',
  color: 'rgb(102,102,102)',
};

const walletLinkText = {
  fontFamily,
  fontSize: '14px',
  fontWeight: '400',
  textDecoration: 'none',
};
