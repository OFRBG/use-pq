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

  const users = p
    .listOf(`users(limit: ${limit})`)
    .map(({ id, name }) => `${id}: ${name}`)

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

  const users = p
    .listOf('users')
    .$({ limit })
    .map(({ id, name }) => `${id}: ${name}`)

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
