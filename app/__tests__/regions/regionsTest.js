require('dotenv').config()
const path = require('path')

const ExcelFile = require('../../src/classes/excel')

/* eslint-disable no-undef */
describe('Regions listing test', () => {
  it('should list region names from config file', () => {
    const excelFile = new ExcelFile({
      pathToFile: path.join(__dirname, '..', '..', 'data', 'day1.xlsx')
    })

    const regions = excelFile.listRegions()
    console.table(regions)

    expect(regions).toBeDefined()
    expect(Array.isArray(regions)).toBe(true)
  })
})
