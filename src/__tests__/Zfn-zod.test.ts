import { Zfn } from "..";
import * as z from "zod";

const fnNumberBoolString = Zfn(
  z.number(),
  z.boolean(),
  z.string(),
  (a, b, c) => {
    return { a, b, c };
  }
);

const fnComplex = Zfn(
  z.array(
    z.tuple([
      z.number().min(10).max(35).nullable(),
      z.object({
        phoneNumber: z.string().regex(/\d\d\d-\d\d\d-\d\d\d\d/),
      }),
    ])
  ),
  (_values) => {
    return true;
  }
);

describe("Zfn - zod", () => {
  test("Should do nothing if the inputs are valid", () => {
    expect(fnNumberBoolString(1, true, "test")).toEqual({
      a: 1,
      b: true,
      c: "test",
    });
    expect(fnNumberBoolString(-123.4, false, "")).toEqual({
      a: -123.4,
      b: false,
      c: "",
    });
    expect(fnNumberBoolString(-0, false, "👾")).toEqual({
      a: -0,
      b: false,
      c: "👾",
    });
  });

  test("Should throw if the inputs are invalid", () => {
    expect(() =>
      fnNumberBoolString("not a number" as any, true, "test")
    ).toThrow(/Expected number, received string/);

    expect(() => fnNumberBoolString(5, null as any, "test")).toThrow(
      /Expected boolean, received null/
    );

    expect(() => fnNumberBoolString(5, true, {} as any)).toThrow(
      /Expected string, received object/
    );

    expect(() => fnNumberBoolString(5, true, [] as any)).toThrow(
      /Expected string, received array/
    );

    expect(fnComplex([[10, { phoneNumber: "555-123-1234" }]])).toEqual(true);
    expect(() => fnComplex([[5, { phoneNumber: "555-123-1234" }]])).toThrow(
      /Value should be greater than or equal to 10/
    );
    expect(() => fnComplex([[10, { phoneNumber: "bad" }]])).toThrow(/Invalid/);
  });

  test("Should not clobber existing function fields", () => {
    const fn = Zfn(
      z.string(),
      Object.assign(() => {}, { foo: "bar" })
    );
    expect(fn.foo).toEqual("bar");
  });

  test("Should be able to use custom validators", () => {
    const stringOrNoneParser = {
      // Returns strings as-is. Returns "None" for non-strings. Throws for NaN.
      parse(value: unknown): string {
        if (Number.isNaN(value)) {
          throw new Error("NaN is not welcome!");
        }
        return typeof value === "string" ? value : "None";
      },
    };

    const fn = Zfn(stringOrNoneParser, (v) => v.toUpperCase());

    expect(fn("test")).toEqual("TEST");
    expect(fn(null as any)).toEqual("NONE");
    expect(() => fn(NaN as any)).toThrow("NaN is not welcome!");
  });
});
