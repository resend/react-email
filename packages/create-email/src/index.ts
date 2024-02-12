#!/usr/bin/env node

import { Argument, program } from "@commander-js/extra-typings";
import { createStarter } from "./create-starter";

program
  .name("create-email")
  .version("0.0.19")
  .description("The easiest way to get started with React Email")
  .addArgument(
    new Argument("dir", "path to initialize the project").default(
      "./react-email-starter",
    ),
  )
  .action(createStarter)
  .parse(process.argv);
