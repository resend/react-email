import { render } from "@react-email/render";
import { Bench } from "tinybench";
import EmailWithoutTailwind from "./emails/without-tailwind.js";
import EmailWithTailwind from "./emails/with-tailwind.js";

// import like this instead of installing from the workspace
// to still be able to test versions that are already published
import { Tailwind as CurrentTailwind } from "../../../packages/tailwind/dist";

async function main() {
  const bench = new Bench({ time: 100 });

  bench
    .add("without tailwind", () => {
      render(EmailWithoutTailwind());
    })
    .add("with current tailwind", () => {
      render(EmailWithTailwind({ Tailwind: CurrentTailwind }));
    });

  await bench.run();

  return bench;
}

main()
  .then((bench) => {
    console.table(bench.table());
  })
  .catch(console.error);
