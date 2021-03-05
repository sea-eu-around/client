export function arrayWithIdsToDict<T extends {id: string}>(arr: T[]): {[key: string]: T} {
    return arr.reduce((dict, el) => ((dict[el.id] = el), dict), {} as {[key: string]: T});
}

export function arrayWithIdMapperToDict<T>(arr: T[], id: (item: T) => string): {[key: string]: T} {
    return arr.reduce((dict, el) => ((dict[id(el)] = el), dict), {} as {[key: string]: T});
}

export type CancelablePromise<T = unknown> = Promise<T> & {cancel: () => void};

export function makePromiseCancelable<T>(promise: Promise<T>): CancelablePromise<T> {
    let hasCanceled = false;

    const wrappedPromise = new Promise<T>((resolve, reject) => {
        promise.then((val: T) => (hasCanceled ? reject({canceled: true}) : resolve(val)));
        promise.catch((error) => (hasCanceled ? reject({canceled: true}) : reject(error)));
    });

    const cancel = () => (hasCanceled = true);

    return Object.assign(wrappedPromise, {cancel});
}
