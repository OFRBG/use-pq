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
  Constructor,
  Path,
  ResolvedValue,
  VirtualArrayProperty,
  VirtualObjectProperty,
  VirtualProperty,
  VirtualPropertyInterface,
} from './virtual-property'

const getNestedProxy = (
  prop: string,
  value: ResolvedValue | ResolvedValue[],
  path: string,
  updateQuery: (target: VirtualProperty) => void
) => {
  if (isListProp(prop)) {
    return value && (value as ResolvedValue[]).length > 0
      ? joinArray(
          (value as ResolvedValue[]).map((entry) =>
            joinObject(entry, path, updateQuery)
          ),
          path,
          updateQuery
        )
      : joinArray([joinObject(undefined, path, updateQuery)], path, updateQuery)
  }

  return joinObject(value as ResolvedValue, path, updateQuery)
}

function handlerWithEffect(
  updateQuery: (target: VirtualProperty) => void
): ProxyHandler<VirtualProperty> {
  return {
    get: function (target, prop) {
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

      if (isIndexProp(prop)) {
        return getNestedProxy(prop, target.value(), target.path, updateQuery)
      }

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

    return new Proxy<VirtualProperty>(vo, handlerWithEffect(updateQuery))
  }

export const joinObject = join(VirtualObjectProperty)
export const joinArray = join(VirtualArrayProperty)
