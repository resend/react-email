import { Img } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <div
    style={{
      position: 'relative',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      width: 'fit-content',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        height: '40px',
        width: '40px',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '100%',
        border: '4px solid white',
        backgroundColor: '#030712',
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '0.025em',
        color: '#6ee7b7',
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
    <div
      style={{
        position: 'relative',
        marginLeft: '-12px',
        display: 'inline-flex',
        height: '40px',
        width: '40px',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '100%',
        border: '4px solid white',
        backgroundColor: '#030712',
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '0.025em',
        color: '#6ee7b7',
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
    <div
      style={{
        position: 'relative',
        marginLeft: '-12px',
        display: 'inline-flex',
        height: '40px',
        width: '40px',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '100%',
        border: '4px solid white',
        backgroundColor: '#030712',
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '0.025em',
        color: '#6ee7b7',
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
  </div>
);

export default () => {
  return <Layout>{component}</Layout>;
};
