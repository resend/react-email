import { render } from "@react-email/render";
import { Bench } from "tinybench";
import EmailWithTailwind from "./emails/with-tailwind.js";
import { Tailwind as CurrentTailwind } from "../../../packages/tailwind/dist";
import { Tailwind as LatestTailwind } from "@react-email/tailwind";

const main = async () => {
  const bench = new Bench();

  bench
    .add("current", () => {
      render(EmailWithTailwind({ Tailwind: CurrentTailwind }));
    })
    .add("latest", () => {
      render(EmailWithTailwind({ Tailwind: LatestTailwind }));
    });

  await bench.run();

  return bench;
};

main()
  .then((bench) => {
    console.table(bench.table());
  })
  .catch(console.error);
