import path from "path";
import pluginTester from "babel-plugin-tester";
import plugin from "babel-plugin-macros";

pluginTester({
  plugin,
  snapshot: false,
  pluginOptions: {
    renameOperations: { Foo: "changedName", updateFoo: "cancelFoo" },
  },
  babelOptions: {
    filename: __filename,
  },
  fixtures: path.join(__dirname, "__fixtures__"),
});
