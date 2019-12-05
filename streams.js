"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    return {
        Enumerate: () => ({
            Reset: () => fields.index = 0,
            MoveNext: () => x.length <= fields.index ? undefined : x[fields.index++]
        }),
        ToArray: function () { return exports.ToArray(this); },
        Where: function (predicate) { return exports.Where(this, predicate); }
    };
};
exports.Singleton = (x) => exports.FromArray([x]);
exports.Where = (stream, predicate) => {
    return {
        Enumerate: () => {
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
        },
        ToArray: function () { return exports.ToArray(this); },
        Where: function (predicate) { return exports.Where(this, predicate); }
    };
};
let s = exports.FromArray([1, 2, 3, 4, 5, 6])
    .Where(x => x % 2 == 0)
    .ToArray();
console.log("done");
//# sourceMappingURL=streams.js.map