import type * as z from "myzod";

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
  I extends z.Type<any>[],
  O,
  F = (...args: { [K in keyof I]: z.Infer<I[K]> }) => O
>(...args: [...schemas: I, fn: F]): { isRpcFn: true; inputSchemas: I } & F {
  const inputSchemas = args.slice(0, -1) as I;
  const fn = args[args.length - 1] as any;

  return Object.assign(
    inputSchemas.length > 0
      ? (...args: unknown[]) =>
          fn(...(inputSchemas.map((schema, i) => schema.parse(args[i])) as any))
      : () => fn(),
    { inputSchemas, isRpcFn: true as const }
  ) as any;
}
