---
sidebar_position: 99
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

# API

### Canonical Naming

```ts
const [p, q, { isLoading, commitQuery, bindData }] = usePq(handler)
```

## `usePq`

```ts
type UsePq<T> = (handler: QueryHandler<T>) => [
  VirtualPropertyInterface,
  string,
  {
    isLoading: boolean
    commitQuery: () => void
    bindData: (data: T) => void
  }
]
```

`usePq` is the named export from `use-pq`. It is a hook wrapping four effects and takes in a query handler.

### Arguments

#### `handler`

**Type**

```ts
type QueryHandler<T> = ((query: string) => Promise<T>) | undefined
```

**Description**

The handler argument is a function that takes in a GraphQL query and returns the queried data.

### Returns

#### `p`

**Type**

```ts
type VirtualPropertyInterface = {
  [key: string]: any
} & {
  path: Path
  value: () => ResolvedValue
  get: () => ResolvedValue
}
```

**Description**

The `p` value captures values that are needed during the the first render of the component. This can be accessed as if it already had the values that are needed to populate a function. The `p` value is a `Proxy` over an internal `VirtualProperty` class, which implements most keys used by React to coalesce an input into a React element.

If properties are not used directly in JSX or `createElement`, the fields need to be explicitly queried with `.get()`. On the other hand, `.value()` will read the internal value of the virtual property at that point without requesting any fields to be queried.

#### `q`

**Type**

```ts
string
```

**Description**
`q` is the query generated after the field capture phase. This is the same string provided to the handler.

#### `control`

**Type**

```ts
type Control = {
  isLoading: boolean
  commitQuery: () => void
  bindData: (data: T) => void
}
```

**Description**

`isLoading` is the state of the field capture phase. This is `true` while the query is defined but the request data is null.

`commitQuery` is an escape hatch used specifically in cases where a state update for a component does not trigger a rerender in the hook where `usePq` was called. If `p` is provided as a prop and the component rerenders, fields captured will _not_ be committed to the query. To make `use-pq` aware of the changes, `commitQuery` needs to be called in an effect e.g. `useEffect(commitQuery)`.

`bindData` is the setter for the internal `usePq` data state. If `handler` is not sourcing the data, bindData can be used to hydrate `p`.
