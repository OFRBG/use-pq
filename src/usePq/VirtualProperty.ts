export const EMPTY_VALUE: null = null

export type Path = string | typeof EMPTY_VALUE

export type ResolvedValue =
  | {
      [key: string]: ResolvedValue | ResolvedValue[]
    }
  | string
  | number
  | null

export type VirtualPropertyInterface = {
  [key: string]: any
} & {
  path: Path
  value: () => ResolvedValue
  get: () => ResolvedValue
}

export type VirtualObject<T extends object> = {
  [key in keyof T]: any
}

export class VirtualProperty
  implements Pick<VirtualPropertyInterface, 'path' | 'value'>
{
  public path: string
  private _value: ResolvedValue

  constructor(props: { path: string; value?: ResolvedValue }) {
    this.path = props.path
    this._value = props.value
  }

  value(): ResolvedValue {
    return this._value || EMPTY_VALUE
  }

  [Symbol.toStringTag]() {
    return 'VirtualProperty'
  }

  [Symbol.toPrimitive]() {
    return this.value()
  }

  *[Symbol.iterator]() {
    yield this.value()
  }

  toString() {
    return this.value().toString()
  }
}
