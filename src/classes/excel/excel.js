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

  /** Excel workbook object parsed by sheetjs */
  #workbook = null

  /** Excel sheet names parsed by sheetjs */
  #sheets = null

  /** Objects[] Array corresponding to excel rows extracted from the excel sheet by sheetjs */
  #data = null

  /** Object[] Array of processed string corresponding to the column in the excel file
   *  that contains the list of municipalities following the pattern:
   *  "municipalityName (provinceName)"
   * Content: [{ municipality, province }, ... ]
   */
  #datalist = []

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

      // Set data excel row data as Objects
      this.#data = XLSX.utils.sheet_to_json(this.#workbook.Sheets[this.#sheets[0]])

      // Extract the municipality and province names
      this.#datalist = this.#data.reduce((acc, row) => {
        if (row.__EMPTY !== undefined && this.followsStringPattern(row.__EMPTY)) {
          const municipality = this.getMunicipalityName(row.__EMPTY)
          const province = this.getProvinceName(row.__EMPTY)

          if (province !== null) {
            acc.push({
              municipality: municipality.trim(),
              province
            })
          }
        }

        return acc
      }, [])

      console.log(`Loaded ${this.#data.length} rows`)
    } catch (err) {
      throw new Error(err.message)
    }
  }

  /**
   * Downloads a remote excel file to this.#pathToFile
   * and loads sheetjs parsed-content
   */
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

  /**
   * Checks if a string follows the pattern:
   *    "municipalityName (provinceName)"
   * @param {String} str - String to check
   * @returns {Bool} true | false
   */
  followsStringPattern (str) {
    return /[a-zA-z] *\([^)]*\) */.test(str)
  }

  /**
   * Extract the municipality name from a string following the pattern:
   *    "municipalityName (provinceName)"
   * @param {String} str
   * @returns {String} municipality name
   */
  getMunicipalityName (str) {
    return str.replace(/ *\([^)]*\) */g, '')
  }

  /**
   * Extract the province name from a string following the pattern:
   *    "municipalityName (provinceName)"
   * @param {String} str
   * @returns {String} province name
   * @returns {null} Returns null if "provinceName" is not found
   */
  getProvinceName (str) {
    const match = str.match(/\(([^)]+)\)/)
    return (match !== null)
      ? match[1]
      : match
  }

  // Return the processed Object array of municipality and province names
  get datalist () {
    return this.#datalist
  }
}

module.exports = ExcelFile
