interface Set<T> {
    add(value: T): Set<T>
    clear(): void
    delete(value: T): boolean
    forEach(callbackfn: (value: T, index: T, set: Set<T>) => void, thisArg?: any): void
    has(value: T): boolean
    size: number
}

declare var Set: {
    new <T>(): Set<T>
    prototype: Set<any>
}
