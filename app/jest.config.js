module.exports = {
  verbose: true,
  testTimeout: 20000,
  moduleFileExtensions: ['js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '__tests__/classInitialization/checkClass.js',
    '__tests__/municipalities/createMunicipalityInstance.js',
    '__tests__/municipalities/municipalitiesCount.js',
    '__tests__/municipalities/municipalitiesPerProvinceCount.js',
    '__tests__/municipalities/index.js',
    '__tests__/provinces/createInstances.js',
    '__tests__/provinces/updateInstances.js',
    '__tests__/provinces/testProvinceCount.js',
    '__tests__/provinces/index.js'
  ]
}
