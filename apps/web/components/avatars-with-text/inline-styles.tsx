import { Column, Img, Link, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Column align="center">
      <Link
        href="https://github.com/zehfernandes"
        style={{ display: 'block', width: 'fit-content' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              height: '36px',
              width: '36px',
              overflow: 'hidden',
              borderRadius: '100%',
            }}
          >
            <Img
              src="https://github.com/zehfernandes.png?size=100"
              width="36"
              height="36"
              alt="Zeh Fernandes"
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </div>
          <div
            style={{
              marginLeft: '12px',
              fontSize: '12px',
              lineHeight: '1.625',
              fontWeight: '500',
              color: '#6b7280',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
              Zeh Fernandes
            </p>
            <p style={{ margin: 0 }}>Founding Designer</p>
          </div>
        </div>
      </Link>
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
