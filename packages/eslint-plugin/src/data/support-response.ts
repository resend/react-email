export type EmailClient =
  | "gmail"
  | "outlook"
  | "yahoo"
  | "appl"
  | "aol"
  | "thunderbird"
  | "microsoft"
  | "samsung-email"
  | "sfr"
  | "orange"
  | "protonmail"
  | "hey"
  | "mail-ru"
  | "fastmail"
  | "laposte"
  | "t-online-de"
  | "free-fr"
  | "gmx"
  | "web-de"
  | "ionos-1and1"
  | "rainloop"
  | "wp-pl";

export type Platform =
  | "desktop-app"
  | "desktop-webmail"
  | "mobile-webmail"
  | "webmail"
  | "ios"
  | "android"
  | "windows"
  | "macos"
  | "windows-mail"
  | "outlook-com";

export type SupportEntryCategroy = "html" | "css" | "image" | "others";

export interface SupportEntry {
  slug: string;
  title: string;
  description?: string;
  url: string;
  category: SupportEntryCategroy;
  tags: string[];
  keywords: string | null;
  last_test_date: string;
  test_url: string;
  test_results_url: string | null;
  stats: Partial<
    // prettier-ignore
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
          Record</* version */string, string>[]
        >
      >
    >
  >;
  notes: string | null;
  notes_by_num: Record<number, string>;
}
export interface CaniemailOrderedDataResponse {
  api_version: string;
  last_updated_date: string;
  nicenames: {
    family: Record<EmailClient, string>;
    platform: Record<Platform, string>;
    support: {
      supported: "Supported";
      mitigated: "Partially supported";
      unsupported: "Not supported";
      unknown: "Support unknown";
      mixed: "Mixed support";
    };
    category: {
      html: "HTML";
      css: "CSS";
      image: "Image formats";
      others: "Others";
    };
  };
  data: SupportEntry[];
}
