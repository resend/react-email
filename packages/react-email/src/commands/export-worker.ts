#!/usr/bin/env node
/**
 * Worker script to render a single email template in a separate process.
 * This helps isolate memory usage and prevents OOM errors when processing many templates.
 */

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import type React from 'react';

const require = createRequire(import.meta.url);

interface WorkerInput {
  templatePath: string;
  htmlPath: string;
  options: Record<string, unknown>;
}

async function renderTemplate(input: WorkerInput): Promise<void> {
  try {
    // Clear require cache to ensure fresh module load
    delete require.cache[input.templatePath];

    const emailModule = require(input.templatePath) as {
      default: React.FC;
      render: (
        element: React.ReactElement,
        options: Record<string, unknown>,
      ) => Promise<string>;
      reactEmailCreateReactElement: typeof React.createElement;
    };

    const rendered = await emailModule.render(
      emailModule.reactEmailCreateReactElement(emailModule.default, {}),
      input.options,
    );

    // Write the rendered HTML to file
    fs.writeFileSync(input.htmlPath, rendered);

    // Delete the .cjs file after successful render
    fs.unlinkSync(input.templatePath);

    // Send success message to parent process
    process.stdout.write(
      JSON.stringify({ success: true, templatePath: input.templatePath }) + '\n',
    );
  } catch (error) {
    // Send error message to parent process
    process.stderr.write(
      JSON.stringify({
        success: false,
        templatePath: input.templatePath,
        error: error instanceof Error ? error.message : String(error),
      }) + '\n',
    );
    process.exit(1);
  }
}

// Read input from command line arguments or stdin
const inputData = process.argv[2];

if (!inputData) {
  process.stderr.write(
    JSON.stringify({
      success: false,
      error: 'No input data provided',
    }) + '\n',
  );
  process.exit(1);
}

try {
  const input: WorkerInput = JSON.parse(inputData);
  renderTemplate(input).catch((error) => {
    process.stderr.write(
      JSON.stringify({
        success: false,
        templatePath: input.templatePath,
        error: error instanceof Error ? error.message : String(error),
      }) + '\n',
    );
    process.exit(1);
  });
} catch (error) {
  process.stderr.write(
    JSON.stringify({
      success: false,
      error: `Failed to parse input: ${error instanceof Error ? error.message : String(error)}`,
    }) + '\n',
  );
  process.exit(1);
}
