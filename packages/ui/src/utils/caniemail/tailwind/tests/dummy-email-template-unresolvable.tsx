import { Tailwind } from 'react-email';

// `nonExistentImport` is undefined at runtime; the bundle will fail to execute
// and the extractor should warn + fall back rather than crash the caniemail check.
// @ts-expect-error — intentional: this file is a fixture for the unresolvable case.
import { nonExistentImport } from './does-not-exist-anywhere';

const broken = nonExistentImport.theme;

export default function EmailTemplate() {
  return (
    <Tailwind theme={broken}>
      <div className="bg-brand" />
    </Tailwind>
  );
}
