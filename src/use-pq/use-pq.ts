import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import set from 'lodash.set'
import { join } from './proxy'
import { VirtualProperty, VirtualPropertyInterface } from './virtual-property'

const parseQuery = (q: object) => {
  const json = JSON.stringify(q, null, 2)

  return json
    .replace(/[":,](?![^(]*\))/gm, '')
    .replace(/[#_\\]/gm, '')
    .replace(/\{\}/gm, '')
    .replace(/^\s\s/gm, '')
    .slice(2, -2)
}

const getRootField = ({ query = {} }) => Reflect.ownKeys(query)[0]

const updateQuery =
  (query: MutableRefObject<{ query?: any }>) => (target: VirtualProperty) => {
    if (!target.path) return

    const incomingRootField = getRootField(set({}, target.path, '?'))
    const currentRootField = getRootField(query.current)

    if (incomingRootField !== currentRootField) {
      query.current = {}
    }

    set(query.current, target.path, '#')
  }

export function usePq<T = unknown>(handler: (query: string) => Promise<T>) {
  const queryRef = useRef({})
  const [query, setQuery] = useState('')
  const [proxy, setProxy] = useState<VirtualPropertyInterface>(
    join(null, 'query', updateQuery(queryRef))
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
    handler(query).then(setData)
  }, [handler, query])

  useEffect(() => {
    setProxy(join(data, 'query', updateQuery(queryRef)))
  }, [data, query])

  return [proxy, query, isLoading] as const
}
