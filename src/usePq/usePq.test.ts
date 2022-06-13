import { vi, test, afterEach, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks'
import { usePq } from './usePq'

afterEach(() => {
  vi.clearAllMocks()
})

const handleQuery = (query, setResult) => {
  setTimeout(() => setResult({ field: { subfield: 'test' } }), 0)
}

test('usePq', async () => {
  const mock = vi.fn().mockImplementation(handleQuery)
  const { result, waitForNextUpdate } = renderHook(() => usePq(mock))

  act(() => {
    result.current[0].field.subfield.value()
  })

  await waitForNextUpdate()

  expect(mock).toHaveBeenCalled()
  expect(result.current[0].field.subfield.value()).toBe('test')
})
