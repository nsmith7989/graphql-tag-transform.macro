
declare module "graphql-tag-transform.macro" {   

  export type GqlQueryDocument = {
    operationString: string;
    operationName: string;
    originalOpName: string;
  } 

  export function gql(
    literals: any,
    ...placeholders: any[]
  ): GqlQueryDocument

  export default gql
}
