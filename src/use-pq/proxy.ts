import {
  getArgsString,
  getFragmentString,
  getVariablesString,
  isIndexProp,
  isInlineFragmentProp,
  isListProp,
  isParamProp,
  isVariableProp,
  parseProp,
} from './property'
import {
  VirtualArray,
  VirtualObject,
  VirtualProperty,
} from './virtual-property'
import type {
  ResolvedValue,
  Path,
  VirtualObjectInterface,
} from './virtual-property.types'

const getNestedProxy = <T>(
  value: ResolvedValue<T>,
  path: string,
  updateQuery: (target: unknown) => void
) => {
  if (Array.isArray(value)) {
    const wrappedValues = value.map((entry) =>
      createObjectProxy(entry, path, updateQuery)
    )

    return createArrayProxy(wrappedValues, path, updateQuery)
  }

  return createObjectProxy(value, path, updateQuery)
}

function proxyHandler<T extends VirtualProperty<any>>(
  updateQuery: (target: T) => void
): ProxyHandler<T> {
  return {
    get: function (object, property) {
      if (
        property === 'get' ||
        property === 'toString' ||
        property === Symbol.toPrimitive ||
        property === Symbol.iterator
      ) {
        updateQuery(object)
      }

      if (property in object) {
        return Reflect.get(object, property)
      }

      if (typeof property === 'symbol') {
        throw new Error('Symbol query paths are not supported.')
      }

      if (isIndexProp(property)) {
        return getNestedProxy(
          object.value()[property],
          object.property.path,
          updateQuery
        )
      }

      if (isParamProp(property)) {
        return (params: object) =>
          getNestedProxy(
            object.value(),
            object.property.path + getArgsString(params),
            updateQuery
          )
      }

      if (isVariableProp(property)) {
        return (params: object) =>
          getNestedProxy(
            object.value(),
            object.property.path + getVariablesString(params),
            updateQuery
          )
      }

      if (isInlineFragmentProp(property)) {
        return (type: string) =>
          getNestedProxy(
            object.value(),
            object.property.path + getFragmentString(type),
            updateQuery
          )
      }

      if (isListProp(property)) {
        return (field: string) => {
          const { queryProp } = parseProp(field)
          const requestedValue = object.value()?.[queryProp]

          return getNestedProxy(
            requestedValue?.length ? requestedValue : [undefined],
            `${object.property.path}.${field}`,
            updateQuery
          )
        }
      }

      const { queryProp, params } = parseProp(property)
      const requestedValue = object.value()?.[queryProp]
      const path = `${object.property.path}.${queryProp}`

      return getNestedProxy(requestedValue, path + params, updateQuery)
    },
  }
}

export const createObjectProxy = <T>(
  value: ResolvedValue<T>,
  path: Path,
  updateQuery: (target: VirtualObject<ResolvedValue<T>>) => void
) => {
  const virtualValue = new VirtualObject({ value, path })
  const handler = proxyHandler(updateQuery)

  return new Proxy(virtualValue, handler)
}

export const createArrayProxy = <T>(
  value: ResolvedValue<T>[],
  path: Path,
  updateQuery: (target: VirtualArray<T>) => void
) => {
  const virtualValue = new VirtualArray({ value, path })
  const handler = proxyHandler(updateQuery)

  return new Proxy(virtualValue, handler)
}
