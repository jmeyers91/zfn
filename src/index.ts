export type ZfnParser<T> = { parse: (value: unknown) => T };
export type UnwrapZfnParser<P> = P extends ZfnParser<infer G> ? G : never;

/**
 * Used to mark Zfn instances so they can be identified with `isZfn`.
 */
const ZFN_SYMBOL = Symbol("Zfn");

export type Zfn<
  I extends ZfnParser<any>[],
  O,
  F = (...args: { [K in keyof I]: UnwrapZfnParser<I[K]> }) => O
> = { [ZFN_SYMBOL]: true; inputSchemas: I } & F;

/**
 * Defines a function with runtime input validation using [myzod](https://www.npmjs.com/package/myzod).
 * Takes any number of schemas followed by a function.
 * The function's arguments will be inferred to match the schema types.
 * The returned function's arguments will be automatically parsed using the schemas.
 *
 * Example:
 * ```ts
 * const greet = Zfn(z.string(), z.number(), (name, age) => {
 *   return `Hello ${name} you are ${age} years old`;
 * });
 *
 * greet('alex', 42); // "Hello alex you are 42 years old"
 * greet(null, 42); // tsc compiler error
 * greet(null as any, 42); // myzod runtime error
 * ```
 */
export function Zfn<
  I extends ZfnParser<any>[],
  O,
  F = (...args: { [K in keyof I]: UnwrapZfnParser<I[K]> }) => O
>(...args: [...schemas: I, fn: F]): Zfn<I, O, F> {
  const inputSchemas = args.slice(0, -1) as I;
  const fn = args[args.length - 1] as any;

  return Object.assign(
    inputSchemas.length > 0
      ? (...args: unknown[]) =>
          fn(...(inputSchemas.map((schema, i) => schema.parse(args[i])) as any))
      : () => fn(),
    fn,
    { inputSchemas, [ZFN_SYMBOL]: true as const }
  ) as any;
}

/**
 * Returns `true` if the passed value is a `Zfn` with runtime input validation.
 */
export function isZfn(
  value: unknown
): value is Zfn<ZfnParser<any>[], unknown, Function> {
  return typeof value === "function" && (value as any)[ZFN_SYMBOL] === true;
}
