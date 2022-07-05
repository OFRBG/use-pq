import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import set from 'lodash.set'
import { joinObject } from './proxy'
import { VirtualProperty } from './virtual-property'
import { VirtualObjectInterface } from './virtual-property.types'

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

export type QueryHandler<T> = (query: string) => Promise<T>

export type UsePqReturn<T> = [
  VirtualObjectInterface<T>,
  string,
  { bindData: (data: T) => void; commitQuery: () => void; isLoading: boolean }
]

export function usePq<T = unknown>(handler?: QueryHandler<T>): UsePqReturn<T> {
  const queryRef = useRef({})
  const [query, setQuery] = useState('')
  const [proxy, setProxy] = useState(
    joinObject<T>(null, 'query', updateQuery(queryRef))
  )
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const commitQuery = () => {
    setQuery(parseQuery(queryRef.current))
  }

  useLayoutEffect(() => {
    setIsLoading(data === null && Object.keys(queryRef.current).length > 0)
  })

  useEffect(commitQuery)

  useEffect(() => {
    setData(null)
  }, [query])

  useEffect(() => {
    query && handler?.(query).then(setData)
  }, [handler, query])

  useEffect(() => {
    setProxy(joinObject<T>(data, 'query', updateQuery(queryRef)))
  }, [data, query])

  return [proxy, query, { commitQuery, isLoading, bindData: setData }]
}
