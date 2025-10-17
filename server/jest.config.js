module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./__tests__/setup.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js'],
  verbose: true,
  testTimeout: 10000,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middlewares/**/*.js',
    'helpers/**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**'
  ]
};
