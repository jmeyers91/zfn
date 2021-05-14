import { Zfn } from "..";

describe("Zfn", () => {
  test("Should be able to define custom parsers", () => {
    const stringParser = {
      parse(value: unknown): string {
        if (typeof value !== "string") {
          throw new Error("Not string");
        }
        return value as string;
      },
    };

    const numberParser = {
      parse(value: unknown): number {
        if (typeof value !== "number") {
          throw new Error("Not number");
        }
        return value as number;
      },
    };

    const booleanParser = {
      parse(value: unknown): boolean {
        if (typeof value !== "boolean") {
          throw new Error("Not boolean");
        }
        return value as boolean;
      },
    };

    const fn = Zfn(
      stringParser,
      numberParser,
      booleanParser,
      (string, number, boolean) => ({ string, number, boolean })
    );
    expect(fn("test", 10, true)).toEqual({
      string: "test",
      number: 10,
      boolean: true,
    });
    expect(() => fn(null as any, 10, true)).toThrow("Not string");
    expect(() => fn("test", null as any, true)).toThrow("Not number");
    expect(() => fn("test", 10, null as any)).toThrow("Not boolean");
  });
});
