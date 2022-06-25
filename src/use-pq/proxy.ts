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
  VirtualArrayProperty,
  VirtualObjectProperty,
  VirtualProperty,
} from './virtual-property'
import type {
  ResolvedValue,
  Constructor,
  Path,
  VirtualPropertyInterface,
} from './virtual-property.types'

const getNestedProxy = (
  value: ResolvedValue,
  path: string,
  updateQuery: (target: VirtualProperty) => void
) => {
  if (Array.isArray(value)) {
    return joinArray(
      value.map((entry) => joinObject(entry, path, updateQuery)),
      path,
      updateQuery
    )
  }

  return joinObject(value, path, updateQuery)
}

function handlerWithEffect(
  updateQuery: (target: VirtualProperty) => void
): ProxyHandler<VirtualProperty> {
  return {
    get: function (parent, prop) {
      if (
        prop === 'get' ||
        prop === Symbol.toPrimitive ||
        prop === Symbol.iterator
      ) {
        updateQuery(parent)
      }

      if (prop === 'get') {
        return parent.value
      }

      if (prop in parent) {
        return parent[prop]
      }

      if (typeof prop === 'symbol') {
        throw new Error('Symbol query paths are not supported.')
      }

      if (isIndexProp(prop)) {
        return getNestedProxy(parent.value(), parent.path, updateQuery)
      }

      if (isParamProp(prop)) {
        return (params: object) =>
          getNestedProxy(
            parent.value(),
            parent.path + getArgsString(params),
            updateQuery
          )
      }

      if (isVariableProp(prop)) {
        return (params: object) =>
          getNestedProxy(
            parent.value(),
            parent.path + getVariablesString(params),
            updateQuery
          )
      }

      if (isInlineFragmentProp(prop)) {
        return (type: string) =>
          getNestedProxy(
            parent.value(),
            parent.path + getFragmentString(type),
            updateQuery
          )
      }

      if (isListProp(prop)) {
        return (field: string) => {
          const [parsedProp] = parseProp(field)
          const requestedValue = parent.value()?.[parsedProp]

          return getNestedProxy(
            requestedValue?.length ? requestedValue : [undefined],
            parent.path + `.${field}`,
            updateQuery
          )
        }
      }

      const [parsedProp, params] = parseProp(prop)
      const requestedValue = parent.value()?.[parsedProp]
      const path = `${parent.path}.${parsedProp}`

      return getNestedProxy(requestedValue, path + params, updateQuery)
    },
  }
}

export const join =
  (VirtualProperty: Constructor<VirtualProperty> = VirtualObjectProperty) =>
  (
    value: ResolvedValue,
    path: Path,
    updateQuery: (target: VirtualProperty) => void
  ): VirtualPropertyInterface => {
    const vo = new VirtualProperty({ value, path })

    // VirtualPropertyInterface is a superset of any keys
    // over VirtualProperty. Encoding that into the class
    // does not seem possible without triggering compilation
    // errors.
    return new Proxy<VirtualPropertyInterface>(
      vo as any,
      handlerWithEffect(updateQuery) as any
    )
  }

export const joinObject = join(VirtualObjectProperty)
export const joinArray = join(VirtualArrayProperty)
