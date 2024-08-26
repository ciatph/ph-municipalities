/* eslint-disable no-undef */

/**
 * Checks valid `ExcelFile` or `ExcelFactory` class instances.
 * @typedef {Object} params - Input parameters
 * @param {Function} excelInstance - `ExcelFile` or `ExcelFactory` class instance
 * @param {Bool} isRemote - Flag if the Excel data source is from a remote download. Defaults to `false`.
 * @param {Function} classType - `ExcelFile` or `ExcelFactory` class
 */
const checkClass = ({ excelInstance, isRemote = false, classType = null }) => {
  expect(excelInstance).toBeDefined()
  expect(excelInstance instanceof classType).toBe(true)
  expect(Array.isArray(excelInstance.datalist)).toBe(true)
  expect(excelInstance.datalist.length).toBeGreaterThan(0)

  const regions = excelInstance.listRegions()
  expect(Array.isArray(regions)).toBe(true)
  expect(regions.every(item => typeof item === 'string')).toBe(true)

  if (isRemote) {
    expect(typeof excelInstance.url).toBe('string')
    expect(typeof excelInstance.url).toBe('string')
  } else {
    expect(excelInstance.url).toBeNull()
    expect(excelInstance.url).toBeNull()
  }
}

module.exports = checkClass
