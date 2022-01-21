declare module "graphql-tag-transform.macro" {
  export interface GqlQueryDocument {
    operationString: string;
    operationName: string;
    originalOpName: string;
  }

  export default function gql(
    literals: any,
    ...placeholders: any[]
  ): {
    operationString: string;
    operationName: string;
    originalOpName: string;
  };
}
