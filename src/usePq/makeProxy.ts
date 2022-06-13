export type Path = string

export type VirtualObject = {
  value: () => any
  path: Path
} | null

const EMPTY_VALUE = null

const isArrayProp = (prop: Path) => prop.charAt(prop.length - 1) === '_'

export function makeProxy(value: unknown, path: Path, updateQuery) {
  const virtualProp = {
    path,
    value: () => value || EMPTY_VALUE,
    get [Symbol.toStringTag]() {
      return 'VirtualProperty'
    },
  }

  return new Proxy(virtualProp, {
    get: (target, prop) => {
      if (prop === 'value') {
        updateQuery(target.path)
      }

      if (prop in target) {
        return target[prop]
      }

      if (typeof prop === 'symbol') {
        throw new Error('Symbol query paths are not supported.')
      }

      const path = `${target.path}.${prop}`

      const parsedProp = isArrayProp(prop) ? prop.slice(0, -1) : prop
      const requestedValue = target?.value()?.[parsedProp]

      if (isArrayProp(prop)) {
        return (requestedValue || [EMPTY_VALUE]).map((entry) =>
          makeProxy(entry, path, updateQuery)
        )
      }

      return makeProxy(requestedValue, path, updateQuery)
    },
  })
}
