---
id: 2
sidebar_position: 2
slug: field-with-arguments
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

# Fields with Arguments

Fields with arguments can be declared by accessing a key in bracket notation. It is also possible to provide arguments without string interpolation by using a `$` prefix after the field that needs arguments. If the field is a list, the array `_` prefix needs to be moved from the field name to the `$` key.

<Tabs>
<TabItem value="bracket" label="Bracket Keys">

```tsx
export function User({ id }) {
  const [p, q, { isLoading }] = usePq(handler)

  const { id, name } = p[`user(id: ${id})`]

  return (
    <div>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        <span>
          {id}: {name}
        </span>
      )}
    </div>
  )
}
```

</TabItem>
<TabItem value="params" label="Params Function">

```tsx
export function User({ id }) {
  const [p, q, { isLoading }] = usePq(handler)

  const { id, name } = p.user.$({ id })

  return (
    <div>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        <span>
          {id}: {name}
        </span>
      )}
    </div>
  )
}
```

</TabItem>
</Tabs>
