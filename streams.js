"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const methods = () => ({
    ToArray: function () { return exports.ToArray(this); },
    Where: function (predicate) { return exports.Where(this, predicate); },
    Map: function (f) { return exports.Map(this, f); }
});
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
exports.Map = (stream, f) => {
    return Object.assign({ Enumerate: () => {
            let enumerator = stream.Enumerate();
            return {
                Reset: () => enumerator.Reset(),
                MoveNext: () => {
                    let current = enumerator.MoveNext();
                    return current ? f(current) : undefined;
                }
            };
        } }, methods());
};
exports.Where = (stream, predicate) => {
    return Object.assign({ Enumerate: () => {
            let enumerator = stream.Enumerate();
            return {
                Reset: () => enumerator.Reset(),
                MoveNext: () => {
                    let current = enumerator.MoveNext();
                    while (current && !predicate(current))
                        current = enumerator.MoveNext();
                    return current;
                }
            };
        } }, methods());
};
let numbers = exports.FromArray([1, 2, 3, 4, 5, 6])
    .Where(x => x % 2 == 0)
    .Map(x => x * 3)
    .ToArray();
console.log("done");
//# sourceMappingURL=streams.js.map