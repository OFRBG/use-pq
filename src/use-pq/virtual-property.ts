export const EMPTY_VALUE: null = null

type Constructor<T = {}> = new (...args: any[]) => T

export type Path = string | typeof EMPTY_VALUE

export type ResolvedValue =
  | ResolvedValue[]
  | { [key: string]: ResolvedValue }
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

export const VirtualProperty = <TBase extends Constructor>(Base: TBase) =>
  class VirtualProperty
    extends Base
    implements Pick<VirtualPropertyInterface, 'path' | 'value'>
  {
    public path: string
    private _value: ResolvedValue

    constructor(...args: any[]) {
      super(args.slice(1, args.length - 1))

      this.path = args[0].path
      this._value = args[0].value
    }

    value(): ResolvedValue {
      return this._value || EMPTY_VALUE
    }

    [Symbol.toStringTag]() {
      return `Virtual${Base.name}Property`
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

export const VirtualObjectProperty = VirtualProperty(Object)
export const VirtualArrayProperty = VirtualProperty(Array)

const _vo = new VirtualObjectProperty({})
const _va = new VirtualArrayProperty({})

export type VirtualObjectPropertyType = typeof _vo
export type VirtualArrayPropertyType = typeof _va
export type VirtualProperty =
  | VirtualObjectPropertyType
  | VirtualArrayPropertyType
