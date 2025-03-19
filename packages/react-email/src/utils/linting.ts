import { checkCompatibility } from '../actions/email-validation/check-compatibility';
import { checkImages } from '../actions/email-validation/check-images';
import { checkLinks } from '../actions/email-validation/check-links';
import type { LintingRow } from '../components/toolbar/linter';

export interface LintingSource<T> {
  getStream(): Promise<ReadableStream<T>>;
  mapValue(value: NoInfer<T>): LintingRow | undefined;
}

function createSource<T>(source: LintingSource<T>): LintingSource<T> {
  return source;
}

export function getLintingSources(
  markup: string,
  reactMarkup: string,
  emailPath: string,

  urlBase: string,
): LintingSource<unknown>[] {
  return [
    createSource({
      getStream() {
        return checkImages(markup, urlBase);
      },
      mapValue(result) {
        if (result && result.status !== 'success') {
          return {
            result: result,
            source: 'image',
          };
        }
      },
    }),
    createSource({
      getStream() {
        return checkLinks(markup);
      },
      mapValue(result) {
        if (result && result.status !== 'success') {
          return {
            result: result,
            source: 'link',
          };
        }
      },
    }),
    createSource({
      getStream() {
        return checkCompatibility(reactMarkup, emailPath);
      },
      mapValue(value) {
        if (value && value.status !== 'success') {
          return {
            result: value,
            source: 'compatibility',
          };
        }
      },
    }),
  ];
}

export async function* loadLintingRowsFrom(sources: LintingSource<unknown>[]) {
  for await (const source of sources) {
    const stream = await source.getStream();
    const reader = stream.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        const row = source.mapValue(value);
        if (row) {
          yield row;
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
