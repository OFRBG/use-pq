---
id: 99
sidebar_position: 99
slug: without-handler
---

# Without Handler

:::danger Unpublished feature
This feature is not yet available.
:::

`usePq` does not strictly require a handler, as the data fetching cycle happens as a result of the field capture, but not the other way around. It does, however, require a data source. To avoid a circular dependency, `bindData` can be executed whenever fetched data is received.

```tsx
export function User({ user, commitQuery }) {
  const [p, query, { bindData }] = usePq()
  const [{ fetching, data }] = useQuery({ query })

  useEffect(bindData(data), [data])

  const users = p.users

  return (
    <div>
      {fetching ? (
        <span>loading...</span>
      ) : (
        users.map(({ name }) => <span>{name}</span>)
      )}
    </div>
  )
}
```
