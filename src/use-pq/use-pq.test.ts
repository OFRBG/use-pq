/// <reference types="vitest/globals" />
import { renderHook } from '@testing-library/react-hooks'
import { usePq } from './use-pq'

describe('usePq', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  const getArgField = (id: string | number) => `field(id: "${id}", first: 2)`
  const makeFieldArray = (field: string) => field + '_'

  test('field fetching', async () => {
    const handleQuery = async (query) => {
      return query ? { field: { subfield: 'test' } } : null
    }

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    result.current[0].field.subfield.get()

    rerender()
    expect(result.current[2]).toBe(true)
    await waitForNextUpdate()

    expect(result.current[2]).toBe(false)
    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.subfield.get()).toBe('test')
  })

  test('array fetching', async () => {
    const handleQuery = async (query) => {
      return query
        ? { field: { subfield: [{ leaf: '1' }, { leaf: '2' }] } }
        : null
    }

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    const list = result.current[0].field.subfield_

    list.map((entry) => entry.leaf.get())

    rerender()
    expect(result.current[2]).toBe(true)
    await waitForNextUpdate()

    expect(result.current[2]).toBe(false)
    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.subfield_[0].leaf.get()).toBe('1')
  })

  test('inline fragment polymorphism', async () => {
    const handleQuery = async (query) => {
      return query
        ? { field: { notTree: true, subfield: [{ leaf: '1' }, { leaf: '2' }] } }
        : null
    }

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    const list = result.current[0].field.on('Tree').subfield_
    result.current[0].field.on('Forest').subfield.get()
    result.current[0].field.notTree.get()

    list.map((entry) => entry.leaf.get())

    rerender()
    expect(result.current[2]).toBe(true)
    await waitForNextUpdate()

    expect(result.current[2]).toBe(false)
    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.subfield_[0].leaf.get()).toBe('1')
    expect(result.current[0].field.notTree.get()).toBe(true)
  })

  test('query parameters', async () => {
    const handleQuery = async (query) => {
      return query ? { field: { subfield: { id: 1 } } } : null
    }

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    result.current[0][getArgField(1)].subfield.get()

    rerender()
    expect(result.current[2]).toBe(true)
    await waitForNextUpdate()

    expect(result.current[2]).toBe(false)
    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.subfield.id.get()).toBe(1)
    expect(result.current[1]).toContain(getArgField(1))
  })

  test('function query parameters', async () => {
    const handleQuery = async (query) => {
      return query ? { field: { subfield: 'test' } } : null
    }

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    result.current[0].field.$params({ id: '1' }).subfield.get()

    rerender()
    expect(result.current[2]).toBe(true)
    await waitForNextUpdate()

    expect(result.current[2]).toBe(false)
    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.subfield.get()).toBe('test')
  })

  test('list query parameters', async () => {
    const handleQuery = async (query) => {
      return query ? { field: [{ subfield: 1 }, { subfield: 2 }] } : null
    }

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    const list = result.current[0][makeFieldArray(getArgField(1))]

    list.map((entry) => entry.subfield.get())

    rerender()
    expect(result.current[2]).toBe(true)
    await waitForNextUpdate()

    expect(result.current[2]).toBe(false)
    expect(mock).toHaveBeenCalled()
    expect(
      result.current[0][makeFieldArray(getArgField(1))][0].subfield.get()
    ).toBe(1)
    expect(result.current[1]).toEqual(expect.stringContaining(getArgField(1)))
  })

  test('list function query parameters', async () => {
    const handleQuery = async (query) => {
      return query ? { field: [{ subfield: 1 }, { subfield: 2 }] } : null
    }

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    const list = result.current[0].field.$params_({ id: '1', first: 2 })

    list.map((entry) => entry.subfield.get())

    rerender()
    expect(result.current[2]).toBe(true)
    await waitForNextUpdate()

    expect(result.current[2]).toBe(false)
    expect(mock).toHaveBeenCalled()
    expect(
      result.current[0][makeFieldArray(getArgField(1))][0].subfield.get()
    ).toBe(1)
  })

  test('query variables', async () => {
    const handleQuery = async (query) => {
      return query ? { field: [{ subfield: 1 }, { subfield: 2 }] } : null
    }

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    result.current[0]
      .with({ $episode: 'Episode' })
      .field.$({ episode: '$episode' })
      .subfield.get()

    rerender()
    expect(result.current[2]).toBe(true)
    await waitForNextUpdate()

    expect(result.current[2]).toBe(false)
    expect(mock).toHaveBeenCalled()
    expect(
      result.current[0][makeFieldArray(getArgField(1))][0].subfield.get()
    ).toBe(1)
  })

  test('duplicate queries', async () => {
    const handleQuery = async (query) => {
      return query ? { field: [{ subfield: 1 }, { subfield: 2 }] } : null
    }

    let list

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    list = result.current[0][makeFieldArray(getArgField('first'))]
    list.map((entry) => entry.subfield.get())
    list.map((entry) => entry.meta.id.get())

    rerender()
    expect(result.current[2]).toBe(true)
    await waitForNextUpdate()

    list = result.current[0][makeFieldArray(getArgField('second'))]
    list.map((entry) => entry.subfield.get())
    list.map((entry) => entry.meta.id.get())

    rerender()
    expect(result.current[2]).toBe(true)
    expect(
      result.current[0][makeFieldArray(getArgField('second'))][0].subfield.get()
    ).toBeNull()
    await waitForNextUpdate()

    expect(result.current[2]).toBe(false)
    expect(mock).toHaveBeenCalledTimes(3)
    expect(mock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(getArgField('first'))
    )
    expect(mock).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining(getArgField('second'))
    )
    expect(result.current[1]).toContain(getArgField('second'))
  })
})
