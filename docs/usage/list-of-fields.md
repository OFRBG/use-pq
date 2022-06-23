---
id: 1
sidebar_position: 1
slug: list-of-fields
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

# Field Lists

Lists of fields cannot be access by themselves. It is possible to declare a field as a field list by appending an `_` to its key.

<Tabs>
<TabItem value="iterators" label="Iterators">

```tsx
export function Users() {
  const [p, q, { isLoading }] = usePq(handler)

  const users = p.users_

  return (
    <div>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        users.map(({ name }) => <span>{name}</span>)
      )}
    </div>
  )
}
```

</TabItem>
<TabItem value="index" label="Index Access">

```tsx
export function Users() {
  const [p, q, { isLoading }] = usePq(handler)

  const users = p.users_

  return <div>{isLoading ? <span>loading...</span> : users[3]?.name}</div>
}
```

</TabItem>
</Tabs>

:::note How it works

On the first render, `p` will capture the values used by the component by returning a single proxy entry of `[VirtualProperty]`. During the render, _most_ common operations such as `map` and `filter` will catch the fields accessed in the nested property. It is very likely that there are ways to break out of the working path by accidentally skipping pieces of code where a property that is not rendered is not captured.

:::
