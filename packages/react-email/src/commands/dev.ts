import fs from "node:fs";
import { setupServer } from "../utils/run-server";

interface Args {
  dir: string;
  port: string;
}

export const dev = ({ dir, port }: Args) => {
  try {
    if (!fs.existsSync(dir)) {
      throw new Error(`Missing ${dir} folder`);
    }

    setupServer(dir, port);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
