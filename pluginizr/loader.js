const pluginizr = require('./pluginizr');

/**
 * Webpack loader that wraps exported items with appropriate plugins.
 * Functions and React components are handled as before.
 * Non-function exports (classes, arrays, objects, strings, numbers, etc.) are also wrapped with withPluginsFn.
 * @param {string} inputCode - The source code to transform.
 * @returns {string} The transformed code.
 */
function loader(inputCode) {
  if (
    inputCode.search(/^['"]use\s*no-plugins['"]\s*;?\s*$/) !== -1 ||
    this.resourcePath.replace(/\\/g, '/').includes('/node_modules/') ||
    this.resourcePath.replace(/\\/g, '/').includes('/packages/catalyst-pluginizr/') // That would be funny!
  ) {
    return inputCode;
  }

  return pluginizr(inputCode, this.resourcePath);
}

module.exports = loader;
