---
id: 6
sidebar_position: 6
slug: commit-query
---

# Commit Query

`usePq` relies on rerendering cycles to capture and commit fields that were accessed. If `usePq` is call in a parent component and passed down as a prop to a child, rerendering the child and not the parent will not trigger the commit. Invoking `commitQuery` forces a commit.

```tsx
function App() {
  const [{ user }, _, { commitQuery }] = usePq(handler)

  return <User user={user} commitQuery={commitQuery} />
}

export function User({ user, commitQuery }) {
  const [id, setId] = useState(1)

  useEffect(commitQuery, [id])

  return (
    <div>
      {isLoading ? <span>loading...</span> : <span>{user.$({ id }).name}</span>}
      <button onClick={() => setId(i + 1)}>next</button>
    </div>
  )
}
```
