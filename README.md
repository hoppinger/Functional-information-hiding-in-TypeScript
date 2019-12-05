# Functional information hiding in TypeScript (for C\#/Java programmers)

In this short article, we discuss how to use some functional programming features of the TypeScript language in order to simulate object-oriented constructs such as information hiding and inheritance.

## Basics
The basic construct that we will emulate is the definition of an interface, plus a class that implements it with some private fields that we absolutely do not want to expose to the outside world.

The interface will be a simple 2D vector, with getters and setters for the `x` and `y` coordinates, a `length` method to compute the length of the vector and a `normalize` method tha returns a new vector with the same direction, but a length of 1:

```ts
type IVector2 = {
  readonly getX: () => number
  readonly getY: () => number
  readonly setX: (_:number) => void
  readonly setY: (_: number) => void
  readonly length: () => number
  readonly normalize: () => IVector2
  readonly toString: () => string
}
```

We now move on to the implementation itself. The implementation is actually hidden behind a single function which acts as the equivalent of a constructor:

```ts
const Vector2 = (x: number, y: number): IVector2 => {
```

The constructor takes as input the parameters for the vector, which are `x` and `y` (both numbers), and returns an instance of `IVector2` around these parameters.

The `IVector2` is a mutable class, meaning that we need to store the data for the fields, the `x` and the `y`, in a separate container. Let's call this container `fields`:

```ts
  let fields = { x: x, y: y }
```

Now we can create the actual instance of the interface:

```ts
  return {
    getX: () => fields.x,
    getY: () => fields.y,
    setX: x => fields.x = x,
    setY: y => fields.y = y,
    length: () => Math.sqrt(fields.x * fields.x + fields.y * fields.y),
    normalize: function (this: IVector2) { return Vector2(fields.x / this.length(), fields.y / this.length()) }
    toString: () => `(${fields.x}, ${fields.y})`
  }
}
```

Notice that the `fields` variable is available inside the various methods, even though it was declared as a local variable inside the `Vector2` constructor function. Normally, local variables cease to exist after the function in which they are declared returns a value (their _stack frame_ gets cleaned up). An exception to this behaviour is that extra functions are created that keep making use of the local variables of the parent _scope_. In this case, these variables that are captured in the so\-called _closure_ of the inner function, will not be cleaned up when the main function returns. Thus, functions such as `getX` and `setX` cause `fields` to not be cleaned up. Moreover, `fields` will act as a permanent storage to which only an instance of `Vector2` can access, but after the function `Vector2` returns, all other references to `fields` will be lost. This makes the content of `fields` effectively *private*.

Using the `Vector2` class is quite simple. We first initialise a new instance of `Vector2` by simply invoking the `Vector2` class, which thus effectively becomes a *constructor*\:

```ts
let v1 = Vector2(5, 3)
```

We can then call methods that will either read or write to the private `fields`\:

```ts
v1.setX(2)
let v2 = v1.normalize()
```

The following program\:

```ts
let v1 = Vector2(5, 3)
const s1 = v1.toString()
v1.setX(2)
const s2 = v1.toString()
let v2 = v1.normalize()
const s3 = v2.toString()
```

would indeed result in the following values\:

`s1` | "(5, 3)"
`s2` | "(2, 3)"
`s3` | "(0.5547001962252291, 0.8320502943378437)"

just as expected.


The full listing for this small program is\:

```ts
export type IVector2 = {
  readonly getX: () => number
  readonly getY: () => number
  readonly setX: (_: number) => void
  readonly setY: (_: number) => void
  readonly length: () => number
  readonly normalize: () => IVector2
  readonly toString: () => string
}

export const Vector2 = (x: number, y: number): IVector2 => {
  let fields = { x: x, y: y }
  return {
    getX: () => fields.x,
    getY: () => fields.y,
    setX: x => fields.x = x,
    setY: y => fields.y = y,
    length: () => Math.sqrt(fields.x * fields.x + fields.y * fields.y),
    normalize: function (this: IVector2) { return Vector2(fields.x / this.length(), fields.y / this.length()) },
    toString: () => `(${fields.x}, ${fields.y})`
  }
}

let v1 = Vector2(5, 3)
const s1 = v1.toString()
v1.setX(2)
const s2 = v1.toString()
let v2 = v1.normalize()
const s3 = v2.toString()
```

## (Polymorphic) streams
