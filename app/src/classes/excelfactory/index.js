const path = require('path')
require('dotenv').config({
  // Set the dotenv path when packaging with pkg
  path: path.join(__dirname, '..', '..', '..', '.env')
})

const ExcelFile = require('../excel')

/**
 * Convenience factory class that creates an ExcelFile class using the default Excel data set.
 * Creates an `ExcelFile` class with remote download given the URL parameter.
 */
class ExcelFactory extends ExcelFile {
  /**
   * Initializes
   * @typedef {Object} params - Constructor parameter Object
   * @param {String} [params.url] - (Optional) Remote download URL of an excel file
   * @param {Object} [params.settings] - (Optional) Region settings configuration object following the format of the `/app/config/regions.json` file. Defaults to the mentioned file if not provided.
   */
  constructor ({ url, settings } = {}) {
    if (url) {
      super({
        pathToFile: path.join(process.cwd(), 'datasource.xlsx'),
        url,
        settings
      })
    } else {
      super({
        // When pkg encounters path.join(__dirname, '../path/to/asset'),
        // it automatically packages the file specified as an asset.
        pathToFile: path.join(__dirname, '..', '..', '..', 'data', 'day1.xlsx'),
        settings
        // url: process.env.EXCEL_FILE_URL
      })
    }
  }
}

module.exports = ExcelFactory
