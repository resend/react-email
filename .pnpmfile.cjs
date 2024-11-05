const fs = require("fs");
const path = require("path");

const packages = fs.readdirSync(path.resolve(__dirname, "./packages"));
const components = packages
  .filter(
    (dirname) =>
      ![
        "react-email",
        "eslint-config-custom",
        "tsconfig",
        "create-email",
      ].includes(dirname),
  )
  .map((dirname) => `@react-email/${dirname}`);

function readPackage(pkg) {
  if (components.includes(pkg.name)) {
    if ("react" in pkg.peerDependencies) {
      pkg.peerDependencies.react = "19.0.0-rc-02c0e824-20241028";
    }
    if ("react-dom" in pkg.peerDependencies) {
      pkg.peerDependencies["react-dom"] = "19.0.0-rc-02c0e824-20241028";
    }
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
