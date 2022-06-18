# use-pq

Query GraphQL with your client without writing query string manually. Fetch only what you use. pqrs leverages the native ES6 `Proxy` by intercepting requests to schema fields and building the query as you render components.

```tsx
import { usePq } from "use-pq"
import client from "api"

export function UserStatus() {
  const [p, q, isLoading] = usePq((query, setResult) =>
    // Use any GraphQL client that can post a string query
    // and set the response.
    client.query(query).then(setResult)
  )

  // Access and build any reference from p
  const user = p.session.user

  const displayName = `${user.title.get()} ${user.name.get()}`

  return (
    <div>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        <span>
          {displayName}: {user.status.get()}
        </span>
      )}
    </div>
  )
}
```

---

## Arguments

### handler
`usePq` takes a single argument, which is a function with two arguments: the query and a data setter.
> The data setter **must** be called asynchronously.
---

## Return values

### p
A Proxy that captures the values that are needed during the first render phase.

### q
The query that was built from the render phase from accessing `.get()` properties.

### isLoading
The state of the field capture phase. This is `true` while a query does not exist and the client has not set any data.

---

## Lists of fields
Lists of fields cannot be access by themselves. It is possible to declare a field as a field list by appending an `_` to its key.

```tsx
export function Users() {
  const [p, q, isLoading] = usePq(handler)

  // users is a plain array
  const users = p.users_

  // On the first render, pq will capture the values
  // used by the component by with list having a
  // single proxy entry i.e. list = [proxy]
  return (
    <div>
      {isLoading ? (
        // This will be the first node to be painted
        // to the browser, since pq will trigger a rerender
        // with isLoading = true after capturing
        <span>loading...</span>
      ) : (
        users.map(({ name }) => <span>{user.get()}</span>)
      )}
    </div>
  )
}
```

## Fields with arguments
Fields with arguments can be declared by accessing a key in bracket notation.

```tsx
export function User({ id }) {
  const [p, q, isLoading] = usePq(handler)

  // Proxies can destructure properties
  const { id, name } = p[`user(id: ${id})`]

  return (
    <div>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        <span>{id.get()}: {name.get()}</span>
      )}
    </div>
  )
}
```

## Field lists with arguments
Combining the argument and list notation will return an array.

```tsx
export function UsersLimit({ limit }) {
  const [p, q, isLoading] = usePq(handler)

  const users = p[`users(limit: ${limit})_`].map(({id, name}) => (
    `${id.get()}: ${name.get()}`
  ))

  return (
    <div>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        users.map(entry => <span>{entry}</span>)
      )}
    </div>
  )
}
```
