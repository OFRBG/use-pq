---
id: 4
sidebar_position: 4
slug: query-variables
---

# Query Variables

The `with` prop can be used on the root to build an argument list of GraphQL variables that can be provided by the client.

```tsx
export function User({ limit, id }) {
  const [p, q, { isLoading }] = usePq((query) => handler(query, variables: { id }))

  const pForId = p.with({ $id: 'ID!' })

  return (
    <div>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        <span>{pForId.user.$({ $id }))}</span>
      )}
    </div>
  )
}
```
