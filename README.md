# graphql-tag-transform.macro

Babel Macro for elimating graphql-tag and transforming query/mutation operations

# What it does

It removes graphql-tag and transforms (and optionally renames operations) into a specific structure

Converts this:

```js
const query = gql`
  query Hello {
    hello {
      world
    }
  }
`;
```

To this:

```js
const query = {
  operationString: `
  query Hello {
    hello {
      world
    }
  }
`,
  operationName: "Hello",
  originalOpName: "Hello",
};
```

It also supports adding interpolated fragments:

```js
const frag = gql`
  fragment Frag on Hello {
    world
  }
`;

const query = gql`
  query Hello {
    hello {
      universe
      ...Frag
    }
  }

  ${frag}
`;
```

It also supports renaming query operations via config.

[Use one of the available configuration formats](https://github.com/kentcdodds/babel-plugin-macros/blob/main/other/docs/author.md#config)

```js
// .babel-plugin-macros.config.js
module.exports = {
  renameOperations: {
    Hello: "ModifiedHello",
  },
};
```

In:

```js
const frag = gql`
  fragment Frag on Hello {
    world
  }
`;

const query = gql`
  query Hello {
    hello {
      universe
      ...Frag
    }
  }

  ${frag}
`;
```

Out:

```js
const query = {
  operationString: `
  query ModifiedHello {
    hello {
      world
    }
  }
  ${frag}
`,
  operationName: "ModifiedHello",
  originalOpName: "Hello",
};
```

# Why

To avoid the runtime overhead of parsing a string into a GraphQL AST and to transform into specific structure.
This is meant to be used with a "dumb" network layer like [react-query](https://github.com/tannerlinsley/react-query) that does not care about graphql ast structure.

# Installation and setup

[Install](https://github.com/kentcdodds/babel-macros#installation) and [configure](https://github.com/kentcdodds/babel-macros/blob/master/other/docs/user.md) babel-macros if you haven't already.

Then install this package:

```
# with yarn
yarn add -D graphql-tag-transform.macro

# with npm
npm install -D graphql-tag-transform.macro
```

# Usage

The usage is the same as using [graphql-tag](https://github.com/apollographql/graphql-tag) directly, the only difference is that you have to import `gql` from the macro now:

```js
import gql from "graphql-tag-transform.macro";

const query = gql`
  query {
    hello {
      world
    }
  }
`;
```
