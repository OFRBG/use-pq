import { useEffect, useRef, useState } from 'react'
import produce from 'immer'
import set from 'lodash.set'
import get from 'lodash.get'
import { makeProxy } from './makeProxy'
import type { Path } from './makeProxy'

const parseQuery = (q: object) =>
  JSON.stringify(q, null, 2)
    .replace(/[":,#_]|\{\}/gm, '')
    .slice(1, -1)

export function usePq(
  handler: (query: string, setResult: (payload: any) => void) => void
) {
  const query = useRef({})
  const [data, setData] = useState(null)

  const updateQuery = (path: Path) => {
    if (get(query.current, path) === '#') {
      return query.current
    }

    query.current = produce(query.current, (draft) => {
      const graphqlPath = path.replace(/_\[\]/gm, '')
      set(draft, graphqlPath, '#')
    })

    return query.current
  }

  useEffect(() => {
    handler(parseQuery(query.current), setData)
  })

  return [
    makeProxy(data, 'query', updateQuery),
    parseQuery(query.current),
  ] as const
}
