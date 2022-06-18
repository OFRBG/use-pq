import { vi, test, afterEach, expect, describe } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks/pure'
import { usePq } from './usePq'

afterEach(() => {
  vi.clearAllMocks()
})

describe('usePq', () => {
  const getArgField = (id) => `field(id: "${id}", first: 2)`
  const makeFieldArray = (field) => field + '_'

  test('field fetching', async () => {
    const handleQuery = (query, setResult) => {
      setTimeout(() => setResult({ field: { subfield: 'test' } }), 0)
    }

    const mock = vi.fn().mockImplementation(handleQuery)
    const { result, waitForNextUpdate } = renderHook(() => usePq(mock))

    result.current[0].field.subfield.get()

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

    list.map((entry) => entry.leaf.get())

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

    result.current[0][getArgField(1)].subfield.get()

    await waitForNextUpdate()

    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.subfield.id.get()).toBe(1)
    expect(result.current[1]).toContain(getArgField(1))
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

    const list = result.current[0][makeFieldArray(getArgField(1))]

    list.map((entry) => entry.subfield.get())

    await waitForNextUpdate()

    expect(mock).toHaveBeenCalled()
    expect(
      result.current[0][makeFieldArray(getArgField(1))][0].subfield.get()
    ).toBe(1)
    expect(result.current[1]).toEqual(expect.stringContaining(getArgField(1)))
  })

  test('duplicate queries', async () => {
    const handleQuery = async (query, setResult) => {
      setTimeout(() => {
        setResult({ field: [{ subfield: 1 }, { subfield: 2 }] })
      }, 0)
    }

    let list

    const mock = vi.fn().mockImplementation(handleQuery)
    const { result, waitForNextUpdate } = renderHook(() => usePq(mock))

    list = result.current[0][makeFieldArray(getArgField('first'))]
    list.map((entry) => entry.subfield.get())
    list.map((entry) => entry.meta.id.get())

    await waitForNextUpdate()

    list = result.current[0][makeFieldArray(getArgField('second'))]
    list.map((entry) => entry.subfield.get())
    list.map((entry) => entry.meta.id.get())

    await waitForNextUpdate()

    expect(mock).toHaveBeenCalledTimes(3)
    expect(mock).toHaveBeenNthCalledWith(1, '', expect.anything())
    expect(mock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(getArgField('first')),
      expect.anything()
    )
    expect(mock).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining(getArgField('second')),
      expect.anything()
    )
    expect(result.current[1]).toContain(getArgField('second'))
  })
})
