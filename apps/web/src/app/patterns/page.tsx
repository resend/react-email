import type { Metadata } from "next";
import { Topbar } from "../../components/topbar";

const title = "Patterns — React Email";
const description =
  "Open-source copy-paste patterns to use as building blocks with React Email";
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

const Patterns = () => {
  return (
    <main>
      <div className="h-screen-ios relative z-20 mx-auto flex max-w-7xl flex-col px-4">
        <Topbar />
      </div>
    </main>
  );
};

export default Patterns;
