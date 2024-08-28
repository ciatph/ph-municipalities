require('dotenv').config()
const path = require('path')

const ExcelFile = require('../../src/classes/excel')
const ExcelFactory = require('../../src/classes/excelfactory')
const ColorLog = require('../../src/classes/colorlog')
const logger = new ColorLog({ isBold: true })

const checkClass = require('./checkClass')
const config = require('./config.json')

/* eslint-disable no-undef */
describe('Class intialization using DEFAULT config', () => {
  it('should load local Excel file', () => {
    const excelFile = new ExcelFile({
      pathToFile: path.join(__dirname, '..', '..', 'data', 'day1.xlsx')
    })

    const excelFactory = new ExcelFactory()

    checkClass({
      excelInstance: excelFactory,
      classType: ExcelFactory
    })

    checkClass({
      excelInstance: excelFile,
      classType: ExcelFile
    })
  })

  it('should load remote Excel file', async () => {
    jest.setTimeout(15000)
    logger.log('[INIT]: Started loading using "DEFAULT" config')

    const excelFile = new ExcelFile({
      pathToFile: path.join(__dirname, 'excelfiledownload4.xlsx'),
      url: process.env.EXCEL_FILE_URL
    })

    const excelFactory = new ExcelFactory({
      url: process.env.EXCEL_FILE_URL
    })

    // Start file download
    await Promise.all([
      excelFile.init(),
      excelFactory.init()
    ])

    checkClass({
      excelInstance: excelFactory,
      isRemote: true,
      classType: ExcelFactory
    })

    checkClass({
      excelInstance: excelFile,
      isRemote: true,
      classType: ExcelFile
    })
  })
})

describe('Class intialization using CUSTOM config', () => {
  it('should load local Excel file', () => {
    const excelFile = new ExcelFile({
      pathToFile: path.join(__dirname, '..', '..', 'data', 'day1.xlsx'),
      settings: config
    })

    const excelFactory = new ExcelFactory({
      settings: config
    })

    checkClass({
      excelInstance: excelFactory,
      classType: ExcelFactory
    })

    checkClass({
      excelInstance: excelFile,
      classType: ExcelFile
    })
  })

  it('should load remote Excel file', async () => {
    jest.setTimeout(15000)
    logger.log('[INIT]: Started loading using "CUSTOM" config')

    const excelFile = new ExcelFile({
      pathToFile: path.join(__dirname, 'excelfiledownload5.xlsx'),
      url: process.env.EXCEL_FILE_URL,
      settings: config
    })

    const excelFactory = new ExcelFactory({
      url: process.env.EXCEL_FILE_URL,
      settings: config
    })

    // Start file download
    await Promise.all([
      excelFile.init(),
      excelFactory.init()
    ])

    checkClass({
      excelInstance: excelFactory,
      isRemote: true,
      classType: ExcelFactory
    })

    checkClass({
      excelInstance: excelFile,
      isRemote: true,
      classType: ExcelFile
    })
  })
})
