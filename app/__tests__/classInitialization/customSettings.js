require('dotenv').config()
const path = require('path')

const ExcelFile = require('../../src/classes/excel')
const ExcelFactory = require('../../src/classes/excelfactory')
const ColorLog = require('../../src/classes/colorlog')
const logger = new ColorLog({ isBold: true })

const checkClass = require('./checkClass')
const config = require('./config.json')

// Classes loading the default local 10-day Excel file using a custom regions config
const LOCAL_SOURCE = {
  excelFactory: new ExcelFactory({ settings: config }),

  excelFile: new ExcelFile({
    pathToFile: path.join(__dirname, '..', '..', 'data', 'day1.xlsx'),
    settings: config
  })
}

// Classes loading the remote 10-day Excel file using a custom regions config
const REMOTE_SOURCE = {
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
      REMOTE_SOURCE.excelFile.init(),
      REMOTE_SOURCE.excelFactory.init()
    ])
  })

  it('should load LOCAL_SOURCE Excel file', () => {
    jest.setTimeout(20000)
    logger.log('[INIT]: Started loading using "CUSTOM" config on LOCAL file')

    checkClass({
      excelInstance: LOCAL_SOURCE.excelFactory,
      classType: ExcelFactory
    })

    checkClass({
      excelInstance: LOCAL_SOURCE.excelFile,
      classType: ExcelFile
    })
  })

  it('should load REMOTE_SOURCE Excel file', async () => {
    jest.setTimeout(20000)
    logger.log('[INIT]: Started loading using "CUSTOM" config on REMOTE file')

    checkClass({
      excelInstance: REMOTE_SOURCE.excelFactory,
      isRemote: true,
      classType: ExcelFactory
    })

    checkClass({
      excelInstance: REMOTE_SOURCE.excelFile,
      isRemote: true,
      classType: ExcelFile
    })
  })
})
