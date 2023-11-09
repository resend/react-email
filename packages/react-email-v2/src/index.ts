#!/usr/bin/env node
import { program } from "commander";
import packageJson from "../package.json";
import { dev } from "./cli/dev";

program
  .name(packageJson.name)
  .description("A live preview of your emails right in your browser")
  .version(packageJson.version);

program
  .command("dev")
  .description("Starts the application in development mode")
  .option("-d, --dir <path>", "Directory with your email templates", "./emails")
  .option("-p --port <port>", "Port to run dev server on", "3000")
  .action(dev);

program.parse();
