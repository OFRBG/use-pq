import { EMPTY_VALUE, Path } from './virtual-property'

export const isIndexProp = (prop: Path) =>
  prop !== EMPTY_VALUE && Number.isInteger(Number(prop))

export const isListProp = (prop: Path) =>
  prop !== EMPTY_VALUE && prop.charAt(prop.length - 1) === '_'

export const isInlineFragmentProp = (prop: Path) =>
  prop !== EMPTY_VALUE && prop === 'on'

export const isParamProp = (prop: Path) =>
  prop !== EMPTY_VALUE && prop.charAt(0) === '$'

export const isVariableProp = (prop: Path) =>
  prop !== EMPTY_VALUE && prop === 'with'

export const parseProp = (prop: string): [string, string, string] => {
  const queryProp = prop.replace(/\s|\(.*\)|_$/gm, '')
  const params = prop.match(/\((.*)\)/)?.[0] || ''

  return [queryProp, params, '']
}

export const getFragmentString = (type: string) => {
  return `["... on ${type}"]`
}

export const getArgsString = (args: object) => {
  let argString = '('

  for (let key in args) {
    const value = args[key]
    argString += `${key}:`

    switch (typeof value) {
      case 'string':
        argString += args[key].charAt(0) === '$' ? args[key] : `'${args[key]}'`
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
        throw new Error('Unhandled paramter type %s of %s')
    }

    argString += ','
  }

  return argString + ')'
}
