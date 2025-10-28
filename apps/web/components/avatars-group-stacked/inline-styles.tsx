import { Column, Img, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row
    width={undefined}
    style={{
      tableLayout: 'fixed',
      borderCollapse: 'collapse',
      borderSpacing: 0,
    }}
  >
    <Column
      width="44"
      height="44"
      style={{
        height: '44px',
        width: '44px',
        padding: 0,
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: '0px',
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '100%',
          border: '4px solid white',
          backgroundColor: '#030712',
        }}
      >
        <Img
          src="https://github.com/bukinoshita.png?size=100"
          alt="Bu Kinoshita"
          width="40"
          height="40"
          style={{
            display: 'inline-block',
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>
    </Column>
    <Column
      width="44"
      height="44"
      style={{
        position: 'relative',
        left: '-12px',
        height: '44px',
        width: '44px',
        padding: 0,
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: '0px',
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '100%',
          border: '4px solid white',
          backgroundColor: '#030712',
        }}
      >
        <Img
          src="https://github.com/bukinoshita.png?size=100"
          alt="Bu Kinoshita"
          width="40"
          height="40"
          style={{
            display: 'inline-block',
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>
    </Column>
    <Column
      width="44"
      height="44"
      style={{
        position: 'relative',
        left: '-24px',
        height: '44px',
        width: '44px',
        padding: 0,
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: '0px',
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '100%',
          border: '4px solid white',
          backgroundColor: '#030712',
        }}
      >
        <Img
          src="https://github.com/bukinoshita.png?size=100"
          alt="Bu Kinoshita"
          width="40"
          height="40"
          style={{
            display: 'inline-block',
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
