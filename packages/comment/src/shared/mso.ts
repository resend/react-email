export type MsoVersion = "9" | "10" | "11" | "12" | "14" | "15" | "16";

type MsoCondition = "gt" | "lt" | "gte" | "lte";

export type MsoConditionalVersion =
  | MsoVersion
  | `${MsoCondition} ${MsoVersion}`;
