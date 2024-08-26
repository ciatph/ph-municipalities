require('dotenv')
const path = require('path')

const ExcelFile = require('../../src/classes/excel')

const checkClass = require('../classInitialization/checkClass')
const createInstances = require('./createInstances')
const updateInstances = require('./updateInstances')

/* eslint-disable no-undef */
describe('Provinces names and count match', () => {
  // Test using the latest 10-day PAGASA Excel file
  const excelFile = new ExcelFile({
    pathToFile: path.join(__dirname, 'excelfiledownload.xlsx'),
    url: process.env.EXCEL_FILE_URL
  })

  it('settings (seasonal) provinces should match with (10-day) Excel provinces', async () => {
    jest.setTimeout(15000)

    // Start file download
    await excelFile.init()

    checkClass({
      excelInstance: excelFile,
      isRemote: true,
      classType: ExcelFile
    })

    const {
      allExcelProvinces,
      allProvinces,
      uniqueExcelProvinces: uniqueExcelList,
      uniqueProvinces: uniqueProvinceList,
      fromConfig,
      fromExcel
    } = createInstances(excelFile)

    // Provinces from config and the Excel files should be unique
    expect(uniqueProvinceList.size).toBe(allProvinces.length)
    expect(uniqueExcelList.size).toBe(allExcelProvinces.length)

    const { uniqueExcelProvinces, uniqueProvinces } = updateInstances({
      allExcelProvinces,
      allProvinces,
      uniqueExcelProvinces: uniqueExcelList,
      uniqueProvinces: uniqueProvinceList,
      fromConfig,
      fromExcel
    })

    // Provinces from config and Excel file count should match
    // 20240826: Synced counts to pass tests, but take note of warning logs for
    // custom overrides and extensions for future PAGASA seasonal config / 10-day Excel file updates
    expect(uniqueExcelProvinces.size).toBe(uniqueProvinces.size)
  })
})
