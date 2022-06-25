export const EMPTY_VALUE: null = null

export type Constructor<T = {}> = new (...args: any[]) => T

export type Path = string | typeof EMPTY_VALUE

type Primitive = string | number | null | any

export type ResolvedValue<T extends Primitive = any> =
  | T
  | ResolvedValue<T>[]
  | { [key: string]: ResolvedValue<T> }

type ParamsAPI<T, A = false> = {
  [Key in keyof T as `$${string}`]: (
    params: object
  ) => A extends true
    ? VirtualPropertyInterface<T>[]
    : VirtualPropertyInterface<T>
}

type VirtualAPI<T> = {
  path: Path
  value: () => ResolvedValue<T>
  get: () => ResolvedValue<T>
}

export type VirtualListInterface<T = any> = VirtualPropertyInterface<T>[] &
  ParamsAPI<T, true> &
  VirtualAPI<T>

export type VirtualObjectInterface<T = any> = VirtualListInterface<T>

type VirtualPropertyInterface<T = any> = {
  [Key in keyof T]: VirtualPropertyInterface<T>
} & {
  with: (args: object) => VirtualPropertyInterface<T>
  on: (type: string) => VirtualPropertyInterface<T>
} & {
  [Key in keyof T as 'listOf']: (field: string) => VirtualListInterface<T>
} & ParamsAPI<T> &
  VirtualAPI<T>
