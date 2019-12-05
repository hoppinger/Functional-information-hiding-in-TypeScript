type Fun<a,b> = (_:a) => b

export type IStream<a> = {
  readonly Enumerate: () => IEnumerator<a>
  readonly ToArray: () => Array<a>
  readonly Where: (predicate:Fun<a, Boolean>) => IStream<a>
}

const methods = <a>() => ({
  ToArray: function (this: IStream<a>) { return ToArray(this) },
  Where: function (this: IStream<a>, predicate: Fun<a, Boolean>) { return Where(this, predicate) }
})

export type IEnumerator<a> = {
  readonly Reset: () => void
  readonly MoveNext: () => a | undefined
}

export const ToArray = <a>(stream: IStream<a>): Array<a> => {
  let result = []
  let enumerator = stream.Enumerate()
  let current = enumerator.MoveNext()
  while (current) {
    result.push(current)
    current = enumerator.MoveNext()
  }
  return result
}

export const FromArray = <a>(x: Array<a>): IStream<a> => {
  let fields = { index: 0 }
  return {
    Enumerate: () => ({
      Reset: () => fields.index = 0,
      MoveNext: () => x.length <= fields.index ? undefined : x[fields.index++]
    }),
    ...methods()
  }
}

export const Singleton = <a>(x: a): IStream<a> => FromArray([x])

export const Infinite = <a>(getItem: Fun<number, a>): IStream<a> => {
  let fields = { index: 0 }
  return {
    Enumerate: () => ({
      Reset: () => fields.index = 0,
      MoveNext: () => getItem(fields.index++)
    }),
    ...methods()
  }
}

export const Where = <a>(stream: IStream<a>, predicate: Fun<a, Boolean>): IStream<a> => {
  return {
    Enumerate: () => {
      let enumerator = stream.Enumerate()
      return {
        Reset: () => enumerator.Reset(),
        MoveNext: () => {
          let current = enumerator.MoveNext()
          while (current && !predicate(current))
            current = enumerator.MoveNext()
          return current
        }
      }
    },
    ...methods()
  }
}

let numbers = FromArray([1, 2, 3, 4, 5, 6])
  .Where(x => x % 2 == 0)
  .ToArray()

console.log("done")