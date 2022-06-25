---
sidebar_position: 5
---

# Usage

In a component, call `usePq` and provide a query handler. You can then request fields to fetch by accessing keys from `p`.

```tsx
import { usePq } from 'use-pq'
import createClient from 'urql

const client = createClient({
  url: "https://trygql.formidable.dev/graphql/basic-pokedex"
})

export const fetcher = (query: string) => {
  if (!query) return

  return client
    .query(query)
    .toPromise()
    .then(({ data }) => resolve(data))
}

export function UserStatus() {
  const [p, q, { isLoading }] = usePq(fetcher)

  const { title, name, status } = p.session.user
  const displayName = `${title}. ${name}`

  return (
    <div>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        <span>
          {displayName}: {status}
        </span>
      )}
    </div>
  )
}
```
