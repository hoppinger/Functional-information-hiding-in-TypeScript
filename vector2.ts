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

console.log("done")