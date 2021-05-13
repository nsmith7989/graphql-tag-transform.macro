import gql from "../../index.macro";

const frag = gql`
  fragment ChiFrag on Chi {
    var
    char
  }
`;
const frag2 = gql`
  fragment FooFrag on Foo {
    quz
    chi {
      ...ChiFrag
    }
  }
  ${frag}
`;
const frag3 = gql`
  fragment BazFrag on Foo {
    boom
  }
`;
export const query = gql`
  query Foo {
    foo {
      bar
      baz
      ...FooFrag
      ...BazFrag
    }
  }
  ${frag2}
  ${frag3}
`;
export const mutation = gql`
  mutation updateFoo {
    ...FooFrag
  }
  ${frag2}
`;
