import { Column, Img, Row, Section } from '@react-email/components';
import { SOCIAL_LINKS, type SocialLinkConfig } from './social-config';

export const SocialComponent = (props: SocialLinkConfig) => {
  return (
    <Section>
      <Row>
        <Column />
        {SOCIAL_LINKS.map((social) => {
          const link = props[social.value];

          if (!link) {
            return null;
          }

          return (
            <Column
              key={social.value}
              align="center"
              style={{
                paddingRight: '8px',
                width: '32px',
                boxSizing: 'content-box',
              }}
            >
              <a href={link} rel="noopener noreferrer" target="_blank">
                <Img
                  height={32}
                  src={social.icon}
                  width={32}
                  alt={social.label}
                />
              </a>
            </Column>
          );
        })}
        <Column />
      </Row>
    </Section>
  );
};
