module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: ['node_modules/(?!@angular|rxjs|zone.js)'],
  moduleNameMapper: {
    '\\.(scss|css|html)$': 'identity-obj-proxy',
  }
};
