---
id: 3
sidebar_position: 3
slug: list-field-with-arguments
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

# Field Lists with Arguments

Combining the argument and list notation will return an array.

<Tabs>
<TabItem value="bracket" label="Bracket Keys">

```tsx
export function UsersLimit({ limit }) {
  const [p, q, { isLoading }] = usePq(handler)

  const users = p[`users(limit: ${limit})_`].map(
    ({ id, name }) => `${id}: ${name}`
  )

  return (
    <div>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        users.map((entry) => <span>{entry}</span>)
      )}
    </div>
  )
}
```

</TabItem>
<TabItem value="params" label="Params Function">

```tsx
export function UsersLimit({ limit }) {
  const [p, q, { isLoading }] = usePq(handler)

  const users = p.users.$_({ limit }).map(({ id, name }) => `${id}: ${name}`)

  return (
    <div>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        users.map((entry) => <span>{entry}</span>)
      )}
    </div>
  )
}
```

</TabItem>
</Tabs>

### Committing captured changes in children

`usePq` relies on rerendering cycles to capture and commit fields that were accessed. If `usePq` is call in a parent component and passed down as a prop to a child, rerendering the child and not the parent will not trigger the commit. Invoking `commitQuery` does this job.

```tsx
function App() {
  const [{ user }, q, { commitQuery, isLoading }] = usePq(handler)

  return <User user={user} commitQuery={commitQuery} />
}

export function User({ user, commitQuery }) {
  const [id, setId] = useState(1)

  // When id changes, the query will be updated after
  // rendering.
  useEffect(commitQuery, [id])

  return (
    <div>
      {isLoading ? <span>loading...</span> : <span>{user.$({ id }).name}</span>}
      <button onClick={() => setId(i + 1)}>next</button>
    </div>
  )
}
```
