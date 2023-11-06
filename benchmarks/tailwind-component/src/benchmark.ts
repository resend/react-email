import EmailWithoutTailwind from "./emails/without-tailwind.js";
import EmailWithTailwind from "./emails/with-tailwind.js";

import { render } from "@react-email/render";

import { Bench } from "tinybench";

async function main() {
  const bench = new Bench({ time: 100 });

  bench
    .add("without tailwind", () => {
      render(EmailWithoutTailwind());
    })
    .add("with tailwind", () => {
      render(EmailWithTailwind());
    });

  await bench.run();

  console.table(bench.table());
}

main();
