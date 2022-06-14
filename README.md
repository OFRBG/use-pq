# pqrs

Query GraphQL with your client without writing query string manually. Fetch only what you use. pqrs leverages the native ES6 `Proxy` by intercepting requests to schema fields and building the query as you render components.

```tsx
// UserStatus.tsx

import { usePq } from "./usePq"
import client from "api"

export function UserStatus() {
  const [p] = usePq((query, setResult) =>
    // Use any GraphQL client that can post a string query and set
    // the response.
    client.query(query).then(setResult)
  )

  const user = p.session.user
  
  return (
    <div>
      {user.name.value()}: {user.status.value()}
    </div>
  )
}
```
