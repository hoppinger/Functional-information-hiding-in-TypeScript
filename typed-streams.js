"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const methods = () => ({
    ToArray: function () { return exports.ToArray(this); },
    Select: function (...keys) { return Select(this, ...keys); }
});
const Select = (stream, ...keys) => {
    return Object.assign({ Enumerate: () => {
            let enumerator = stream.Enumerate();
            return {
                Reset: () => enumerator.Reset(),
                MoveNext: () => {
                    let current = enumerator.MoveNext();
                    let result = {};
                    if (current == undefined)
                        return undefined;
                    for (let i = 0; i < keys.length; i++)
                        result[keys[i]] = current[keys[i]];
                    return result;
                }
            };
        } }, methods());
};
exports.ToArray = (stream) => {
    let result = [];
    let enumerator = stream.Enumerate();
    let current = enumerator.MoveNext();
    while (current) {
        result.push(current);
        current = enumerator.MoveNext();
    }
    return result;
};
exports.FromArray = (x) => {
    let fields = { index: 0 };
    return Object.assign({ Enumerate: () => ({
            Reset: () => fields.index = 0,
            MoveNext: () => x.length <= fields.index ? undefined : x[fields.index++]
        }) }, methods());
};
exports.Singleton = (x) => exports.FromArray([x]);
exports.Infinite = (getItem) => {
    let fields = { index: 0 };
    return Object.assign({ Enumerate: () => ({
            Reset: () => fields.index = 0,
            MoveNext: () => getItem(fields.index++)
        }) }, methods());
};
let people = exports.FromArray([
    { name: "John", surname: "Doe", age: 27 },
    { name: "Jane", surname: "Red", age: 11 },
    { name: "Jill", surname: "Miller", age: 39 },
    { name: "Rick", surname: "Muller", age: 72 },
    { name: "Ross", surname: "Franken", age: 57 },
    { name: "Rose", surname: "Rossi", age: 35 },
    { name: "Gwen", surname: "Antonio", age: 21 }
])
    .Select("name", "surname")
    .ToArray();
console.log("done");
//# sourceMappingURL=typed-streams.js.map