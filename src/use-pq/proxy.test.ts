/// <reference types="vitest/globals" />
import { joinArray, joinObject } from './proxy'
import { VirtualArrayProperty, VirtualObjectProperty } from './virtual-property'

describe('makeProxy', () => {
  it('sets a simple object', () => {
    const proxy = joinObject(null, 'query', () => {})

    expect(proxy.path).toBe('query')
    expect(proxy.value()).toBe(null)
  })

  it('creates nested proxies', () => {
    const proxy = joinObject(null, 'query', () => {})

    expect(proxy.virtual.subproperty.path).toBe('query.virtual.subproperty')
    expect(proxy.virtual.subproperty.get()).toBe(null)
  })

  it('creates nested array proxies', () => {
    const proxy = joinArray(null, 'query', () => {})

    expect(proxy.listOf('virtual')).toBeInstanceOf(VirtualArrayProperty)
    expect(proxy.listOf('virtual').value()).toBeInstanceOf(Array)
    expect(proxy.listOf('virtual')[1].branch.leaf.path).toBe(
      'query.virtual.branch.leaf'
    )
    expect(proxy.virtual.get()).toBe(null)
  })

  it('return real array proxies', () => {
    const proxy = joinArray({ virtual: ['real', 'real'] }, 'query', () => {})

    expect(proxy.virtual).toBeInstanceOf(VirtualArrayProperty)
    expect(proxy.virtual.get()).toEqual(['real', 'real'])
  })

  it('return real nested array proxies', () => {
    const proxy = joinArray(
      { virtual: [{ field: 'real' }, { field: 'real' }] },
      'query',
      () => {}
    )

    expect(proxy.listOf('virtual').value()).toBeInstanceOf(Array)
    expect(proxy.listOf('virtual')).toBeInstanceOf(VirtualArrayProperty)
    expect(proxy.listOf('virtual')[0]).toBeInstanceOf(VirtualObjectProperty)
  })

  it('returns real values', () => {
    const proxy = joinObject({ virtual: 'real' } as any, 'query', () => {})

    expect(proxy.virtual.get()).toBe('real')
  })

  it('creates argument functions', () => {
    const proxy = joinObject(null, 'query', () => {})

    proxy.virtual.$params({ a: 1 }).subfield.get()

    expect(proxy.virtual.$params).toBeInstanceOf(Function)
    expect(proxy.virtual.$params({ a: 1 })).toBeInstanceOf(
      VirtualObjectProperty
    )
  })
})
