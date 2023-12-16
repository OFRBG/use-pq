import { VirtualArray, VirtualObject } from '../virtual-property'

describe('VirtualProperty', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('VirtualPropertyObject', () => {
    const value = { a: 1 }
    const object = new VirtualObject({
      path: 'test-path',
      value,
    })

    expect(object.value()).toBe(value)
  })

  test('VirtualPropertyArray', () => {
    const innerValue = { a: 1 }

    const value = [
      new VirtualObject({
        path: 'test-path',
        value: innerValue,
      }),
    ]

    const array = new VirtualArray({
      path: 'test-path',
      value,
    })

    console.log(array.value())
    expect(array.value()).toEqual([innerValue])
  })
})
