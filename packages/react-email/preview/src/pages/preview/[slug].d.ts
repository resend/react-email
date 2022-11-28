import { GetStaticPaths } from 'next';
import * as React from 'react';
interface PreviewProps {}
export declare const CONTENT_DIR = 'emails';
export declare const getStaticPaths: GetStaticPaths;
export declare function getStaticProps({ params }: { params: any }): Promise<
  | {
      props: {
        navItems: string[];
        slug: any;
        markup: string;
      };
      notFound?: undefined;
    }
  | {
      notFound: boolean;
      props?: undefined;
    }
>;
declare const Preview: React.FC<Readonly<PreviewProps>>;
export default Preview;
//# sourceMappingURL=%5Bslug%5D.d.ts.map
