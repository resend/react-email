/**
 * Renders email components with React's Flight renderer (the one used for
 * React Server Components) to prove that email contexts propagate there.
 *
 * This is run by rsc-compatibility.spec.ts in a subprocess with
 * `--conditions=react-server`, the environment where `React.createContext`
 * and hooks don't exist, which is the reason email contexts exist at all.
 */
import assert from 'node:assert';
import * as React from 'react';
import { renderToReadableStream } from 'react-server-dom-webpack/server.edge';
import { Body } from '../../body/index.js';
import { Html } from '../../html/index.js';

assert.strictEqual(
  (React as { createContext?: unknown }).createContext,
  undefined,
  'Expected React.createContext to not exist, this script must run with --conditions=react-server',
);

const AsyncLayout = async ({ children }: { children: React.ReactNode }) => {
  await new Promise((resolve) => setTimeout(resolve, 5));
  return <>{children}</>;
};

const stream = renderToReadableStream(
  <Html lang="pl">
    <AsyncLayout>
      <Body>Cześć</Body>
    </AsyncLayout>
  </Html>,
  {},
);

const flightPayload = await new Response(stream).text();

// Flight encodes host elements as ["$","body",key,{...props}], so the
// assertions below check the props that ended up on each host element.
assert.match(
  flightPayload,
  /"html",[^,]*,\{[^{]*"lang":"pl"/,
  `Expected the html element to have lang="pl" in the flight payload:\n${flightPayload}`,
);
assert.match(
  flightPayload,
  /"body",[^,]*,\{[^{]*"lang":"pl"/,
  `Expected the body element to inherit lang="pl" in the flight payload:\n${flightPayload}`,
);
assert.match(
  flightPayload,
  /"td",[^,]*,\{[^{]*"lang":"pl"/,
  `Expected the td element to inherit lang="pl" in the flight payload:\n${flightPayload}`,
);
assert.doesNotMatch(
  flightPayload,
  /reactemailcontexts/i,
  `Expected the private context prop to not leak into the flight payload:\n${flightPayload}`,
);

console.log('flight rendering worked correctly');
