export function arrayWithIdsToDict<T extends {id: string}>(arr: T[]): {[key: string]: T} {
    return arr.reduce((dict, el) => ((dict[el.id] = el), dict), {} as {[key: string]: T});
}
