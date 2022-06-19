import {
  EMPTY_VALUE,
  Path,
  VirtualProperty,
  ResolvedValue,
} from './VirtualProperty'

const isListProp = (prop: Path) =>
  prop !== EMPTY_VALUE && prop.charAt(prop.length - 1) === '_'

const isParamProp = (prop: Path) =>
  prop !== EMPTY_VALUE && prop.charAt(0) === '$'

const parseProp = (prop: string): [string, string, string] => {
  const queryProp = prop.replace(/\(.*\)|_$/gm, '')
  const params = prop.match(/\((.*)\)/)?.[0] || ''

  return [queryProp, params, '']
}

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

const getArgsString = (args: object) => {
  let argString = '('

  for (let key in args) {
    const value = args[key]
    argString += `${key}: `

    switch (typeof value) {
      case 'string':
        argString += `'${args[key]}'`
        break
      case 'number':
        argString += args[key]
        break
      default:
        throw new Error('Unhandled paramter type %s of %s')
    }

    argString += ','
  }

  return argString + ')'
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

      return getNestedProxy(prop, requestedValue, path + params, updateQuery)
    },
  })
}
