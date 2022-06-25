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

export type VirtualPropertyInterface<T = any> = {
  [Key in keyof T]: VirtualPropertyInterface<T>
} & {
  path: Path
  value: () => ResolvedValue<T>
  get: () => ResolvedValue<T>
} & {
  with: (args: object) => VirtualPropertyInterface<T>
  on: (type: string) => VirtualPropertyInterface<T>
} & {
  [Key in keyof T as 'listOf']: (
    field: string
  ) => VirtualPropertyInterface<T>[] & ParamsAPI<T, true>
} & ParamsAPI<T>
