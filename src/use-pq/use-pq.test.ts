import { renderHook } from '@testing-library/react-hooks'
import { gql } from 'urql'
import { usePq } from './use-pq'

describe('usePq', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  const getArgField = (id: string | number) => `field(id: "${id}", first: 2)`

  test('field fetching', async () => {
    const handleQuery = async (query) => {
      return query ? { field: { fetching: 'test' } } : null
    }
    const expectedQuery = gql`
      query {
        field {
          fetching
        }
      }
    `

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    result.current[0].field.fetching.get()

    rerender()
    expect(result).toBeLoading()
    await waitForNextUpdate()

    expect(result).not.toBeLoading()
    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.fetching.get()).toBe('test')
    expect(result).toBeQuery(expectedQuery)
  })

  test('array fetching', async () => {
    const handleQuery = async (query) => {
      return query ? { field: { array: [{ leaf: '1' }, { leaf: '2' }] } } : null
    }
    const expectedQuery = gql`
      query {
        field {
          array {
            leaf
          }
        }
      }
    `

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    result.current[0].field.listOf('array').forEach((entry) => {
      entry.leaf.get()
    })

    rerender()
    expect(result).toBeLoading()
    await waitForNextUpdate()

    expect(result).not.toBeLoading()
    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.listOf('array')[0].leaf.get()).toBe('1')
    expect(result).toBeQuery(expectedQuery)
  })

  test('inline fragment polymorphism', async () => {
    const handleQuery = async (query) => {
      return query
        ? {
            field: {
              isTree: false,
              subfield: [{ leaf: '1' }, { leaf: '2' }],
            },
          }
        : null
    }
    const expectedQuery = gql`
      query {
        field {
          isTree
          ... on Forest {
            subfield
          }
          ... on Tree {
            subfield {
              leaf
            }
          }
        }
      }
    `

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    result.current[0].field.isTree.get()
    result.current[0].field.on('Forest').subfield.get()
    result.current[0].field
      .on('Tree')
      .listOf('subfield')
      .forEach((entry) => {
        entry.leaf.get()
      })

    rerender()
    expect(result).toBeLoading()
    await waitForNextUpdate()

    expect(result).not.toBeLoading()
    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.listOf('subfield')[0].leaf.get()).toBe('1')
    expect(result.current[0].field.isTree.get()).toBe(false)
    expect(result).toBeQuery(expectedQuery)
  })

  test('query parameters', async () => {
    const handleQuery = async (query) => {
      return query ? { field: { subfield: { id: 1 } } } : null
    }
    const expectedQuery = gql`
      query {
        field(id: "1", first: 2) {
          subfield {
            id
          }
        }
      }
    `

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    result.current[0][getArgField(1)].subfield.id.get()

    rerender()
    expect(result).toBeLoading()
    await waitForNextUpdate()

    expect(result).not.toBeLoading()
    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.subfield.id.get()).toBe(1)
    expect(result).toBeQuery(expectedQuery)
  })

  test('function query parameters', async () => {
    const handleQuery = async (query) => {
      return query ? { field: { subfield: 'test' } } : null
    }
    const expectedQuery = gql`
      query {
        field(id: "1") {
          subfield
        }
      }
    `

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    result.current[0].field.$params({ id: '1' }).subfield.get()

    rerender()
    expect(result).toBeLoading()
    await waitForNextUpdate()

    expect(result).not.toBeLoading()
    expect(mock).toHaveBeenCalled()
    expect(result.current[0].field.subfield.get()).toBe('test')
    expect(result).toBeQuery(expectedQuery)
  })

  test('list query parameters', async () => {
    const handleQuery = async (query) => {
      return query ? { field: [{ subfield: 1 }, { subfield: 2 }] } : null
    }
    const expectedQuery = gql`
      query {
        field(id: "1", first: 2) {
          subfield
        }
      }
    `

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    result.current[0]
      .listOf(getArgField(1))
      .forEach((entry) => entry.subfield.get())

    rerender()
    expect(result).toBeLoading()
    await waitForNextUpdate()

    expect(result).not.toBeLoading()
    expect(mock).toHaveBeenCalled()
    expect(result.current[0].listOf(getArgField(1))[0].subfield.get()).toBe(1)
    expect(result).toBeQuery(expectedQuery)
  })

  test('list function query parameters', async () => {
    const handleQuery = async (query) => {
      return query ? { field: [{ subfield: 1 }, { subfield: 2 }] } : null
    }
    const expectedQuery = gql`
      query {
        field(id: "1", first: 2) {
          subfield
        }
      }
    `

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    result.current[0]
      .listOf('field')
      .$params({ id: '1', first: 2 })
      .forEach((entry) => {
        entry.subfield.get()
      })

    rerender()
    expect(result).toBeLoading()
    await waitForNextUpdate()

    expect(result).not.toBeLoading()
    expect(mock).toHaveBeenCalled()
    expect(result.current[0].listOf(getArgField(1))[0].subfield.get()).toBe(1)
    expect(result).toBeQuery(expectedQuery)
  })

  test('query variables', async () => {
    const handleQuery = async (query) => {
      return query ? { field: [{ subfield: 1 }, { subfield: 2 }] } : null
    }
    const expectedQuery = gql`
      query ($parameter: ID!) {
        field(id: $parameter) {
          subfield
        }
      }
    `

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    result.current[0]
      .with({ $parameter: 'ID!' })
      .field.$({ id: '$parameter' })
      .subfield.get()

    rerender()
    expect(result).toBeLoading()
    await waitForNextUpdate()

    expect(result).not.toBeLoading()
    expect(mock).toHaveBeenCalled()
    expect(result.current[0].listOf(getArgField(1))[0].subfield.get()).toBe(1)
    expect(result).toBeQuery(expectedQuery)
  })

  test('duplicate queries', async () => {
    const handleQuery = async (query) => {
      return query
        ? {
            field: [
              { subfield: 1, meta: { id: 11 } },
              { subfield: 2, meta: { id: 22 } },
            ],
          }
        : null
    }
    const expectedQuery = gql`
      query {
        field(id: "second", first: 2) {
          meta {
            id
          }
          subfield
        }
      }
    `

    const mock = vi.fn().mockImplementation(handleQuery)
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      usePq(mock)
    )

    result.current[0].listOf(getArgField('first')).forEach((entry) => {
      entry.meta.id.get()
      entry.subfield.get()
    })

    rerender()

    expect(mock).toHaveBeenLastCalledWith(
      expect.stringContaining(getArgField('first'))
    )
    expect(result).toBeLoading()
    await waitForNextUpdate()

    result.current[0].listOf(getArgField('second')).forEach((entry) => {
      entry.meta.id.get()
      entry.subfield.get()
    })

    rerender()

    expect(mock).toHaveBeenLastCalledWith(
      expect.stringContaining(getArgField('second'))
    )
    expect(result).toBeLoading()
    expect(
      result.current[0].listOf(getArgField('second'))[0].subfield.get()
    ).toBeNull()
    await waitForNextUpdate()

    expect(result).not.toBeLoading()
    expect(mock).toHaveBeenCalledTimes(2)
    expect(result).toBeQuery(expectedQuery)
  })

  test('commit query', async () => {
    const handleQuery = async (query) => {
      return query ? { field: [{ subfield: 1 }, { subfield: 2 }] } : null
    }
    const expectedQuery = gql`
      query {
        field(id: "second", first: 2) {
          meta {
            id
          }
          subfield
        }
      }
    `

    const mock = vi.fn().mockImplementation(handleQuery)
    const { result, waitForNextUpdate } = renderHook(() => usePq(mock))

    result.current[0].listOf(getArgField('first')).forEach((entry) => {
      entry.meta.id.get()
      entry.subfield.get()
    })
    result.current[2].commitQuery()

    expect(mock).toHaveBeenLastCalledWith(
      expect.stringContaining(getArgField('first'))
    )
    expect(result).toBeLoading()

    await waitForNextUpdate()

    result.current[0].listOf(getArgField('second')).forEach((entry) => {
      entry.meta.id.get()
      entry.subfield.get()
    })
    result.current[2].commitQuery()

    expect(mock).toHaveBeenLastCalledWith(
      expect.stringContaining(getArgField('second'))
    )
    expect(result).toBeLoading()
    expect(
      result.current[0].listOf(getArgField('second'))[0].subfield.get()
    ).toBeNull()

    await waitForNextUpdate()

    expect(result).not.toBeLoading()
    expect(mock).toHaveBeenCalledTimes(2)
    expect(result).toBeQuery(expectedQuery)
  })

  test('external data', async () => {
    const data = { field: { subfield: 'test' } }
    const expectedQuery = gql`
      query {
        field {
          subfield
        }
      }
    `

    const { rerender, result, waitForNextUpdate } = renderHook(() => usePq())

    result.current[0].field.subfield.get()

    rerender()

    expect(result).toBeLoading()
    expect(result).toBeQuery(expectedQuery)
    setTimeout(() => result.current[2].bindData(data), 0)

    await waitForNextUpdate()

    expect(result).not.toBeLoading()
    expect(result.current[0].field.subfield.get()).toBe('test')
  })
})
