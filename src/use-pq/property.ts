import { VirtualObjectProperty } from './virtual-property'
import { Path, EMPTY_VALUE } from './virtual-property.types'

export const isIndexProp = (prop: Path): prop is `${number}` =>
  prop !== EMPTY_VALUE && Number.isInteger(Number(prop))

export const isListProp = (prop: Path): prop is `listOf` =>
  prop !== EMPTY_VALUE && prop === 'listOf'

export const isInlineFragmentProp = (prop: Path): prop is `on` =>
  prop !== EMPTY_VALUE && prop === 'on'

export const isParamProp = (prop: Path): prop is `$${string}` =>
  prop !== EMPTY_VALUE && prop.charAt(0) === '$'

export const isVariableProp = (prop: Path): prop is `with` =>
  prop !== EMPTY_VALUE && prop === 'with'

export const parseProp = (prop: string): [string, string, string] => {
  const queryProp = prop.replace(/\s|\(.*\)|_$/gm, '')
  const params = prop.match(/\((.*)\)/)?.[0] || ''

  return [queryProp, params, '']
}

export const getFragmentString = (type: string) => {
  return `["... on ${type}"]` as const
}

export const getArgsString = (args: object) => {
  let argString = '('

  for (let key in args) {
    const value = args[key]
    argString += `${key}:`

    switch (typeof value) {
      case 'string':
        argString += args[key].charAt(0) === '$' ? args[key] : `"${args[key]}"`
        break
      case 'number':
        argString += args[key]
        break
      case 'object':
        if (args[key] instanceof VirtualObjectProperty) {
          argString += JSON.stringify(args[key].get())
          break
        } else {
          throw new Error(
            `Unhandled parameter type ${typeof value} of ${value}`
          )
        }
      default:
        throw new Error(`Unhandled parameter type ${typeof value} of ${value}`)
    }

    argString += ','
  }

  return argString + ')'
}

export const getVariablesString = (args: object) => {
  let argString = '('

  for (let key in args) {
    const value = args[key]
    argString += `${key.charAt(0) !== '$' ? '$' : ''}${key}:`

    switch (typeof value) {
      case 'string':
        argString += args[key]
        break
      default:
        throw new Error(`Unhandled parameter type ${typeof value} of ${value}`)
    }

    argString += ','
  }

  return argString + ')'
}
