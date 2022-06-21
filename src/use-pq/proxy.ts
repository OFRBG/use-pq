import {
  getArgsString,
  getFragmentString,
  getVariablesString,
  isInlineFragmentProp,
  isListProp,
  isParamProp,
  isVariableProp,
  parseProp,
} from './property'
import {
  EMPTY_VALUE,
  Path,
  VirtualProperty,
  ResolvedValue,
} from './virtual-property'

const getNestedProxy = (
  prop: string,
  value: ResolvedValue | ResolvedValue[],
  path: string,
  updateQuery: (target: VirtualProperty) => void
) => {
  if (isListProp(prop)) {
    return ((value as ResolvedValue[] | null) || [EMPTY_VALUE]).map((entry) =>
      makeProxy(entry, path, updateQuery)
    )
  }

  return makeProxy(value as ResolvedValue | null, path, updateQuery)
}

export function makeProxy(
  value: ResolvedValue | typeof EMPTY_VALUE,
  path: Path,
  updateQuery: (target: VirtualProperty) => void
) {
  const virtualProp = new VirtualProperty({ value, path })

  return new Proxy(virtualProp, {
    get: (target, prop) => {
      if (
        prop === 'get' ||
        prop === Symbol.toPrimitive ||
        prop === Symbol.iterator
      ) {
        updateQuery(target)
      }

      if (prop === 'get') {
        return target.value
      }

      if (prop in target) {
        return target[prop]
      }

      if (typeof prop === 'symbol') {
        throw new Error('Symbol query paths are not supported.')
      }

      const [parsedProp, params] = parseProp(prop)
      const requestedValue = target.value()?.[parsedProp]
      const path = `${target.path}.${parsedProp}`

      if (isParamProp(prop)) {
        return (params: object) =>
          getNestedProxy(
            prop,
            target.value(),
            target.path + getArgsString(params),
            updateQuery
          )
      }

      if (isVariableProp(prop)) {
        return (params: object) =>
          getNestedProxy(
            prop,
            target.value(),
            target.path + getVariablesString(params),
            updateQuery
          )
      }

      if (isInlineFragmentProp(prop)) {
        return (type: string) =>
          getNestedProxy(
            prop,
            target.value(),
            target.path + getFragmentString(type),
            updateQuery
          )
      }

      return getNestedProxy(prop, requestedValue, path + params, updateQuery)
    },
  })
}
