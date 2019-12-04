# Functional information hiding in TypeScript

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

Notice that the `fields` variable is available inside the various methods, even though it was declared as a local variable inside the `Vector2` constructor function. Normally, local variables cease to exist after the function in which they are declared returns a value (their _stack frame_ gets cleaned up). An exception to this behaviour is that extra functions are created that keep making use of the local variables of the parent _scope_. In this case, these variables that are captured in the so\-called _closure_ of the inner function, will not be cleaned up when the main function returns. Thus, functions such as `getX` and `setX` cause `fields` to not be cleaned up. Moreover, `fields` is a _reference_ to the heap, and as such changes to this value will remain 

let v1 = Vector2(5, 3)
let v2 = v1.normalize()

