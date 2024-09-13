require('dotenv').config()
const path = require('path')

const ExcelFile = require('../../src/classes/excel')
const ColorLog = require('../../src/classes/colorlog')
const logger = new ColorLog()

const checkClass = require('../classInitialization/checkClass')
const { arrayToString } = require('../../src/lib/utils')

// Test using the latest 10-day PAGASA Excel file
const excelFile = new ExcelFile({
  pathToFile: path.join(__dirname, 'excelfiledownload2.xlsx'),
  url: process.env.EXCEL_FILE_URL
})

/* eslint-disable no-undef */
describe('Municipalities per province count match', () => {
  beforeAll(async () => {
    // Start file download
    return await excelFile.init()
  })

  it('number of parsed/processed municipalities per province should match per province count from original data', async () => {
    jest.setTimeout(20000)

    // Parsed/processed provinces from the Excel file
    const allProvinces = excelFile.listAllProvinces(true)

    // Provinces from the PAGASA seasonal config file
    const allProvincesConfig = excelFile.listAllProvinces()

    // Parsed/processed municipalities by province
    const allMunicipalities = excelFile.listMunicipalities({
      provinces: allProvinces
    })

    // Total parsed municipalities count
    const countMunicipalities = Object.values(allMunicipalities)
      .reduce(
        (sum, item) => (sum += item.length), 0
      )

    const missing = []
    const matches = []

    // Compare parsed municipalities per province count vs. original (unprocessed) data
    allProvinces.forEach((province) => {
      // Total parsed count
      const countParsed = allMunicipalities[province].length

      // Total count from unprocessed data
      const countRaw = excelFile.data.filter(row =>
        row[excelFile.options.SHEETJS_COL]?.includes(`(${province.trim()})`)
      )

      if (countRaw.length > 0) {
        const countLog = {
          province,
          loaded: countRaw.length,
          parsed: countParsed
        }

        if (countParsed !== countRaw.length) {
          missing.push(countLog)
        } else {
          matches.push(countLog)
        }
      }
    })

    let totalLoaded = 0
    let totalParsed = 0

    const message = matches.reduce((list, item) => {
      totalLoaded += item.loaded
      totalParsed += item.parsed
      list += `${item.province}: loaded=${item.loaded}, parsed=${item.parsed}\n`
      return list
    }, [])

    const total = `Total loaded: ${totalLoaded}\nTotal parsed: ${totalParsed}/${countMunicipalities}`

    logger.log(message)
    logger.log(total, { color: ColorLog.COLORS.TEXT.CYAN })

    // Log missing/mismatching provinces from 10-day Excel and PAGASA seasonal config file
    if (allProvinces.length !== allProvincesConfig.length) {
      const missingInParsed = allProvincesConfig.filter(item => !allProvinces.includes(item))
      const missingInConfig = allProvinces.filter(item => !allProvincesConfig.includes(item))

      if (missingInParsed.length > 0) {
        let msg = `[WARNING]: ${missingInParsed.length} province(s) missing in the 10-Day Excel file\n`
        msg += `but present in the (PAGASA seasonal) config: ${arrayToString(missingInParsed)}`
        logger.log(msg, { color: ColorLog.COLORS.TEXT.YELLOW })
      }

      if (missingInConfig.length > 0) {
        let msg = `[WARNING]: ${missingInConfig.length} province(s) in the (PAGASA seasonal) config is/are missing\n`
        msg += `but available in the 10-Day Excel file: ${arrayToString(missingInConfig)}`
        logger.log(msg, { color: ColorLog.COLORS.TEXT.YELLOW })
      }
    }

    checkClass({
      excelInstance: excelFile,
      isRemote: true,
      classType: ExcelFile
    })

    expect(missing).toHaveLength(0)
  })
})
