import { Zfn } from "..";
import * as z from "myzod";

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
        phoneNumber: z.string().pattern(/\d\d\d-\d\d\d-\d\d\d\d/),
      }),
    ])
  ),
  (_values) => {
    return true;
  }
);

describe("Zfn - myzod", () => {
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
    ).toThrow("expected type to be number but got string");

    expect(() => fnNumberBoolString(5, null as any, "test")).toThrow(
      "expected type to be boolean but got null"
    );

    expect(() => fnNumberBoolString(5, true, {} as any)).toThrow(
      "expected type to be string but got object"
    );

    expect(() => fnNumberBoolString(5, true, [] as any)).toThrow(
      "expected type to be string but got array"
    );

    expect(fnComplex([[10, { phoneNumber: "555-123-1234" }]])).toEqual(true);
    expect(() => fnComplex([[5, { phoneNumber: "555-123-1234" }]])).toThrow(
      "error parsing tuple at index 0: expected number to be greater than or equal to 10 but got 5"
    );
    expect(() => fnComplex([[10, { phoneNumber: "bad" }]])).toThrow(
      'error parsing tuple at index 1: error parsing object at path: "phoneNumber" - expected string to match pattern /\\d\\d\\d-\\d\\d\\d-\\d\\d\\d\\d/ but did not'
    );
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
