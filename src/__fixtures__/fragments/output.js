const frag = `
  fragment ChiFrag on Chi {
    var
    char
  }
`;
const frag2 = `
  fragment FooFrag on Foo {
    quz
    chi {
      ...ChiFrag
    }
  }
  ${frag}
`;
const frag3 = `
  fragment BazFrag on Foo {
    boom
  }
`;
export const query = {
  operationString: `
query changedName {
  foo {
    bar
    baz
    ...FooFrag
    ...BazFrag
  }
}
${frag2}
${frag3}
`,
  operationName: "changedName",
  originalOpName: "Foo",
};
export const mutation = {
  operationString: `
mutation cancelFoo {
  ...FooFrag
}
${frag2}
`,
  operationName: "cancelFoo",
  originalOpName: "updateFoo",
};
