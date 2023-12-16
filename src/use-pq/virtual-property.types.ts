export const EMPTY_VALUE: null = null

export type Constructor<T = {}> = new (...args: any[]) => T

export type Path = string | typeof EMPTY_VALUE

type Primitive = string | number | boolean

type ListItem<T> = T extends (infer I)[] ? I : never

type ListKeys<T> = keyof {
  [K in keyof T as T[K] extends Array<object> ? K : never]: any
}

export type ResolvedValue<T = unknown> =
  | T
  | ResolvedValue<T>[]
  | { [key: string]: ResolvedValue<T> }

type DelayedListField<T, P extends string> = T extends Primitive | object
  ? {
      [Key in keyof T as P]: <K extends ListKeys<T>>(
        field: K
      ) => VirtualListInterface<ListItem<T[K]>>
    }
  : {
      [key in P]: (field: string) => VirtualListInterface<unknown>
    }

type DelayedField<T, P extends string> = T extends Primitive | object
  ? {
      [Key in keyof T as P]: (
        payload: string | object
      ) => Key extends ListKeys<T>
        ? VirtualListInterface<ListItem<T[Key]>>
        : VirtualPropertyInterface<T[Key]>
    }
  : {
      [key in P]: (
        payload: string | object
      ) =>
        | VirtualListInterface<ListItem<unknown>>
        | VirtualPropertyInterface<unknown>
    }

type ParamsAPI<T, A = false> = T extends Primitive | object
  ? {
      [Key in keyof T as `$${string}`]: (
        params: object
      ) => A extends true
        ? VirtualPropertyInterface<T>[]
        : VirtualPropertyInterface<T>
    }
  : {
      [key: `$${string}`]: (
        params: object
      ) => VirtualPropertyInterface<T>[] & VirtualPropertyInterface<T>
    }

type VirtualAPI<T> = {
  path: Path
  value: () => ResolvedValue<T>
} & (T extends Primitive | Primitive[]
  ? { get: () => ResolvedValue<T> }
  : T extends object
    ? {}
    : { get: () => ResolvedValue<T> })

type NestedVirtualProperties<T> = T extends Primitive | object
  ? { [Key in keyof Omit<T, ListKeys<T>>]: VirtualObjectInterface<T[Key]> }
  : { [key: string]: VirtualObjectInterface<unknown> }

type VirtualPropertyInterface<T = unknown> = NestedVirtualProperties<T> &
  DelayedListField<T, 'listOf'> &
  DelayedField<T, 'with' | 'on'>

export type VirtualObjectInterface<T = unknown> = VirtualPropertyInterface<T> &
  ParamsAPI<T> &
  VirtualAPI<T>

export type VirtualListInterface<T = unknown> = VirtualPropertyInterface<T>[] &
  ParamsAPI<T, true> &
  Omit<VirtualAPI<T>, 'get'>
