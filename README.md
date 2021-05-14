# zfn

A tiny utility for writing TS functions with runtime validation.

![Build](https://github.com/jmeyers91/zfn/actions/workflows/ci.yml/badge.svg)

## Install

```
npm install zfn
```

## Example

Works with [myzod](https://www.npmjs.com/package/myzod) and [zod](https://www.npmjs.com/package/zod).

```ts
import { Zfn } from "zfn";
import * as z from "myzod";
// Alternatively you could use zod
// import * as z from "zod";

const greet = Zfn(
  z.string(),
  z.number().min(0).max(100),
  (name, age) => `Hello ${name} you are ${age} years old`
);

greet("alex", 42); // "Hello alex you are 42 years old"
greet(null, 42); // tsc compiler error
greet(null as any, 42); // myzod runtime error
greet("alex", -10); // myzod runtime error
```

You can also define custom parsers. A parser is just an object with a `parse` function. The `parse` function's return type will be used to infer its corresponding function argument type.

```ts
const DirectionParser = {
  parse(value: unknown): "left" | "right" {
    if (value !== "left" && value !== "right") {
      throw new Error("Invalid direction!");
    }
    return value as "left" | "right";
  },
};

const turn = Zfn(DirectionParser, (direction) => {
  // direction's inferred type is `"left" | "right"`
});
```

## Usage

Two functions are available:

- `Zfn` - Takes any number of parsers followed by a function. Returns a new function with the same signature as the input function but with arguments that are validated using the schemas.
- `isZfn` - A utility function for checking if a value is a Zfn instance.
