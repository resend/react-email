import { render } from "@react-email/render";
import { Bench } from "tinybench";
import EmailWithTailwind from "./emails/with-tailwind.js";
import { Tailwind as CurrentTailwind } from "../../../packages/tailwind/dist";
import { Tailwind as LatestTailwind } from "@react-email/tailwind";

const main = async () => {
  const bench = new Bench({
    iterations: 100
  });

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

import { writeFile } from 'fs/promises';

main()
  .then(async (bench) => {
    writeFile('bench-results-100-iterations.json', JSON.stringify(bench.results), 'utf-8');
    console.table(bench.table());
  })
  .catch(console.error);
