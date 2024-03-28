import { writeFileSync } from "node:fs";
import { render } from "@react-email/render";
import { Bench } from "tinybench";
import { Tailwind as VersionTwelveTailwind } from "@react-email/tailwind";
import { Tailwind as CurrentTailwind } from "../../../packages/tailwind/dist";
import EmailWithTailwind from "./emails/with-tailwind.js";

const main = async () => {
  const bench = new Bench({
    iterations: 100,
  });

  bench
    .add("current", async () => {
      await render(EmailWithTailwind({ Tailwind: CurrentTailwind }));
    })
    .add("latest", async () => {
      await render(EmailWithTailwind({ Tailwind: VersionTwelveTailwind }));
    });

  await bench.run();

  return bench;
};

main()
  .then((bench) => {
    writeFileSync(
      "bench-results-100-iterations.json",
      JSON.stringify(bench.results),
      "utf-8",
    );
    console.table(bench.table());
  })
  .catch(console.error);
