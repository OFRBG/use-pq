import { RenderResult } from '@testing-library/react-hooks'
import { TypedDocumentNode, gql } from 'urql'
import { UsePqReturn } from './use-pq/use-pq'

expect.extend({
  toBeQuery(received: RenderResult<UsePqReturn>, query: TypedDocumentNode) {
    if (this.equals(gql(received.current[1]), query)) {
      return {
        message: () => `expected queries not to match`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected queries to match\n${this.utils.diff(
            gql(received.current[1]),
            query
          )}`,
        pass: false,
      }
    }
  },
  toBeLoading(received: RenderResult<UsePqReturn>) {
    const pass = received.current[2].isLoading

    if (pass) {
      return {
        message: () => `expected ${received} not to be loading`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be loading`,
        pass: false,
      }
    }
  },
})
