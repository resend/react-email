import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Tailwind,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

export const Layout = ({
  children,
  withTailwind = true,
}: {
  children?: React.ReactNode;
  withTailwind?: boolean;
}) => {
  return (
    <Html>
      <Head>
        <Font
          fallbackFontFamily="Helvetica"
          fontFamily="Inter"
          fontStyle="normal"
          fontWeight={400}
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2',
            format: 'woff2',
          }}
        />
        <Font
          fallbackFontFamily="Helvetica"
          fontFamily="Inter"
          fontStyle="normal"
          fontWeight={600}
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fjbvMwCp50PDca1ZL7.woff2',
            format: 'woff2',
          }}
        />
        <Font
          fallbackFontFamily="Helvetica"
          fontFamily="Inter"
          fontStyle="normal"
          fontWeight={700}
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fjbvMwCp50BTca1ZL7.woff2',
            format: 'woff2',
          }}
        />
      </Head>

      <Body style={{ margin: 0, marginLeft: 12, marginRight: 12 }}>
        {(() => {
          const container = (
            <Container
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                boxSizing: 'border-box',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                height: '100vh',
              }}
            >
              {children}
            </Container>
          );

          if (withTailwind) {
            return <Tailwind config={tailwindConfig}>{container}</Tailwind>;
          }

          return container;
        })()}
      </Body>
    </Html>
  );
};
