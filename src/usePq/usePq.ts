import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import set from 'lodash.set'
import { makeProxy } from './makeProxy'
import { Path } from './VirtualProperty'

const parseQuery = (q: object) => {
  return JSON.stringify(q, null, 2)
    .replace(/[":,](?![^(]*\))|[#_\\]|\{\}/gm, '')
    .slice(1, -1)
}

const updateQuery =
  (query: MutableRefObject<{ query?: any }>) => (path: Path) => {
    if (!path) return

    const [, incomingRoot] = path.split('.')
    const currentRoot = Reflect.ownKeys(query.current.query || {})[0]

    if (
      Boolean(Reflect.ownKeys(query.current.query || {}).length) &&
      incomingRoot !== currentRoot
    ) {
      query.current = {}
    }

    set(query.current, path.replace(/_\[\]/gm, ''), '#')
  }

export function usePq(handler: (query: string) => Promise<void>) {
  const queryRef = useRef({})
  const [query, setQuery] = useState('')
  const [proxy, setProxy] = useState(
    makeProxy(null, 'query', updateQuery(queryRef))
  )
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useLayoutEffect(() => {
    setIsLoading(data === null && Object.keys(queryRef.current).length > 0)
  })

  useEffect(() => {
    setQuery(parseQuery(queryRef.current))
  })

  useEffect(() => {
    setData(null)
  }, [query])

  useEffect(() => {
    query && handler(query).then(setData)
  }, [handler, query])

  useEffect(() => {
    setProxy(makeProxy(data, 'query', updateQuery(queryRef)))
  }, [data, query])

  return [proxy, query, isLoading] as const
}
