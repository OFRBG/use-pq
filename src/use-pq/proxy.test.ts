/// <reference types="vitest/globals" />
import { makeProxy } from './proxy'
import { VirtualProperty } from './virtual-property'

describe('makeProxy', () => {
  it('sets a simple object', () => {
    const proxy = makeProxy(null, 'query', () => {})

    expect(proxy.path).toBe('query')
    expect(proxy.value()).toBe(null)
  })

  it('creates nested proxies', () => {
    const proxy = makeProxy(null, 'query', () => {})

    expect(proxy.virtual.path).toBe('query.virtual')
    expect(proxy.virtual.get()).toBe(null)
  })

  it('returns real values', () => {
    const proxy = makeProxy({ virtual: 'real' } as any, 'query', () => {})

    expect(proxy.virtual.get()).toBe('real')
  })

  it('creates argument functions', () => {
    const proxy = makeProxy(null, 'query', () => {})

    proxy.virtual.$params({ a: 1 }).subfield.get()

    expect(proxy.virtual.$params).toBeInstanceOf(Function)
    expect(proxy.virtual.$params({ a: 1 })).toBeInstanceOf(VirtualProperty)
  })
})
