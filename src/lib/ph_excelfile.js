const path = require('path')
require('dotenv').config({
  // Set the dotenv path when packaging with pkg
  path: path.join(__dirname, '..', '..', '.env')
})

const { ExcelFile } = require('../classes/excel')

const PHExcel = new ExcelFile({
  // When pkg encounters path.join(__dirname, '../path/to/asset'),
  // it automatically packages the file specified as an asset.
  pathToFile: path.join(__dirname, '..', '..', 'data', 'day1.xlsx')
  // url: process.env.EXCEL_FILE_URL
})

PHExcel.init()
module.exports = PHExcel
