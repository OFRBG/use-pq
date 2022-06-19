import { Union } from 'ts-toolbelt'

export const EMPTY_VALUE = null

export type Path = string | typeof EMPTY_VALUE

export type VirtualObjectInternals = {
  value: () => Union.Nullable<VirtualObjectInternals | VirtualObjectInternals[]>
  path: Path
  params?: any
}

export type VirtualObject<T extends object> = {
  [key in keyof T]: any
}

export class VirtualProperty implements VirtualObjectInternals {
  public path: string
  public prop: string
  public params: string
  private _value: any

  constructor(props) {
    this.path = props.path
    this.prop = props.prop
    this.params = props.params
    this._value = props.value
  }

  value() {
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
    return this.value()
  }
}
