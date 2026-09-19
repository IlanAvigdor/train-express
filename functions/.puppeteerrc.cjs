const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer so it is included in the deployment package and Cloud Build cache
  cacheDirectory: join(__dirname, 'node_modules', '.cache', 'puppeteer'),
};
