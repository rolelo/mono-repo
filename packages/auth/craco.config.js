const { getLoader, loaderByName } = require("@craco/craco");
const path = require('path');

const packages = [];
packages.push(path.resolve(__dirname, '../common'));

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