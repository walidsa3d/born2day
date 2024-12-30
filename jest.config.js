export default {
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'node'],
    moduleDirectories: ['node_modules'],
    transformIgnorePatterns: ['/node_modules/'],
  };