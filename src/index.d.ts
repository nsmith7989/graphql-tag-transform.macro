declare module "graphql-tag-transform.macro" {
  export default function gql(
    literals: any,
    ...placeholders: any[]
  ): {
    operationString: string;
    operationName: string;
    originalOpName: string;
  };
}
