import {
  Column,
  Heading,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Fragment } from 'react/jsx-runtime';
import { Layout } from '../_components/layout';

export const component = (
  <Section>
    <Hr className="!border-gray-300 mt-[16px] mb-[0px]" />
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
    ].map((author) => (
      <Fragment key={author.name}>
        <Row align="left" width="186" className="pt-[16px] w-[186px]">
          <Column
            width="48"
            height="48"
            align="left"
            className="pt-[5px] h-[48px] w-[48px]"
          >
            <Img
              alt={author.name}
              className="block rounded-full object-cover object-center"
              height={48}
              src={author.imgSrc}
              width={48}
            />
          </Column>
          <Column width="120" className="pl-[18px]" align="left" valign="top">
            <Heading
              as="h3"
              className="m-0 font-medium text-[14px] text-gray-900 leading-[20px]"
            >
              {author.name}
            </Heading>
            <Text className="m-0 font-medium text-[12px] text-gray-500 leading-[14px]">
              {author.title}
            </Text>
            <Row width={undefined} className="mt-[4px]" align="left">
              <Column width="12" height="12">
                <Link className="h-[12px] w-[12px]" href="#">
                  <Img
                    alt="X"
                    height={12}
                    src="/static/x-icon.png"
                    width={12}
                  />
                </Link>
              </Column>
              <Column className="pl-[8px]" width="12" height="12">
                <Link className="h-[12px] w-[12px]" href="#">
                  <Img
                    alt="LinkedIn"
                    height={12}
                    src="/static/in-icon.png"
                    width={12}
                  />
                </Link>
              </Column>
            </Row>
          </Column>
        </Row>
        {author.showDivider ? (
          <Hr
            className="mr-[16px] inline-block h-[58px] w-[1px] bg-gray-300 [border:none]"
            style={{ float: 'left' }}
          />
        ) : null}
      </Fragment>
    ))}
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
