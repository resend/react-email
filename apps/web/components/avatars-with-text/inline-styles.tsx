import { Column, Img, Link, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Column align="center">
      <Link href="https://github.com/zehfernandes">
        <Row
          style={{
            width: 'auto',
            tableLayout: 'fixed',
            borderCollapse: 'collapse',
            borderSpacing: 0,
          }}
        >
          <Column
            style={{
              height: '44px',
              width: '44px',
              overflow: 'hidden',
              borderRadius: '9999px',
              padding: 0,
              textAlign: 'center',
              verticalAlign: 'middle',
              lineHeight: '0px',
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
          </Column>
          <Column
            style={{
              paddingLeft: '12px',
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: 500,
              color: '#6b7280',
            }}
          >
            <p style={{ margin: 0, color: '#374151' }}>Zeh Fernandes</p>
            <p style={{ margin: 0, fontSize: '12px', lineHeight: '14px' }}>
              Founding Designer
            </p>
          </Column>
        </Row>
      </Link>
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
