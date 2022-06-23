---
sidebar_position: 2
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

# Installation

:::note
React 17+ is a [peer dependency](https://flaviocopes.com/npm-peer-dependencies/). There is no need to install anything if React is already present. If React is _not_ present in the project, `use-pq` won't be able to run.
:::

<Tabs>
<TabItem value="npm" label="NPM">

```sh
npm install use-pq
```

</TabItem>
<TabItem value="yarn" label="Yarn">

```sh
yarn add use-pq
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```sh
pnpm add use-pq
```

</TabItem>
</Tabs>

### Dependencies

`use-pq` itself only has [`lodash.set`](https://www.npmjs.com/package/lodash.set) as a dependency, which the perfect balance between stability and size for deep-setting properties.

### Bundle Size

`use-pq` only brings itself. Counting React as a peer dependency would make the package significantly larger, but by itself, it loads [8kB](https://bundlephobia.com/package/use-pq), which is roughly equivalent to 8 000 characters. One of the reasons to try to keep the package as small as possible is so that incremental adoption does not feel like a binary option. `use-pq` can be used for pages where the query may be updated relatively often, while stable views can use [GraphQL Code Generator](https://www.graphql-code-generator.com/) against a static query.
