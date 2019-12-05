type Fun<a, b> = (_: a) => b

export type IStream<a> = {
  readonly Enumerate: () => IEnumerator<a>
  readonly ToArray: () => Array<a>
  readonly Select : <key extends keyof a>(...keys: key[]) => IStream<Pick<a, key>>
}

const methods = <a>() => ({
  ToArray: function (this: IStream<a>) { return ToArray(this) },
  Select: function <key extends keyof a>(this: IStream<a>, ...keys: key[]) { return Select<a, key>(this, ...keys) }
})

const Select = <a, key extends keyof a>(stream: IStream<a>, ...keys: key[]) => {
  return {
    Enumerate: () => {
      let enumerator = stream.Enumerate()
      return {
        Reset: () => enumerator.Reset(),
        MoveNext: () => {
          let current = enumerator.MoveNext()
          let result: any = {}
          if (current == undefined) return undefined
          for (let i = 0; i < keys.length; i++) result[keys[i]] = current[keys[i]]
          return result as Pick<a,key>
        }
      }
    },
    ...methods<a>()
  }  
}


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

let people = FromArray([
  { name: "John", surname: "Doe", age:27 },
  { name: "Jane", surname: "Red", age: 11 },
  { name: "Jill", surname: "Miller", age: 39 },
  { name: "Rick", surname: "Muller", age: 72 },
  { name: "Ross", surname: "Franken", age: 57 },
  { name: "Rose", surname: "Rossi", age: 35 },
  { name: "Gwen", surname: "Antonio", age: 21 }])
  .Select("name", "surname")
  .ToArray()

console.log("done")