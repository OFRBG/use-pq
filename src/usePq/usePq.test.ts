import { vi, test, afterEach, expect, describe } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks/pure'
import { usePq } from './usePq'

afterEach(() => {
  vi.clearAllMocks()
})

describe('usePq', () => {
  test('field fetching', async () => {
    const handleQuery = (query, setResult) => {
      setTimeout(() => setResult({ field: { subfield: 'test' } }), 0)
    }

    const mock = vi.fn().mockImplementation(handleQuery)
    const { result, waitForNextUpdate } = renderHook(() => usePq(mock))

    act(() => {
      result.current[0].field.subfield.get()
    })

    await waitForNextUpdate()

    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.subfield.get()).toBe('test')
  })

  test('array fetching', async () => {
    const handleQuery = (query, setResult) => {
      setTimeout(
        () =>
          setResult({ field: { subfield: [{ leaf: '1' }, { leaf: '2' }] } }),
        0
      )
    }

    const mock = vi.fn().mockImplementation(handleQuery)
    const { result, waitForNextUpdate } = renderHook(() => usePq(mock))

    const list = result.current[0].field.subfield_

    act(() => {
      list.map((entry) => entry.leaf.get())
    })

    await waitForNextUpdate()

    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.subfield_[0].leaf.get()).toBe('1')
  })

  test('query parameters', async () => {
    const handleQuery = (query, setResult) => {
      setTimeout(() => setResult({ field: { subfield: { id: 1 } } }), 0)
    }

    const mock = vi.fn().mockImplementation(handleQuery)
    const { result, waitForNextUpdate } = renderHook(() => usePq(mock))
    const argField = `field(id: "1")`

    act(() => {
      result.current[0][argField].subfield.id.get()
    })

    await waitForNextUpdate()

    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.subfield.id.get()).toBe(1)
    expect(result.current[1]).toContain(argField)
  })

  test('list query parameters', async () => {
    const handleQuery = (query, setResult) => {
      setTimeout(
        () => setResult({ field: [{ subfield: 1 }, { subfield: 2 }] }),
        0
      )
    }

    const mock = vi.fn().mockImplementation(handleQuery)
    const { result, waitForNextUpdate } = renderHook(() => usePq(mock))
    const argField = `field(id: "1", first: 2)_`

    const list = result.current[0][argField]

    act(() => {
      list.map((entry) => entry.subfield.get())
    })

    await waitForNextUpdate()

    expect(mock).toHaveBeenCalled()
    expect(result.current[0][argField][0].subfield.get()).toBe(1)
    expect(result.current[1]).toContain(argField.slice(0, -1))
  })
})
