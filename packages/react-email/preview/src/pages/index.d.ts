interface HomeProps {}
export declare const CONTENT_DIR = 'emails';
export declare function getStaticProps({ params }: { params: any }): Promise<
  | {
      props: {
        navItems: string[];
      };
      notFound?: undefined;
    }
  | {
      notFound: boolean;
      props?: undefined;
    }
>;
declare const Home: React.FC<Readonly<HomeProps>>;
export default Home;
//# sourceMappingURL=index.d.ts.map
