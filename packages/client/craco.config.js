const { getLoader, loaderByName } = require("@craco/craco");

const packages = [];
packages.push("/Users/amir/projects/rolelo/fe-monorepo/packages/common");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      )
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include]

        match.loader.include = include.concat(packages);

        return webpackConfig;
      }
    }
  }
};