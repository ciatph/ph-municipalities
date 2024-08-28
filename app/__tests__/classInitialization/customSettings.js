require('dotenv').config()
const path = require('path')

const ExcelFile = require('../../src/classes/excel')
const ExcelFactory = require('../../src/classes/excelfactory')
const ColorLog = require('../../src/classes/colorlog')
const logger = new ColorLog({ isBold: true })

const checkClass = require('./checkClass')
const config = require('./config.json')

// Classes loading the default local 10-day Excel file
const local = {
  excelFactory: new ExcelFactory({ settings: config }),

  excelFile: new ExcelFile({
    pathToFile: path.join(__dirname, '..', '..', 'data', 'day1.xlsx'),
    settings: config
  })
}

// Classes loading the remote 10-day Excel file
const remote = {
  excelFile: new ExcelFile({
    pathToFile: path.join(__dirname, 'excelfiledownload4.xlsx'),
    url: process.env.EXCEL_FILE_URL,
    settings: config
  }),

  excelFactory: new ExcelFactory({
    url: process.env.EXCEL_FILE_URL,
    settings: config
  })
}

/* eslint-disable no-undef */
describe('Class intialization using CUSTOM config', () => {
  beforeAll(async () => {
    return await Promise.all([
      remote.excelFile.init(),
      remote.excelFactory.init()
    ])
  })

  it('should load local Excel file', () => {
    jest.setTimeout(20000)
    logger.log('[INIT]: Started loading using "CUSTOM" config on LOCAL file')

    checkClass({
      excelInstance: local.excelFactory,
      classType: ExcelFactory
    })

    checkClass({
      excelInstance: local.excelFile,
      classType: ExcelFile
    })
  })

  it('should load remote Excel file', async () => {
    jest.setTimeout(20000)
    logger.log('[INIT]: Started loading using "CUSTOM" config on REMOTE file')

    checkClass({
      excelInstance: remote.excelFactory,
      isRemote: true,
      classType: ExcelFactory
    })

    checkClass({
      excelInstance: remote.excelFile,
      isRemote: true,
      classType: ExcelFile
    })
  })
})
