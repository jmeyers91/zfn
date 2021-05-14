# zfn

A tiny utility for writing TS functions with [myzod](https://www.npmjs.com/package/myzod) runtime validation.

## Example

```ts
import { Zfn } from "zfn";
import * as z from "myzod";

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

## Install

Zfn depends on `myzod` as a peer dependency, so make sure to install it as well.

```
npm install zfn myzod
```

## Usage

Two functions are available:

- `Zfn` - Takes any number of myzod schemas followed by a function. Returns a new function with the same signature as the input function but with arguments that are validated using the schemas.
- `isZfn` - A utility function for checking if a value is a Zfn instance.
