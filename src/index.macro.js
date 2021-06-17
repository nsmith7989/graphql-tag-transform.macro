import { createMacro } from "babel-plugin-macros";

import { getOperationAST, visit, print, parse } from "graphql";

module.exports = createMacro(graphqlTagMacro, {
  configName: "renameOperations",
});

function graphqlTagMacro({ references, babel, config }) {
  references.default.forEach((path) => {
    if (path.parentPath.type === "TaggedTemplateExpression") {
      compile(babel, path.parentPath, config);
    }
  });
}

function changeQueryName(query, newName) {
  visit(query, {
    OperationDefinition: {
      enter(node) {
        node.name.value = newName;
      },
    },
  });
}

function compile(babel, path, config) {
  const t = babel.types;
  function newLine() {
    return t.templateElement({ raw: "", cooked: "" }, true);
  }
  const sources = path.node.quasi.quasis.map((node) => node.value.raw);
  const expressions = path.get("quasi").get("expressions");

  expressions.forEach((expr) => {
    if (!t.isIdentifier(expr) && !t.isMemberExpression(expr)) {
      throw expr.buildCodeFrameError(
        "Only identifiers or member expressions are allowed by this macro as an interpolation in a graphql template literal."
      );
    }
  });

  const gqlSource = sources.join("");
  const gqlAst = parse(gqlSource);
  const opAst = getOperationAST(gqlAst) || {};

  const isOperation = opAst?.kind === "OperationDefinition";

  const originalOperationName = opAst?.name?.value;
  // if this template literal contains a operationName, then do the transform,
  if (isOperation) {
    const newName = config[originalOperationName];
    if (newName) {
      changeQueryName(gqlAst, newName);
    }
    // number of new lines is always equal to the number of expressions
    const newLines = Array.from({ length: expressions.length }).map(() =>
      newLine()
    );

    const printedAst = print(gqlAst);
    const updatedTemplateLiteral = t.templateLiteral(
      [t.templateElement({ raw: printedAst, cooked: printedAst }), ...newLines],
      expressions.map((e) => t.identifier(e.node.name))
    );

    const obj = t.objectExpression([
      t.objectProperty(
        t.stringLiteral("operationString"),
        updatedTemplateLiteral
      ),
      t.objectProperty(
        t.stringLiteral("operationName"),
        t.stringLiteral(newName || originalOperationName)
      ),
      t.objectProperty(
        t.stringLiteral("originalOpName"),
        t.stringLiteral(originalOperationName)
      ),
    ]);
    path.replaceWith(obj);
  } else {
    // otherwise just strip gql tag
    path.replaceWith(
      t.templateLiteral(
        sources.map((raw) => t.templateElement({ raw, cooked: raw })),
        expressions.map((e) => t.identifier(e.node.name))
      )
    );
  }
}
