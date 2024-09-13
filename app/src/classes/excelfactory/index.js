const path = require('path')
require('dotenv').config({
  // Set the dotenv path when packaging with pkg
  path: path.join(__dirname, '..', '..', '..', '.env')
})

const ExcelFile = require('../excel')

/**
 * Convenience factory class that creates an `ExcelFile` class.
 * - Uses the default Excel data source if there are no constructor parameters.
 * - Creates an `ExcelFile` class with remote Excel file download given the URL parameter,
 *    downloading the Excel file to a local Excel file with a random-generated filename.
 * - Note: Use the `ExcelFile` class instead if there is a need to specify the download file path or filename.
 */
class ExcelFactory extends ExcelFile {
  /**
   * Initializes an `ExcelFactory` class.
   * @param {Object} params - Constructor parameter Object
   * @param {string} [params.url] - (Optional) Remote download URL of an excel file
   * @param {Object} [params.settings] - (Optional) Region settings configuration object following the format of the `/app/config/regions.json` file. Defaults to the mentioned file if not provided.
   */
  constructor ({ url, settings } = {}) {
    if (url) {
      const randomTime = new Date().getTime()
      const fileName = `datasource_${randomTime}.xlsx`

      // Downloads the remote Excel file to a local file with random filename.
      super({
        pathToFile: path.join(process.cwd(), fileName),
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
