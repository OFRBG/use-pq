<div id="top"></div>

[![npm](https://img.shields.io/npm/v/use-pq?style=flat-square)](https://www.npmjs.com/package/use-pq)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/use-pq?style=flat-square)](https://bundlephobia.com/package/use-pq)
[![Codecov](https://img.shields.io/codecov/c/gh/ofrbg/use-pq?style=flat-square&token=WSCHIA80X9)](https://codecov.io/gh/ofrbg/use-pq)
[![GitHub license](https://img.shields.io/github/license/ofrbg/use-pq?style=flat-square)](https://github.com/ofrbg/use-pq/blob/main/LICENSE)

<br />
<div align="center">
  <a href="https://github.com/ofrbg/use-pq">
    <img src="assets/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">use-pq</h3>

  <p align="center">
    Queryless GraphQL
    <br />
    <a href="https://codesandbox.io/s/graphqmon-lipwgx?file=/src/PokemonList.tsx">Demo 1</a>
    -
    <a href="https://codesandbox.io/s/graphime-vkhqji?file=/src/Graphime.tsx">Demo 2</a>
    ·
    <a href="https://github.com/ofrbg/use-pq/issues">Report Bug</a>
    ·
    <a href="https://github.com/ofrbg/use-pq/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#package-details">Package Details</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li>
      <a href="#basic-usage">Usage</a>
      <ul>
        <li><a href="#api">API</a></li>
        <li><a href="#feature-usage">Feature Usage</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<blockquote>
  ⚠️ `use-pq` is an experimental package that is likely to have undiscovered bugs. Proceed with sensibility. ⚠️
</blockquote>

`usePq` aims to make GraphQL consumption truly only-what-you-need. GraphQL is a great tool for data fetching without bombarding an API with chained requests or building a local replica. The one thing that annoys me about GraphQL is writing query files. These need to be tweaked, formatted, and in some cases compiled and shipped as utilities.

Building a query per page seems to me like patching RESTful thinking into GraphQL. The idea behind `usePq` is to do with query declarations and instead use observables to build the _exact_ query that you need, just as GraphQL was meant to be used.

_To view the full documentation, go to [use-pq.com](https://use-pq.com)._

<p align="right">(<a href="#top">back to top</a>)</p>

### Package Details

- [npm](https://www.npmjs.com/package/use-pq)
- [Bundlephobia](https://bundlephobia.com/package/use-pq)

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

`usePq` is not invasive: you can use as little or as much as you want. You only need to provide a fetching function and start querying away.

### Prerequisites

`usePq` has a peer dependency on React 17+.

### Installation

```sh
pnpm add use-pq
```

<p align="right">(<a href="#top">back to top</a>)</p>

## Basic Usage

In a component, call `usePq` and provide a query handler. You can then request fields to fetch by accessing keys from `p`.

```tsx
import { usePq } from 'use-pq'
import client from 'api'

export function UserStatus() {
  const [p, q, { isLoading }] = usePq(async (query) =>
    // Use any GraphQL client that can post a string query
    // and set the response.
    client.query(query).then(({ data }) => data)
  )

  // Access and build any reference from p
  const user = p.session.user

  const displayName = `${user.title} ${user.name}`

  return (
    <div>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        <span>
          {displayName}: {user.status}
        </span>
      )}
    </div>
  )
}
```

## API

```ts
const [p, q, { isLoading, commitQuery }] = usePq(handler)
```

### Arguments

**handler**: `usePq` takes a single argument, which is a function with two arguments: the query and a data setter.

> The data setter **must** be called asynchronously.

### Return value

**p**: A Proxy that captures the values that are needed during the first render phase.

**q**: The query that was built from the render phase from accessing `` properties. If the field was accessed by React during rendering, it will also be registered.

**isLoading**: The state of the field capture phase. This is `true` while a query does not exist and the client has not set any data.

**commitQuery**: A function that can be called to manually trigger a commit of captured changes to the query.

### Feature Usage

### Lists of fields

Lists of fields cannot be access by themselves. It is possible to declare a field as a field list by accessing `.listOf('fieldName')` on the parent.

```tsx
export function Users() {
  const [p, q, { isLoading }] = usePq(handler)

  // users is a plain array
  const users = p.listOf('users')

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
        // React will attempt to render name by checking if
        // if it a valid element. When an object is being verified,
        // React checks if it has Symbol.iterator. When the iterator
        // property is accessed, the field is registered for the query.
        users.map(({ name }) => <span>{name}</span>)
      )}
    </div>
  )
}
```

### Fields with arguments

Fields with arguments can be declared by accessing a key in bracket notation.

```tsx
export function User({ id }) {
  const [p, q, { isLoading }] = usePq(handler)

  // Proxies can destructure properties
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

### Field lists with arguments

Combining the argument and list notation will return an array.

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

### Arguments as a function

It is possible to provide arguments without string interpolation by using a `$` prefix after the field that needs arguments.

```tsx
export function User({ id }) {
  const [p, q, { isLoading }] = usePq(handler)

  // The function name can be anything
  // as long as the first character is $
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

### Fields with arguments as functions

Arguments as function can also be used for list fields.

```tsx
export function Users() {
  const [p, q, { isLoading }] = usePq(handler)

  // The function name can be anything
  // as long as the first character is $
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

<p align="right">(<a href="#top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/title`)
3. Commit your Changes (`git commit -m 'Add feature'`)
4. Push to the Branch (`git push origin feat/title`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

Project Link: [https://github.com/ofrbg/use-pq](https://github.com/ofrbg/use-pq)

<p align="right">(<a href="#top">back to top</a>)</p>
