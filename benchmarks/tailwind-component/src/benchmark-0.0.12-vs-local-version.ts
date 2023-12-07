import { render } from "@react-email/render";
import { writeFileSync } from "fs";
import { Bench } from "tinybench";
import EmailWithTailwind from "./emails/with-tailwind.js";
import { Tailwind as CurrentTailwind } from "../../../packages/tailwind/dist";
import { Tailwind as VersionTwelveTailwind } from "@react-email/tailwind";

const main = async () => {
  const bench = new Bench({
    iterations: 100,
  });

  bench
    .add("current", () => {
      render(EmailWithTailwind({ Tailwind: CurrentTailwind }));
    })
    .add("latest", () => {
      render(EmailWithTailwind({ Tailwind: VersionTwelveTailwind }));
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
