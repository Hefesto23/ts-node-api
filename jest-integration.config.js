
const jestConfig = require('./jest.config');

module.exports = {
  ...jestConfig,
  testTimeout: 99999,
  testRegex: '.*\\.itg\\.spec\\.ts$',
};
