import { Column, Img, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row width={undefined} className="border-collapse border-spacing-0">
    <Column
      width="44"
      height="44"
      className="h-[44px] w-[44px] p-0 text-center align-middle leading-[0px]"
    >
      <div className="box-border h-full w-full overflow-hidden rounded-[100%] border-4 border-solid border-white bg-gray-950">
        <Img
          src="https://github.com/bukinoshita.png?size=100"
          alt="Bu Kinoshita"
          width="40"
          height="40"
          className="inline-block h-full w-full object-cover object-center"
        />
      </div>
    </Column>
    <Column
      width="44"
      height="44"
      className="relative left-[-12px] h-[44px] w-[44px] p-0 text-center align-middle leading-[0px]"
    >
      <div className="box-border h-full w-full overflow-hidden rounded-[100%] border-4 border-solid border-white bg-gray-950">
        <Img
          src="https://github.com/bukinoshita.png?size=100"
          alt="Bu Kinoshita"
          width="40"
          height="40"
          className="inline-block h-full w-full object-cover object-center"
        />
      </div>
    </Column>
    <Column
      width="44"
      height="44"
      className="relative left-[-24px] h-[44px] w-[44px] p-0 text-center align-middle leading-[0px]"
    >
      <div className="box-border h-full w-full overflow-hidden rounded-[100%] border-4 border-solid border-white bg-gray-950">
        <Img
          src="https://github.com/bukinoshita.png?size=100"
          alt="Bu Kinoshita"
          width="40"
          height="40"
          className="inline-block h-full w-full object-cover object-center"
        />
      </div>
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
