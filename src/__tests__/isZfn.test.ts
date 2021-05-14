import { CollectZfns, isZfn, Zfn, ZfnParser, ZfnType } from "..";

describe("isZfn", () => {
  test("Should return true for valid Zfn instances", () => {
    expect(isZfn(Zfn(() => {}))).toEqual(true);
  });

  test("Should return false for non-Zfn instances", () => {
    expect(isZfn(() => {})).toEqual(false);
    expect(isZfn(function () {})).toEqual(false);
    expect(isZfn(null)).toEqual(false);
    expect(isZfn(undefined)).toEqual(false);
    expect(isZfn(NaN)).toEqual(false);
    expect(isZfn(10)).toEqual(false);
    expect(isZfn("")).toEqual(false);
    expect(isZfn("test")).toEqual(false);
    expect(isZfn(true)).toEqual(false);
    expect(isZfn(false)).toEqual(false);
    expect(isZfn(/test/)).toEqual(false);
    expect(isZfn({})).toEqual(false);
    expect(isZfn([])).toEqual(false);
    expect(isZfn({ isZfn: true })).toEqual(false);
  });

  test("Should be able to distinguish between Zfns and regular functions at compile time", () => {
    const fns = {
      async nonZfn() {},
      zfn: Zfn(async () => {}),
    };
    const zfns = fns as CollectZfns<typeof fns>;

    zfns.zfn();
    // @ts-expect-error
    zfns.nonZfn();

    const _a: ZfnType = fns.zfn;

    // @ts-expect-error
    const _b: ZfnType = fns.nonZfn;
  });

  test("Should be able to get Zfn parameter types at compile-time", () => {
    const zfn = Zfn(
      {} as ZfnParser<string>,
      {} as ZfnParser<number>,
      (_a, _b) => {}
    );
    const _varsCorrect: Parameters<typeof zfn> = ["test", 5];
    // @ts-expect-error
    const _varsIncorrect1: Parameters<typeof zfn> = [];
    // @ts-expect-error
    const _varsIncorrect2: Parameters<typeof zfn> = [null, 5];
    // @ts-expect-error
    const _varsIncorrect3: Parameters<typeof zfn> = ["test", null];
    // @ts-expect-error
    const _varsIncorrect4: Parameters<typeof zfn> = [5, "test"];
  });

  test("Should be able to get Zfn return types at compile-time", () => {
    const zfn = Zfn(
      {} as ZfnParser<string>,
      {} as ZfnParser<number>,
      (_a, _b) => ({ foo: "bar" } as const)
    );
    const _varsCorrect: ReturnType<typeof zfn> = { foo: "bar" };

    // @ts-expect-error
    const _varsIncorrect1: ReturnType<typeof zfn> = 10;
    // @ts-expect-error
    const _varsIncorrect2: ReturnType<typeof zfn> = "test";
    // @ts-expect-error
    const _varsIncorrect3: ReturnType<typeof zfn> = null;
    // @ts-expect-error
    const _varsIncorrect4: ReturnType<typeof zfn> = /test/;
    // @ts-expect-error
    const _varsIncorrect5: ReturnType<typeof zfn> = [];
    // @ts-expect-error
    const _varsIncorrect6: ReturnType<typeof zfn> = {};
    // @ts-expect-error
    const _varsIncorrect7: ReturnType<typeof zfn> = { foo: "not bar" };
  });
});
