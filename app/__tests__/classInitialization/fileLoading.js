require('dotenv')
const path = require('path')

const ExcelFile = require('../../src/classes/excel')
const ExcelFactory = require('../../src/classes/excelfactory')

const config = require('./config.json')

describe('Class intialization using DEFAULT config', () => {
  jest.setTimeout(30000)

  it('should load local Excel file', () => {
    // ExcelFile
    const excelFile = new ExcelFile({
      pathToFile: path.join(__dirname, '..', '..', 'data', 'day1.xlsx')
    })

    // ExcelFactory
    const excelFactory = new ExcelFactory()

    expect(excelFactory).toBeDefined()
    expect(excelFactory instanceof ExcelFactory).toBe(true)
    expect(Array.isArray(excelFactory.datalist)).toBe(true)
    expect(excelFactory.datalist.length).toBeGreaterThan(0)

    expect(excelFile).toBeDefined()
    expect(excelFile instanceof ExcelFile).toBe(true)
    expect(Array.isArray(excelFile.datalist)).toBe(true)
    expect(excelFile.datalist.length).toBeGreaterThan(0)
  })

  it('should load remote Excel file', async () => {
    // ExcelFile
    const excelFile = new ExcelFile({
      pathToFile: path.join(__dirname, 'excelfiledownload.xlsx'),
      url: process.env.EXCEL_FILE_URL
    })

    // ExcelFactory
    const excelFactory = new ExcelFactory({
      url: process.env.EXCEL_FILE_URL
    })

    // Start file download
    await excelFile.init()
    await excelFactory.init()

    expect(excelFactory).toBeDefined()
    expect(excelFactory instanceof ExcelFactory).toBe(true)
    expect(Array.isArray(excelFactory.datalist)).toBe(true)
    expect(excelFactory.datalist.length).toBeGreaterThan(0)

    expect(excelFile).toBeDefined()
    expect(excelFile instanceof ExcelFile).toBe(true)
    expect(Array.isArray(excelFile.datalist)).toBe(true)
    expect(excelFile.datalist.length).toBeGreaterThan(0)
  })
})

describe('Class intialization using CUSTOM config', () => {
  jest.setTimeout(30000)

  it('should load local Excel file', () => {
    // ExcelFile
    const excelFile = new ExcelFile({
      pathToFile: path.join(__dirname, '..', '..', 'data', 'day1.xlsx'),
      settings: config
    })

    // ExcelFactory
    const excelFactory = new ExcelFactory({
      settings: config
    })

    expect(excelFactory).toBeDefined()
    expect(excelFactory instanceof ExcelFactory).toBe(true)
    expect(excelFactory.url).toBeNull()
    expect(Array.isArray(excelFactory.datalist)).toBe(true)
    expect(excelFactory.datalist.length).toBeGreaterThan(0)

    expect(excelFile).toBeDefined()
    expect(excelFile instanceof ExcelFile).toBe(true)
    expect(excelFile.url).toBeNull()
    expect(Array.isArray(excelFile.datalist)).toBe(true)
    expect(excelFile.datalist.length).toBeGreaterThan(0)
  })

  it('should load remote Excel file', async () => {
    // ExcelFile
    const excelFile = new ExcelFile({
      pathToFile: path.join(__dirname, 'excelfiledownload.xlsx'),
      url: process.env.EXCEL_FILE_URL,
      settings: config
    })

    // ExcelFactory
    const excelFactory = new ExcelFactory({
      url: process.env.EXCEL_FILE_URL,
      settings: config
    })

    // Start file download
    await excelFile.init()
    await excelFactory.init()

    expect(excelFactory).toBeDefined()
    expect(excelFactory instanceof ExcelFactory).toBe(true)
    expect(typeof excelFactory.url).toBe('string')
    expect(Array.isArray(excelFactory.datalist)).toBe(true)
    expect(excelFactory.datalist.length).toBeGreaterThan(0)

    expect(excelFile).toBeDefined()
    expect(excelFile instanceof ExcelFile).toBe(true)
    expect(typeof excelFile.url).toBe('string')
    expect(Array.isArray(excelFile.datalist)).toBe(true)
    expect(excelFile.datalist.length).toBeGreaterThan(0)
  })
})
