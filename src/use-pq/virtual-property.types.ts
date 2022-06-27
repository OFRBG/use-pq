export const EMPTY_VALUE: null = null

export type Constructor<T = {}> = new (...args: any[]) => T
export type Path = string | typeof EMPTY_VALUE
type Primitive = string | number | null | any
type ListItem<T> = T extends (infer I)[] ? I : never
type ListKeys<T> = keyof {
  [K in keyof T as T[K] extends Array<any> ? K : never]: any
}

export type ResolvedValue<T extends Primitive = any> =
  | T
  | ResolvedValue<T>[]
  | { [key: string]: ResolvedValue<T> }

type DelayedListField<T, P extends string> = {
  [Key in keyof T as P]: <K extends ListKeys<T>>(
    field: K
  ) => VirtualListInterface<ListItem<T[K]>>
}

type DelayedField<T, P extends string> = {
  [Key in keyof T as P]: <K extends ListKeys<T>>(
    payload: K
  ) => Key extends ListKeys<T>
    ? VirtualListInterface<ListItem<T[Key]>>
    : VirtualPropertyInterface<T[Key]>
}

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

type VirtualPropertyInterface<T = any> = {
  [key: string]: VirtualObjectInterface<any>
} & {
  [Key in keyof T]: T[Key] extends ListKeys<T>
    ? never
    : T[Key] extends Array<infer I>
    ? I extends string | number | boolean
      ? VirtualListInterface<I>
      : never
    : VirtualObjectInterface<T[Key]>
} & DelayedListField<T, 'listOf'> &
  DelayedField<T, 'when' | 'on'> &
  ParamsAPI<T> &
  VirtualAPI<T>

export type VirtualObjectInterface<T = any> = VirtualPropertyInterface<T>
export type VirtualListInterface<T = any> = VirtualPropertyInterface<T>[] &
  ParamsAPI<T, true> &
  VirtualAPI<T>
