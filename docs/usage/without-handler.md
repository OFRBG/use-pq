---
id: 99
sidebar_position: 99
slug: without-handler
---

# Without Handler

:::caution Unstable feature
This feature is new and not fully tested.
:::

`usePq` does not strictly require a handler, as the data fetching cycle happens as a result of the field capture, but not the other way around. It does, however, require a data source. To avoid a circular dependency, `bindData` can be called whenever fetched data is received.

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
