module.exports = {
  verbose: true,
  testTimeout: 15000,
  moduleFileExtensions: ['js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '__tests__/classInitialization/checkClass.js',
    '__tests__/provinces/createInstances.js',
    '__tests__/provinces/updateInstances.js',
    '__tests__/provinces/index.js'
  ]
}
