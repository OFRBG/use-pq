---
sidebar_position: -99
sidebar_label: 'Overview'
slug: /
---

# use-pq

## About the Project

:::caution
`use-pq` is an experimental package that is likely to have undiscovered bugs. Proceed with sensibility.
:::

`use-pq` aims to make GraphQL consumption truly only-what-you-need. GraphQL is a great tool for data fetching without bombarding an API with chained requests or building a local replica. The one thing that annoys me about GraphQL is writing query files. These need to be tweaked, formatted, and in some cases compiled and shipped as utilities.

Building a query per page seems to me like patching RESTful thinking into GraphQL. The idea behind `usePq` is to do with query declarations and instead use observables to build the _exact_ query that you need, just as GraphQL was meant to be used.
