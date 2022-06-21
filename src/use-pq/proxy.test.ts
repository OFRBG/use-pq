/// <reference types="vitest/globals" />
import { join } from './proxy'
import { VirtualObjectProperty } from './virtual-property'

describe('makeProxy', () => {
  it('sets a simple object', () => {
    const proxy = join(null, 'query', () => {})

    expect(proxy.path).toBe('query')
    expect(proxy.value()).toBe(null)
  })

  it('creates nested proxies', () => {
    const proxy = join(null, 'query', () => {})

    expect(proxy.virtual.path).toBe('query.virtual')
    expect(proxy.virtual.get()).toBe(null)
  })

  it('returns real values', () => {
    const proxy = join({ virtual: 'real' } as any, 'query', () => {})

    expect(proxy.virtual.get()).toBe('real')
  })

  it('creates argument functions', () => {
    const proxy = join(null, 'query', () => {})

    proxy.virtual.$params({ a: 1 }).subfield.get()

    expect(proxy.virtual.$params).toBeInstanceOf(Function)
    expect(proxy.virtual.$params({ a: 1 })).toBeInstanceOf(
      VirtualObjectProperty
    )
  })
})
