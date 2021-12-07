type primitive = boolean | number | string | symbol | null | undefined
type UnensuredArray<T, A extends readonly T[] = readonly T[]> = T | (A & readonly T[])
