import { allCssProperties } from './all-css-properties.js';

export type EmailClient =
  | 'gmail'
  | 'outlook'
  | 'yahoo'
  | 'apple-mail'
  | 'aol'
  | 'thunderbird'
  | 'microsoft'
  | 'samsung-email'
  | 'sfr'
  | 'orange'
  | 'protonmail'
  | 'hey'
  | 'mail-ru'
  | 'fastmail'
  | 'laposte'
  | 't-online-de'
  | 'free-fr'
  | 'gmx'
  | 'web-de'
  | 'ionos-1and1'
  | 'rainloop'
  | 'wp-pl';

export type Platform =
  | 'desktop-app'
  | 'desktop-webmail'
  | 'mobile-webmail'
  | 'webmail'
  | 'ios'
  | 'android'
  | 'windows'
  | 'macos'
  | 'windows-mail'
  | 'outlook-com';

export type SupportEntryCategory = 'html' | 'css' | 'image' | 'others';

export interface SupportEntry {
  slug: string;
  title: string;
  description: string | null;
  url: string;
  category: SupportEntryCategory;
  tags: string[];
  keywords: string | null;
  last_test_date: string;
  test_url: string;
  test_results_url: string | null;
  stats: Partial<
    Record<
      EmailClient,
      Partial<
        Record<
          Platform,
          /*
            This last Record<string, string> has only one key, as the
            ordered version of caniemail's data is meant to be something like:
           
            [
              { "1.0": "u" },
              { "2.0": "y" },
              { "3.0": "p #1" },
            ]
           
            So only one key for each object inside of this array, TypeScript can't really
            describe this though AFAIK.
          */
          Record</* version */ string, string>[]
        >
      >
    >
  >;
  notes: string | null;
  notes_by_num: Record<number, string> | null;
}

export type SupportStatus = CompatibilityStats['status'];

export type CompatibilityStats = {
  client: EmailClient;
  platform: Platform;
} & (
    | {
      status: 'success';
    }
    | {
      status: 'error';
    }
    | {
      status: 'warning';
      notes: string[];
    }
  );

const noteNumbersRegex = /#(?<noteNumber>\d+)/g;

export function parseCompatibilityStats(
  entry: SupportEntry,
  emailClients: EmailClient[],
): CompatibilityStats[] {
  const stats: CompatibilityStats[] = [];
  for (const emailClient of emailClients) {
    const rawStats = entry.stats[emailClient];
    if (rawStats) {
      for (const [platform, statusPerVersion] of Object.entries(rawStats)) {
        const latestStatus = statusPerVersion[statusPerVersion.length - 1];
        if (latestStatus === undefined) {
          continue;
        }
        const statusString = latestStatus[Object.keys(latestStatus)[0]!]!;
        if (statusString.startsWith('u')) {
          continue;
        }
        if (statusString.startsWith('a')) {
          noteNumbersRegex.lastIndex = 0;
          const notes: string[] = [];
          for (const match of statusString.matchAll(noteNumbersRegex)) {
            if (match.groups?.noteNumber) {
              const { noteNumber } = match.groups;
              const note =
                entry.notes_by_num?.[Number.parseInt(noteNumber, 10)];
              if (note) {
                notes.push(note);
              }
            }
          }
          stats.push({
            client: emailClient,
            platform: platform as Platform,
            status: 'warning',
            notes,
          });
        } else if (statusString.startsWith('y')) {
          stats.push({
            client: emailClient,
            platform: platform as Platform,
            status: 'success',
          });
        } else if (statusString.startsWith('n')) {
          stats.push({
            client: emailClient,
            platform: platform as Platform,
            status: 'error',
          });
        }
      }
    }
  }

  return stats;
}

export function parseCssFunctions({ title }: SupportEntry) {
  if (/^[a-zA-Z]\(\)$/.test(title.trim())) {
    return [title.replace('()', '')];
  }

  // ex: lch(), oklch(), lab(), oklab()
  // this regex avoids matching entries that are for CSS properties listed
  // separated by commas as well
  if (/^(?:[^(),]+?\(\),?)*$/.test(title.trim())) {
    return title
      .split(/\s*,\s*/)
      .map((functionCallWithoutParameters) =>
        functionCallWithoutParameters.replace('()', ''),
      );
  }

  // ex: CSS calc() function
  if (/^CSS [a-z]+\(\) function$/.test(title.trim())) {
    return [
      title.replace('CSS ', '').replace(' function', '').replace('()', ''),
    ];
  }

  return [];
}

export function parseCssPropertyNames({ title, keywords }: SupportEntry) {
  if (allCssProperties.includes(title.replace(' property', '')))
    return [title.replace(' property', '')];

  if (title.split('&').length > 1) {
    return title
      .split(/\s*&\s*/)
      .map((piece) => piece.trim())
      .filter((possiblePropertyName) =>
        allCssProperties.includes(possiblePropertyName),
      );
  }

  if (title.split(',').length > 1) {
    return title
      .split(/\s*,\s*/)
      .map((piece) => piece.trim())
      .filter((possiblePropertyName) =>
        allCssProperties.includes(possiblePropertyName),
      );
  }

  if (keywords) {
    return keywords
      .split(/\s*,\s*/)
      .filter((keyword) => allCssProperties.includes(keyword));
  }

  return [];
}

const propertyRegex =
  /(?<propertyName>[a-z-]+)\s*:\s*(?<propertyValue>[a-zA-Z\-0-9()+*/_ ]+)/;

export function parseCssPropertyWithValue({ title }: SupportEntry) {
  const match = propertyRegex.exec(title.trim());
  if (match) {
    const [_full, propertyName, propertyValue] = match;
    return {
      name: propertyName!,
      value: propertyValue!,
    };
  }
  return undefined;
}

export function parseCssUnit({ title }: SupportEntry) {
  return title.endsWith(' unit') ? title.replace(' unit', '') : undefined;
}

export function parseElementAttributes({ title }: SupportEntry) {
  if (title.endsWith(' attribute')) {
    return [title.replace(' attribute', '')];
  }

  return [];
}

export function parseElementNames({ title, keywords }: SupportEntry) {
  const match = /<(?<elementName>[^>]*)> element/.exec(title);
  if (match) {
    const [_full, elementName] = match;

    if (elementName) {
      return [elementName.toLowerCase()];
    }
  }

  if (keywords !== null && keywords.length > 0) {
    return keywords
      .toLowerCase()
      .split(/\s*,\s*/)
      .map((piece) => piece.trim());
  }

  if (title.split(',').length > 1) {
    return title
      .toLowerCase()
      .split(/\s*,\s*/)
      .map((piece) => piece.trim());
  }

  return [];
}

export type ParsedSupportEntry = (
  | {
    type: 'elements';
    names: string[];
  }
  | {
    type: 'element-attributes';
    attributes: string[];
  }
  | {
    type: 'css-functions';
    functions: string[];
  }
  | {
    type: 'css-property-names';
    propertyNames: string[];
  }
  | {
    type: 'css-property-with-value';
    name: string;
    value: string;
  }
  | {
    type: 'css-unit';
    unit: string;
  }
) & { original: SupportEntry };

export function parseSupportEntry(
  entry: SupportEntry,
): ParsedSupportEntry | undefined {
  if (entry.category === 'html') {
    const elementNames = parseElementNames(entry);
    if (elementNames.length > 0) {
      return {
        type: 'elements',
        names: elementNames,
        original: entry,
      };
    }
    const elementAttributes = parseElementAttributes(entry);
    if (elementAttributes.length > 0) {
      return {
        type: 'element-attributes',
        attributes: elementAttributes,
        original: entry,
      };
    }
  }
  if (entry.category === 'css') {
    const fullProperty = parseCssPropertyWithValue(entry);
    if (fullProperty?.name && fullProperty?.value) {
      return {
        type: 'css-property-with-value',
        name: fullProperty.name,
        value: fullProperty.value,
        original: entry,
      };
    }

    const functions = parseCssFunctions(entry);
    if (functions.length > 0) {
      return {
        type: 'css-functions',
        functions,
        original: entry,
      };
    }

    const unit = parseCssUnit(entry);
    if (unit) {
      return {
        type: 'css-unit',
        unit,
        original: entry,
      };
    }

    const propertyNames = parseCssPropertyNames(entry);
    if (propertyNames.length > 0) {
      return {
        type: 'css-property-names',
        propertyNames,
        original: entry,
      };
    }
  }
}
