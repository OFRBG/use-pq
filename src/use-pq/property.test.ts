/// <reference types="vitest/globals" />
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

describe('object parsers', () => {
  test('getArgsString', () => {
    expect(getArgsString({ a: 1 })).toBe('(a:1,)')
    expect(getArgsString({ a: '2' })).toBe('(a:"2",)')
    expect(() => getArgsString({ a: Symbol('1') })).toThrow()
  })

  test('getFragmentString', () => {
    expect(getFragmentString('Type')).toBe('["... on Type"]')
  })

  test('getVariablesString', () => {
    expect(getVariablesString({ $a: '1' })).toBe('($a:1,)')
    expect(getVariablesString({ a: '1' })).toBe('($a:1,)')
    expect(() => getVariablesString({ a: Symbol('1') })).toThrow()
  })
})

describe('testers', () => {
  test('isIndexProp', () => {
    expect(isIndexProp('a')).toBe(false)
    expect(isIndexProp('1')).toBe(true)
  })

  test('isInlineFragmentProp', () => {
    expect(isInlineFragmentProp('field')).toBe(false)
    expect(isInlineFragmentProp('on')).toBe(true)
  })

  test('isListProp', () => {
    expect(isListProp('field')).toBe(false)
    expect(isListProp('field_')).toBe(true)
  })

  test('isParamProp', () => {
    expect(isParamProp('field')).toBe(false)
    expect(isParamProp('$')).toBe(true)
    expect(isParamProp('$_')).toBe(true)
  })

  test('isVariableProp', () => {
    expect(isVariableProp('field')).toBe(false)
    expect(isVariableProp('with')).toBe(true)
  })
})

test('parseProp', () => {
  expect(parseProp('field')).toEqual(['field', '', ''])
  expect(parseProp('field_')).toEqual(['field', '', ''])
  expect(parseProp('field(a:1)')).toEqual(['field', '(a:1)', ''])
  expect(parseProp('field(a:1)_')).toEqual(['field', '(a:1)', ''])
  expect(parseProp('field (a:1)')).toEqual(['field', '(a:1)', ''])
  expect(parseProp('field (a:1)_')).toEqual(['field', '(a:1)', ''])
})
