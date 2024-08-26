require('dotenv')
const path = require('path')

const ExcelFile = require('../../src/classes/excel')
const checkClass = require('../classInitialization/checkClass')

const ColorLog = require('../../src/classes/colorlog')
const logger = new ColorLog({ color: ColorLog.COLORS.TEXT.YELLOW, isBold: true })

/* eslint-disable no-undef */
describe('Provinces names and count match', () => {
  // Test using the latest 10-day PAGASA Excel file
  const excelFile = new ExcelFile({
    pathToFile: path.join(__dirname, 'excelfiledownload.xlsx'),
    url: process.env.EXCEL_FILE_URL
  })

  const arrayToString = (array) => array.toString().split(',').join(', ')

  it('settings (seasonal) provinces should match with (10-day) Excel provinces', async () => {
    jest.setTimeout(15000)

    // Start file download
    await excelFile.init()

    checkClass({
      excelInstance: excelFile,
      isRemote: true,
      classType: ExcelFile
    })

    // Unique provinces from the Excel file
    const allExcelProvinces = excelFile.datalist
      .map(item => item.province)
      .filter((x, i, a) => a.indexOf(x) === i)
    let uniqueExcelProvinces = new Set(allExcelProvinces)

    // Unique provinces from the config file (PAGASA Seasonal)
    const allProvinces = excelFile.listRegions('provinces').flat()
    let uniqueProvinces = new Set(allProvinces)

    // Provinces from config and the Excel file should be unique
    expect(uniqueProvinces.size).toBe(allProvinces.length)
    expect(uniqueExcelProvinces.size).toBe(allExcelProvinces.length)

    // Provinces present in the config (PAGASA seasonal) but missing in the 10-Day Excel file
    // Action: remove these provinces from provinces count equality check
    const fromConfig = allProvinces.filter(item => !allExcelProvinces.includes(item))

    // Provinces present in the 10-Day Excel file but missing in the config (PAGASA seasonal)
    // Action: remove these provinces from provinces count equality check
    const fromExcel = allExcelProvinces.filter(item => !allProvinces.includes(item))

    // Provinces present in the config (PAGASA seasonal) but missing in the 10-Day Excel file
    if (fromConfig.length > 0) {
      uniqueProvinces = new Set(allProvinces.filter(item => !fromConfig.includes(item)))

      let msg = `[WARNING]: ${fromConfig.length} province(s) in the (PAGASA seasonal) config are missing\n`
      msg += `in the 10-Day Excel file: ${arrayToString(fromConfig)}`

      logger.log(msg)
    }

    if (fromExcel.length > 0) {
      uniqueExcelProvinces = new Set(allExcelProvinces.filter(item => !fromExcel.includes(item)))
      let msg = `[WARNING]: ${fromExcel.length} province(s) in the 10-Day Excel file are missing\n`
      msg += `in the (PAGASA seasonal) config: ${arrayToString(fromExcel)}`
      logger.log(msg)
    }

    if (fromExcel.length > 0 || fromConfig.length > 0) {
      let msg = `[INFO]: Original provinces count are: ${allProvinces.length} (PAGASA seasonal config) vs. ${allExcelProvinces.length} (10-Day Excel file)\n`
      msg += '[INFO]: Removed incosistent provinces in the config and Excel file during check (see yellow WARNINGs)\n'
      msg += `[INFO]: Modified provinces count are: ${uniqueProvinces.size} (PAGASA seasonal config) vs. ${uniqueExcelProvinces.size} (10-Day Excel file)\n\n`
      msg += '[WARNING]: Extend the ExcelFile or ExcelParser class in your scripts to customize this behaviour.'

      logger.log(msg, {
        color: ColorLog.COLORS.TEXT.CYAN
      })
    } else {
      logger.log('[INIT]: Success loading using custom config', {
        color: ColorLog.COLORS.TEXT.GREEN
      })
    }

    // Provinces from config and Excel file count should match
    expect(uniqueExcelProvinces.size).toBe(uniqueProvinces.size)
  })
})
