declare namespace Host {
  export function inputString(): string;

  export function outputString(result: string): void;
}

interface I64 { }

declare namespace Memory {
  export function fromString(value: string): {
    offset: I64
  };

  export function find(offset: I64): {
    readJsonObject(): Record<string, unknown>;
    readString(): string;
  }
}
