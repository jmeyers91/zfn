import { isZfn, Zfn } from "..";

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
});
