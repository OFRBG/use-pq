import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import set from 'lodash.set'
import get from 'lodash.get'
import { makeProxy } from './makeProxy'
import { Path } from './VirtualProperty'

const parseQuery = (q: object) => {
  return JSON.stringify(q, null, 2)
    .replace(/[":](?![^(]*\))|[,#_\\]|\{\}/gm, '')
    .slice(1, -1)
}

export function usePq(
  handler: (query: string, setResult: (payload: any) => void) => Promise<void>
) {
  const query = useRef({})
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const updateQuery = (path: Path) => {
    if (!path) return
    if (get(query, path) === '#') return query

    set(query.current, path.replace(/_\[\]/gm, ''), '#')
  }

  useLayoutEffect(() => {
    setIsLoading(data === null && Object.keys(query).length !== 0)
  }, [setIsLoading, data])

  useEffect(() => {
    handler(parseQuery(query.current), setData)
  }, [handler])

  return [
    makeProxy(data, 'query', updateQuery),
    parseQuery(query.current),
    isLoading,
  ] as const
}
