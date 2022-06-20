/// <reference types="vitest/globals" />
import '@testing-library/jest-dom'

import React from 'react'
import { screen, render, waitFor } from '@testing-library/react'
import { usePq } from './usePq'

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

    expect(mock).toHaveBeenCalledTimes(2)
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

    expect(mock).toHaveBeenCalledTimes(2)
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

    expect(mock).toHaveBeenCalledTimes(1)
  })
})
