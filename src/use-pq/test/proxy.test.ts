/// <reference types="vitest/globals" />
import { createArrayProxy, createObjectProxy } from '../proxy'
import { VirtualArray, VirtualObject } from '../virtual-property'

describe('makeProxy', () => {
  it('sets a simple object', () => {
    const proxy = createObjectProxy(null, 'query', () => {})

    expect(proxy.property.path).toBe('query')
    expect(proxy.value()).toBe(null)
  })

  it('creates nested proxies', () => {
    const proxy = createObjectProxy(null, 'query', () => {})

    expect(proxy.virtual.subproperty.property.path).toBe(
      'query.virtual.subproperty'
    )
    expect(proxy.virtual.subproperty.get()).toBe(null)
  })

  it('creates nested array proxies', () => {
    const proxy = createObjectProxy(null, 'query', () => {})

    expect(proxy.listOf('virtual')).toBeInstanceOf(VirtualArray)
    expect(proxy.listOf('virtual').value()).toBeInstanceOf(Array)
    expect(proxy.listOf('virtual')[1].branch.leaf.property.path).toBe(
      'query.virtual.branch.leaf'
    )
    expect(proxy.virtual.get()).toBe(null)
  })

  it('return real array proxies', () => {
    const proxy = createObjectProxy(
      { virtual: ['real1', 'real2'] },
      'query',
      () => {}
    )

    expect(proxy.virtual).toBeInstanceOf(VirtualArray)
    expect(proxy.virtual.get()).toEqual(['real1', 'real2'])
  })

  it('return real nested array proxies', () => {
    const proxy = createObjectProxy(
      { virtual: [{ field: 'real1' }, { field: 'real2' }] },
      'query',
      () => {}
    )

    expect(proxy.listOf('virtual').value()).toBeInstanceOf(Array)
    expect(proxy.listOf('virtual')).toBeInstanceOf(VirtualArray)
    expect(proxy.listOf('virtual')[0]).toBeInstanceOf(VirtualObject)
    expect(proxy.listOf('virtual')[0].field.get()).toBe('real1')
  })

  it('returns real values', () => {
    const proxy = createObjectProxy(
      { virtual: 'real' } as any,
      'query',
      () => {}
    )

    expect(proxy.virtual.get()).toBe('real')
  })

  it('creates argument functions', () => {
    const proxy = createObjectProxy(null, 'query', () => {})

    proxy.virtual.$params({ a: 1 }).subfield.get()

    expect(proxy.virtual.$params).toBeInstanceOf(Function)
    expect(proxy.virtual.$params({ a: 1 })).toBeInstanceOf(VirtualObject)
  })
})
