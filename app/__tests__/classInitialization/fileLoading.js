require('dotenv')
const path = require('path')

const ExcelFile = require('../../src/classes/excel')
const ExcelFactory = require('../../src/classes/excelfactory')

const config = require('./config.json')

/* eslint-disable no-undef */
const test = (excelFile, excelFactory, isRemote = false) => {
  expect(excelFactory).toBeDefined()
  expect(excelFactory instanceof ExcelFactory).toBe(true)
  expect(Array.isArray(excelFactory.datalist)).toBe(true)
  expect(excelFactory.datalist.length).toBeGreaterThan(0)

  expect(excelFile).toBeDefined()
  expect(excelFile instanceof ExcelFile).toBe(true)
  expect(Array.isArray(excelFile.datalist)).toBe(true)
  expect(excelFile.datalist.length).toBeGreaterThan(0)

  if (isRemote) {
    expect(typeof excelFactory.url).toBe('string')
    expect(typeof excelFile.url).toBe('string')
  } else {
    expect(excelFactory.url).toBeNull()
    expect(excelFile.url).toBeNull()
  }
}

describe('Class intialization using DEFAULT config', () => {
  jest.setTimeout(30000)

  it('should load local Excel file', () => {
    const excelFile = new ExcelFile({
      pathToFile: path.join(__dirname, '..', '..', 'data', 'day1.xlsx')
    })

    const excelFactory = new ExcelFactory()
    test(excelFile, excelFactory)
  })

  it('should load remote Excel file', async () => {
    const excelFile = new ExcelFile({
      pathToFile: path.join(__dirname, 'excelfiledownload.xlsx'),
      url: process.env.EXCEL_FILE_URL
    })

    const excelFactory = new ExcelFactory({
      url: process.env.EXCEL_FILE_URL
    })

    // Start file download
    await excelFile.init()
    await excelFactory.init()

    test(excelFile, excelFactory, true)
  })
})

describe('Class intialization using CUSTOM config', () => {
  jest.setTimeout(30000)

  it('should load local Excel file', () => {
    const excelFile = new ExcelFile({
      pathToFile: path.join(__dirname, '..', '..', 'data', 'day1.xlsx'),
      settings: config
    })

    const excelFactory = new ExcelFactory({
      settings: config
    })

    test(excelFile, excelFactory)
  })

  it('should load remote Excel file', async () => {
    const excelFile = new ExcelFile({
      pathToFile: path.join(__dirname, 'excelfiledownload.xlsx'),
      url: process.env.EXCEL_FILE_URL,
      settings: config
    })

    const excelFactory = new ExcelFactory({
      url: process.env.EXCEL_FILE_URL,
      settings: config
    })

    // Start file download
    await excelFile.init()
    await excelFactory.init()

    test(excelFile, excelFactory, true)
  })
})
