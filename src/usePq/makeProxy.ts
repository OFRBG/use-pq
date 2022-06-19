import { C } from 'ts-toolbelt'
import { Path, EMPTY_VALUE, VirtualProperty } from './VirtualProperty'

const isArrayProp = (prop: Path) =>
  prop !== EMPTY_VALUE && prop.charAt(prop.length - 1) === '_'

const isParamProp = (prop: Path) =>
  prop !== EMPTY_VALUE && prop.charAt(0) === '$'

const parseProp = (prop: string): [string, string, string] => {
  const queryProp = prop.replace(/\(.*\)|_$/gm, '')
  const params = prop.match(/\((.*)\)/)?.[0] || ''

  return [queryProp, params, '']
}

const buildArgs = (args) => {
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
  value: VirtualProperty | null,
  prop: string,
  path: Path,
  params: string,
  updateQuery
) {
  const virtualProp = new VirtualProperty({ prop, value, path, params })

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
      const requestedValue = target?.value()?.[parsedProp]
      const path = `${target.path}.${parsedProp}`

      if (isParamProp(prop)) {
        return (params) => {
          const args = buildArgs(params)
          const parentValue = target?.value()

          if (isArrayProp(prop)) {
            return (parentValue || [EMPTY_VALUE]).map((entry) =>
              makeProxy(entry, prop, target.path + args, params, updateQuery)
            )
          }

          return makeProxy(
            target?.value(),
            prop,
            target.path + args,
            args,
            updateQuery
          )
        }
      }

      if (isArrayProp(prop)) {
        return (requestedValue || [EMPTY_VALUE]).map((entry) =>
          makeProxy(entry, prop, path + params, params, updateQuery)
        )
      }

      return makeProxy(requestedValue, prop, path + params, params, updateQuery)
    },
  })
}
