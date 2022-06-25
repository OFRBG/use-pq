export const EMPTY_VALUE: null = null

export type Constructor<T = {}> = new (...args: any[]) => T

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
    #value: ResolvedValue | VirtualProperty[]

    constructor(...args: any[]) {
      const { path, value } = args[0]

      super(...(Array.isArray(value) ? value : []))

      this.path = path
      this.#value = value
      this.value = this.value.bind(this)
    }

    get() {
      return this.value()
    }

    value() {
      if (this.#value instanceof Array) {
        return this.#value.map((entry) =>
          typeof entry === 'object' ? entry?.value() : entry ?? EMPTY_VALUE
        )
      }

      return this.#value ?? EMPTY_VALUE
    }

    #name() {
      return `Virtual${Base.name}Property`
    }

    [Symbol.name]() {
      return this.#name
    }

    [Symbol.toStringTag]() {
      return this.#name
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
