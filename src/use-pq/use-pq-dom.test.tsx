import '@testing-library/jest-dom'

import React, { useEffect, useState } from 'react'
import { screen, render, waitFor } from '@testing-library/react'
import { usePq } from './use-pq'
import { act } from '@testing-library/react'

const PqProvider = ({ handler, Child }) => {
  const [p, q, { commitQuery }] = usePq(handler)
  return <Child {...{ p, q, commitQuery }} />
}

describe('usePq in render', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('set prop', async () => {
    const handleQuery = async (query) => {
      return query ? { field: { id: '1' } } : null
    }

    const mock = vi.fn().mockImplementation(handleQuery)

    render(
      React.createElement(
        ({ handler }) => {
          const [p] = usePq(handler)
          return <span data-testid="target" data-id={p.field.id}></span>
        },
        { handler: mock }
      )
    )

    await waitFor(() => {
      expect(screen.getByTestId('target')).toHaveAttribute('data-id', '1')
    })

    expect(mock).toHaveBeenCalledTimes(1)
  })

  test('set child', async () => {
    const handleQuery = async (query) => {
      return query ? { field: { id: '1' } } : null
    }

    const mock = vi.fn().mockImplementation(handleQuery)

    render(
      React.createElement(
        ({ handler }) => {
          const [p] = usePq(handler)
          return <span data-testid="target">{p.field.id}</span>
        },
        { handler: mock }
      )
    )

    await waitFor(() => {
      expect(screen.getByTestId('target').innerHTML).toBe('1')
    })

    expect(mock).toHaveBeenCalledTimes(1)
  })

  test('skip field only in render', async () => {
    const handleQuery = async (query) => {
      return query ? { field: { id: '1' } } : null
    }

    const mock = vi.fn().mockImplementation(handleQuery)

    render(
      React.createElement(
        ({ handler }) => {
          const [p] = usePq(handler)
          p.field.id
          return <span data-testid="target"></span>
        },
        { handler: mock }
      )
    )

    await waitFor(() => {
      expect(screen.getByTestId('target').innerHTML).toBe('')
    })

    expect(mock).toHaveBeenCalledTimes(0)
  })

  test('empty arrays', async () => {
    const handleQuery = (b?) => async (query) => {
      return query ? { a: { b } } : null
    }

    const mock = vi
      .fn()
      .mockImplementationOnce(handleQuery([]))
      .mockImplementationOnce(handleQuery([{ c: 1 }]))

    const component = React.createElement(
      ({ handler }) => {
        const [p] = usePq(handler)
        const [c, setC] = useState(0)

        return (
          <>
            <span data-testid="target">
              {p.a
                .$({ c })
                .listOf('b')
                .map(({ c }) => c)}
            </span>
            <button data-testid="button" onClick={() => setC(c + 1)}></button>
          </>
        )
      },
      { handler: mock }
    )

    render(component)

    await waitFor(() => {
      expect(screen.getByTestId('target').innerHTML).toBe('')
    })

    act(() => {
      screen.getByTestId('button').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('target').innerHTML).toBe('1')
    })

    expect(mock).toHaveBeenCalledTimes(2)
  })

  test('empty objects', async () => {
    const handleQuery = (b?) => async (query) => {
      return query ? { a: { b } } : null
    }

    const mock = vi
      .fn()
      .mockImplementationOnce(handleQuery({}))
      .mockImplementationOnce(handleQuery({ c: { d: 1 } }))

    const component = React.createElement(
      ({ handler }) => {
        const [p] = usePq(handler)
        const [c, setC] = useState(0)

        return (
          <>
            <span data-testid="target">{p.a.$({ c }).b.c.d}</span>
            <button data-testid="button" onClick={() => setC(c + 1)}></button>
          </>
        )
      },
      { handler: mock }
    )

    render(component)

    await waitFor(() => {
      expect(screen.getByTestId('target').innerHTML).toBe('')
    })

    act(() => {
      screen.getByTestId('button').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('target').innerHTML).toBe('1')
    })

    expect(mock).toHaveBeenCalledTimes(2)
  })

  test('injected p', async () => {
    const handleQuery = (b?) => async (query) => {
      return query ? { a: { b } } : null
    }

    const mock = vi
      .fn()
      .mockImplementationOnce(handleQuery({}))
      .mockImplementationOnce(handleQuery({ c: { d: 1 } }))

    const component = ({ p, commitQuery }) => {
      const [c, setC] = useState(0)

      useEffect(commitQuery)

      return (
        <>
          <span data-testid="target">{p.a.$({ c }).b.c.d}</span>
          <button data-testid="button" onClick={() => setC(c + 1)}></button>
        </>
      )
    }

    render(<PqProvider handler={mock} Child={component} />)

    await waitFor(() => {
      expect(screen.getByTestId('target').innerHTML).toBe('')
    })

    act(() => {
      screen.getByTestId('button').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('target').innerHTML).toBe('1')
    })

    expect(mock).toHaveBeenCalledTimes(2)
  })
})
