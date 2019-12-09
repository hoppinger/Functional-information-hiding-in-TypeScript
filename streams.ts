type Fun<a,b> = (_:a) => b

export type IStream<a> = {
  readonly Enumerate: () => IEnumerator<a>
  readonly ToArray: () => Array<a>
  readonly Where: (predicate: Fun<a, Boolean>) => IStream<a>
  readonly Map: <b> (f: Fun<a, b>) => IStream<b>
}

const methods = <a>() => ({
  ToArray: function (this: IStream<a>) { return ToArray(this) },
  Where: function (this: IStream<a>, predicate: Fun<a, Boolean>) { return Where(this, predicate) },
  Map: function <b>(this: IStream<a>, f: Fun<a, b>) { return Map(this, f) }
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
  return {
    Enumerate: () => {
      let fields = { index: 0 }
      return {
        Reset: () => fields.index = 0,
        MoveNext: () => x.length <= fields.index ? undefined : x[fields.index++]
      }
    },
    ...methods()
  }
}

export const Singleton = <a>(x: a): IStream<a> => FromArray([x])

export const Infinite = <a>(getItem: Fun<number, a>): IStream<a> => {
  return {
    Enumerate: () => {
      let fields = { index: 0 }
      return {
        Reset: () => fields.index = 0,
        MoveNext: () => getItem(fields.index++)
      }
    },
    ...methods()
  }
}

export const Map = <a, b>(stream: IStream<a>, f: Fun<a, b>): IStream<b> => {
  return {
    Enumerate: () => {
      let enumerator = stream.Enumerate()
      return {
        Reset: () => enumerator.Reset(),
        MoveNext: () => {
          let current = enumerator.MoveNext()          
          return current ? f(current) : undefined
        }
      }
    },
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

let source = FromArray([1, 2, 3, 4, 5, 6])

let numbers = source
  .Where(x => x % 2 == 0)
  .Map(x => x * 3)
  .ToArray()

let numbers2 = source
  .ToArray()

console.log("done")
