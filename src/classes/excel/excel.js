const https = require('https')
const fs = require('fs')
const XLSX = require('xlsx')

/**
 * Load, process and parse an Excel File containing a list of PH municipalities.
 * The Excel File should contain a column with string pattern:
 *    "municipalityName (ProvinceName)"
 */
class ExcelFile {
  /** Remote download URL of an excel file */
  #url = null

  /** Full file path to excel file on local storage */
  #pathToFile = null

  /** Excel workbook parsed by sheetjs */
  #workbook = null

  /** Excel sheet names parsed by sheetjs */
  #sheets = null

  /** JSON data extracted from an excel sheet by sheetjs */
  #data = null

  /**
   * Initialize an ExcelFile object
   * @param {String} url - Remote download URL of an excel file
   * @param {String} pathToFile
   *    - Full local file path of an existing excel file, if "url" is not provided
   *    - Full local file path of an excel on where to download the remote excel file from "url",
   *      if the "url" parameter is provided
   */
  constructor ({ url, pathToFile }) {
    if (url === '' || pathToFile === '') {
      throw new Error('Missing remote file url or local file path.')
    }

    if (pathToFile === undefined) {
      throw new Error('Missing pathToFile.')
    }

    // Set the local excel file path
    this.#pathToFile = pathToFile

    if (url) {
      // Set the remote excel file download URL
      this.#url = url
    }
  }

  /**
   * Loads an existing excel file contents to a JSON object.
   * Downloads a remote excel file if a remote this.#url is provided on the constructor
   */
  async init () {
    if (this.#url !== null && this.#pathToFile !== null) {
      // Download from remote URL
      try {
        await this.download()
      } catch (errMsg) {
        throw new Error(errMsg)
      }
    }

    if (this.#url === null && this.#pathToFile !== null) {
      // Download from file
      this.load()
    }
  }

  /**
   * Load an excel file from a local directory using sheetjs.
   * Store excel file data as JSON in this.#data
   */
  load () {
    try {
      this.#workbook = XLSX.readFile(this.#pathToFile)
      this.#sheets = this.#workbook.SheetNames
      this.#data = XLSX.utils.sheet_to_json(this.#workbook.Sheets[this.#sheets[0]])
      console.log(`Loaded ${this.#data.length} rows`)
    } catch (err) {
      throw new Error(err.message)
    }
  }

  download () {
    try {
      const file = fs.createWriteStream(this.#pathToFile)

      return new Promise((resolve, reject) => {
        https.get(this.#url, (res) => {
          res.pipe(file)

          file.on('finish', () => {
            file.close(() => {
              try {
                resolve(this.load())
              } catch (err) {
                reject(err.message)
              }
            })
          })
        })
      })
    } catch (err) {
      throw new Error(err.message)
    }
  }

  // Return the excel data converted to JSON objects
  get data () {
    return this.#data
  }
}

module.exports = ExcelFile
