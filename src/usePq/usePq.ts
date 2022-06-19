import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import set from 'lodash.set'
import { makeProxy } from './makeProxy'
import { VirtualProperty, VirtualPropertyInterface } from './VirtualProperty'

const parseQuery = (q: object) => {
  return JSON.stringify(q, null, 2)
    .replace(/[":,](?![^(]*\))/gm, '')
    .replace(/[#_\\]/gm, '')
    .replace(/\{\}/gm, '')
    .replace(/^\s\s/gm, '')
    .slice(2, -2)
}

const updateQuery =
  (query: MutableRefObject<{ query?: any }>) => (target: VirtualProperty) => {
    if (!target.path) return

    const [, incomingRoot] = target.path.split('.')
    const currentRoot = Reflect.ownKeys(query.current.query || {})[0]

    if (
      Boolean(Reflect.ownKeys(query.current.query || {}).length) &&
      incomingRoot !== currentRoot
    ) {
      query.current = {}
    }

    set(query.current, target.path, '#')
  }

export function usePq<T = unknown>(handler: (query: string) => Promise<T>) {
  const queryRef = useRef({})
  const [query, setQuery] = useState('')
  const [proxy, setProxy] = useState<VirtualPropertyInterface>(
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
