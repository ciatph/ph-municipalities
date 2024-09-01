const fs = require('fs')
const path = require('path')

const ExcelFactory = require('../../src/classes/excelfactory')
const Schema = require('../../src/classes/schema')

const ColorLog = require('../../src/classes/colorlog')
const logger = new ColorLog({ color: ColorLog.COLORS.TEXT.YELLOW })

const checkClass = require('../classInitialization/checkClass')
const outputSchema = require('../../src/lib/schemas/outputSchema')
const { arrayToString } = require('../../src/lib/utils')

/* eslint-disable no-undef */
describe('Output JSON file format test', () => {
  const jsonFileName = 'municipalities.json'
  const pathToOutputFile = path.join(__dirname, jsonFileName)

  let jsonDataContent

  it('should write municipalities data to a JSON file', () => {
    // ExcelFactory is a shorthand for the ExcelFile class when using only the default settings
    const excelFile = new ExcelFactory()

    const regions = excelFile.listRegions()
    const regionName = regions[0]
    const provinces = excelFile.listProvinces(regionName)

    let msg = `Sample region: ${regionName}\n`
    msg += `Provinces: ${arrayToString(provinces)}\n\n`
    msg += `Writing municipalities list to "${jsonFileName}"...`
    logger.log(msg)

    // Write the municipalities of a region to a JSON file
    excelFile.writeMunicipalities({
      fileName: pathToOutputFile,
      provinces
    })

    // Read the JSON file from disk
    jsonDataContent = fs.readFileSync(pathToOutputFile, { encoding: 'utf8' })

    logger.log(`JSON data read from the "${jsonFileName}" file:`)
    logger.log(jsonDataContent)

    expect(jsonDataContent).toBeDefined()

    checkClass({
      excelInstance: excelFile,
      classType: ExcelFactory
    })
  })

  it('should follow the defined output format', () => {
    // Validate schema of the output JSON file
    const schema = new Schema(
      JSON.parse(jsonDataContent),
      outputSchema
    )

    expect(schema).toBeDefined()
  })
})
