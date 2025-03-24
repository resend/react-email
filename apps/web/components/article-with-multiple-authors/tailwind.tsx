import {
  Heading,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Hr className="mb-[0px] mt-[16px] !border-gray-300" />
    <Section>
      {[
        {
          name: 'Steve Jobs',
          title: 'Co-Founder & CEO',
          imgSrc: '/static/steve-jobs.jpg',
          showDivider: true,
        },
        {
          name: 'Steve Wozniak',
          title: 'Co-Founder & CTO',
          imgSrc: '/static/steve-wozniak.jpg',
          showDivider: false,
        },
      ].map((author, index) => (
        <>
          <Section align="left" className="mt-[16px] max-w-[288px]" key={index}>
            <Section className="mt-[5px] inline-block max-h-[48px] max-w-[48px] text-left">
              <Img
                alt={author.name}
                className="block rounded-full object-cover object-center"
                height={48}
                src={author.imgSrc}
                width={48}
              />
            </Section>
            <Section className="ml-[18px] inline-block max-w-[120px] text-left align-top">
              <Heading
                as="h3"
                className="m-0 text-[14px] font-medium leading-[20px] text-gray-900"
              >
                {author.name}
              </Heading>
              <Text className="m-0 text-[12px] font-medium leading-[14px] text-gray-500">
                {author.title}
              </Text>
              <Section className="mt-[4px]">
                <Link className="inline-flex h-[12px] w-[12px]" href="#">
                  <Img
                    alt="X"
                    height={12}
                    src="/static/x-icon.png"
                    width={12}
                  />
                </Link>
                <Link
                  className="ml-[8px] inline-flex h-[12px] w-[12px]"
                  href="#"
                >
                  <Img
                    alt="LinkedIn"
                    height={12}
                    src="/static/in-icon.png"
                    width={12}
                  />
                </Link>
              </Section>
            </Section>
          </Section>
          {author.showDivider ? (
            <Hr
              className="mr-[16px] inline-block h-[58px] w-[1px] bg-gray-300 [border:none]"
              style={{ float: 'left' }}
            />
          ) : null}
        </>
      ))}
    </Section>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
