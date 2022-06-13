import { it, describe, expect } from 'vitest'
import { makeProxy } from './makeProxy'

describe('makeProxy', () => {
  it('sets a simple object', () => {
    const proxy = makeProxy(null, 'query', () => {})

    expect(proxy.path).toBe('query')
    expect(proxy.value()).toBe(null)
  })

  it('creates nested proxies', () => {
    const proxy = makeProxy(null, 'query', () => {})

    expect(proxy.virtual.path).toBe('query.virtual')
    expect(proxy.virtual.value()).toBe(null)
  })

  it('returns real values', () => {
    const proxy = makeProxy({ virtual: 'real' }, 'query', () => {})

    expect(proxy.virtual.value()).toBe('real')
  })
})
