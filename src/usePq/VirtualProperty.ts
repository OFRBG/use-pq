import { Union } from 'ts-toolbelt'

export const EMPTY_VALUE = null

export type Path = string | typeof EMPTY_VALUE

export type VirtualObjectInternals = {
  value: () => Union.Nullable<VirtualObjectInternals | VirtualObjectInternals[]>
  path: Path
}

export class VirtualProperty implements VirtualObjectInternals {
  constructor(private _value: unknown, public path: string) {}

  value() {
    return this._value || EMPTY_VALUE
  }

  [Symbol.toStringTag]() {
    return 'VirtualProperty'
  }

  [Symbol.toPrimitive]() {
    return this.value()
  }

  toString() {
    return this.value()
  }
}
