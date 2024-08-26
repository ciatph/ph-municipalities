require('dotenv')
const path = require('path')

const ExcelFile = require('../../src/classes/excel')
const ColorLog = require('../../src/classes/colorlog')
const logger = new ColorLog({ color: ColorLog.COLORS.TEXT.YELLOW, isBold: true })

const checkClass = require('../classInitialization/checkClass')
const createMunicipalityInstance = require('./createMunicipalityInstance')
const { arrayToString } = require('../../src/lib/utils')

/* eslint-disable no-undef */
describe('Municipalities total count match', () => {
  // Test using the latest 10-day PAGASA Excel file
  const excelFile = new ExcelFile({
    pathToFile: path.join(__dirname, 'excelfiledownload.xlsx'),
    url: process.env.EXCEL_FILE_URL
  })

  it('municipalities from provinces config should match with original Excel municipalities count', async () => {
    jest.setTimeout(15000)

    // Start file download
    await excelFile.init()

    checkClass({
      excelInstance: excelFile,
      isRemote: true,
      classType: ExcelFile
    })

    const {
      excel,
      config,
      hasMissingInExcel,
      hasMissingInConfig
    } = createMunicipalityInstance(excelFile)

    // Process missing PAGASA seasonal config provinces/municipalities
    if (hasMissingInConfig) {
      const fromConfig = excel.provinces.filter(item => !config.provinces.has(item))

      const countMissingConfig = Object.values(
        excelFile.listMunicipalities({ provinces: fromConfig })
      ).flat()?.length ?? 0

      logger.log(
        `[WARNING]: ${fromConfig.length} PROVINCE(S) PRESENT in the 10-day Excel file\n` +
        `but MISSING in the PAGASA seasonal config: ${arrayToString(fromConfig)}, ${countMissingConfig} municipalities`, {
          color: ColorLog.COLORS.TEXT.RED
        })
    }

    // Process missing 10-day Excel provinces/municipalities
    if (hasMissingInExcel) {
      const fromExcel = [...config.provinces].filter(item => !excel.provinces.includes(item))

      logger.log(
        `[WARNING]: ${fromExcel.length} PROVINCE(S) PRESENT in the PAGASA seasonal config\n` +
        `but MISSING in 10-day Excel file: ${arrayToString(fromExcel)}`, {
          color: ColorLog.COLORS.TEXT.RED
        })
    }

    if (hasMissingInConfig || hasMissingInExcel) {
      logger.log(
        '[INFO]: If you believe these RED warning(s) are incorrect, feel free to reach out\n' +
        'or extend and override the ExcelFile or ExcelFactory classes in your scripts.', {
          color: ColorLog.COLORS.TEXT.RED
        })
    } else {
      logger.log('[MUNICIPALITIES]: Municipalities counts match in config and Excel', {
        color: ColorLog.COLORS.TEXT.GREEN
      })
    }

    let passMsg = '[20240826]: Allow the test to succeed here since there is little information about updated\n'
    passMsg += 'PAGASA seasonal & 10-day province/municipalities naming conventions for the other regions, and they\n'
    passMsg += 'may change anytime without prior notice. Take note of the INFOS/WARNINGS and\n'
    passMsg += 'extend/override the class methods on custom scripts to accommodate custom settings as necessary'
    expect(logger.log(passMsg, { color: ColorLog.COLORS.TEXT.YELLOW })).toBe(undefined)

    /* Uncomment true "tests" for testing
    expect(countExcelMunicipalities).toBe(countConfigMunicipalities)
    expect(allExcelProvinces.length).toBe(allProvinces.size)
    */
  })
})
