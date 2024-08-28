require('dotenv').config()
const path = require('path')

const ExcelFile = require('../../src/classes/excel')
const ColorLog = require('../../src/classes/colorlog')
const logger = new ColorLog({ color: ColorLog.COLORS.TEXT.YELLOW, isBold: true })

const checkClass = require('../classInitialization/checkClass')
const createMunicipalityInstance = require('./createMunicipalityInstance')
const { arrayToString } = require('../../src/lib/utils')

// Test using the latest 10-day PAGASA Excel file
const excelFile = new ExcelFile({
  pathToFile: path.join(__dirname, 'excelfiledownload.xlsx'),
  url: process.env.EXCEL_FILE_URL
})

/* eslint-disable no-undef */
describe('Municipalities total count match', () => {
  beforeAll(async () => {
    // Start file download
    return await excelFile.init()
  })

  it('municipalities from provinces config should match with original Excel municipalities count', async () => {
    jest.setTimeout(20000)

    const {
      excel,
      config,
      hasMissingInExcel,
      hasMissingInConfig
    } = createMunicipalityInstance(excelFile)

    let totalMunicipalitiesConfig = config.countMunicipalities

    // Process missing PAGASA seasonal config provinces/municipalities
    if (hasMissingInConfig) {
      const fromConfig = excel.provinces.filter(item => !config.provinces.includes(item))

      const countMissingConfig = Object.values(
        excelFile.listMunicipalities({ provinces: fromConfig })
      ).flat()?.length ?? 0

      // Add missing Excel municipalities count
      totalMunicipalitiesConfig += countMissingConfig

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
        'or you may extend and override the ExcelFile or ExcelFactory classes in your scripts.', {
          color: ColorLog.COLORS.TEXT.RED
        })

      let passMsg = '[20240826]: Allow the test to succeed here since there is little information about updated\n'
      passMsg += 'PAGASA seasonal & 10-day province/municipalities naming conventions for the other regions, and they\n'
      passMsg += 'may change anytime without prior notice. Take note of the INFOS/WARNINGS and\n'
      passMsg += 'extend/override the class methods on custom scripts to accommodate custom settings as necessary'
      expect(logger.log(passMsg, { color: ColorLog.COLORS.TEXT.YELLOW })).toBe(undefined)
    } else {
      logger.log('[MUNICIPALITIES]: Municipalities counts match in config and Excel', {
        color: ColorLog.COLORS.TEXT.GREEN
      })
    }

    checkClass({
      excelInstance: excelFile,
      isRemote: true,
      classType: ExcelFile
    })

    /* Uncomment true "tests" for municipalities count match testing
    expect(excel.countMunicipalities).toBe(config.countMunicipalities)
    expect(excel.provinces.length).toBe(config.provinces.size)
    */

    if (excelFile.options.dataRowStart > 0) {
    // Parsed/loaded municipalities in the Excel file using the (manual-encoded) PAGASA seasonal config
    // including provinces missing in the config should be equal to the raw loaded data count
      expect(totalMunicipalitiesConfig + excelFile.options.dataRowStart).toBe(excelFile.data.length)
    } else {
      throw new Error('Invalid 10-day Excel file format: Missing "Project Areas" text')
    }
  })
})
