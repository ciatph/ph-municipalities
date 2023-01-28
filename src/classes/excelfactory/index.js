const path = require('path')
require('dotenv').config({
  // Set the dotenv path when packaging with pkg
  path: path.join(__dirname, '..', '..', '..', '.env')
})

const ExcelFile = require('../excel')

class ExcelFactory extends ExcelFile {
  constructor (url) {
    if (url) {
      super({
        pathToFile: path.join(process.cwd(), 'datasource.xlsx'),
        url
      })
    } else {
      super({
        // When pkg encounters path.join(__dirname, '../path/to/asset'),
        // it automatically packages the file specified as an asset.
        pathToFile: path.join(__dirname, '..', '..', '..', 'data', 'day1.xlsx')
        // url: process.env.EXCEL_FILE_URL
      })
    }
  }
}

module.exports = ExcelFactory
