import { EMPTY_VALUE, ResolvedValue } from './virtual-property.types'

interface VirtualClass<T> {
  name: string
  value(): T
}

export class VirtualObject<T extends ResolvedValue>
  extends Object
  implements VirtualClass<T>
{
  name: string = 'VirtualObject'

  constructor(public property: { path: string; value: T }) {
    super(property.value)
  }

  value(): T {
    return this.property.value ?? EMPTY_VALUE
  }

  get() {
    return this.value()
  }

  [Symbol.name]() {
    return this.name
  }

  [Symbol.toStringTag]() {
    return this.name
  }

  [Symbol.toPrimitive]() {
    return this.value()
  }

  *[Symbol.iterator]() {
    yield this.value()
  }

  toString() {
    return this.value()?.toString() || ''
  }
}

export class VirtualArray<
    T extends VirtualProperty<ResolvedValue> | ResolvedValue,
  >
  extends Array
  implements VirtualClass<T[]>
{
  name: string = 'VirtualArray'

  constructor(public property: { path: string; value: T[] }) {
    super()

    if (!Array.isArray(property.value)) return

    for (const item of property.value) {
      this.push(item)
    }
  }

  value(): T[] {
    return this.property.value.map((entry) => {
      return entry instanceof VirtualObject
        ? entry?.value()
        : entry ?? EMPTY_VALUE
    })
  }

  get() {
    return this.value()
  }

  [Symbol.name]() {
    return this.name
  }

  [Symbol.toStringTag]() {
    return this.name
  }

  *[Symbol.iterator]() {
    const value = this.value()

    for (let i = 0; i < value.length; i++) {
      yield value[i]
    }
  }

  toString() {
    return this.value().toString()
  }
}

export type VirtualProperty<T> = VirtualObject<T> | VirtualArray<T>
