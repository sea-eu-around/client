export function arrayWithIdsToDict<T extends {id: string}>(arr: T[]): {[key: string]: T} {
    return arr.reduce((dict, el) => ((dict[el.id] = el), dict), {} as {[key: string]: T});
}

export function arrayWithIdMapperToDict<T>(arr: T[], id: (item: T) => string): {[key: string]: T} {
    return arr.reduce((dict, el) => ((dict[id(el)] = el), dict), {} as {[key: string]: T});
}
