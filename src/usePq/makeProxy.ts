import { Path, EMPTY_VALUE, VirtualProperty } from './VirtualProperty'

const isArrayProp = (prop: Path) =>
  prop !== EMPTY_VALUE && prop.charAt(prop.length - 1) === '_'

const parseProp = (prop: string) =>
  (isArrayProp(prop) ? prop.slice(0, -1) : prop).replace(/\(.*\)/gm, '')

export function makeProxy(
  value: VirtualProperty | null,
  path: Path,
  updateQuery
) {
  const virtualProp = new VirtualProperty(value, path)

  return new Proxy(virtualProp, {
    get: (target, prop) => {
      if (prop === 'get') {
        updateQuery(target.path)

        return target.value
      }

      if (prop in target) {
        return target[prop]
      }

      if (typeof prop === 'symbol') {
        throw new Error('Symbol query paths are not supported.')
      }

      const path = `${target.path}.${prop}`
      const parsedProp = parseProp(prop)
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
