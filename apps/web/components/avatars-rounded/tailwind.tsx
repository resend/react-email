import { Column, Img, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Column align="center">
      <Img
        src="https://github.com/zenorocha.png?size=100"
        alt="Zeno Rocha"
        width="30"
        height="30"
        className="inline-block w-[30px] h-[30px] rounded-md"
      />
    </Column>
    <Column align="center">
      <Img
        src="https://github.com/zenorocha.png?size=100"
        alt="Zeno Rocha"
        width="42"
        height="42"
        className="inline-block w-[42px] h-[42px] rounded-md"
      />
    </Column>
    <Column align="center">
      <Img
        src="https://github.com/zenorocha.png?size=100"
        alt="Zeno Rocha"
        width="54"
        height="54"
        className="inline-block w-[54px] h-[54px] rounded-md"
      />
    </Column>
    <Column align="center">
      <Img
        src="https://github.com/zenorocha.png?size=100"
        alt="Zeno Rocha"
        width="66"
        height="66"
        className="inline-block w-[66px] h-[66px] rounded-md"
      />
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
