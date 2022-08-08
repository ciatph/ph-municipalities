const https = require('https')
const fs = require('fs')
const EventEmitter = require('events')
const path = require('path')
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

  /** Internal excel file column name read by sheetjs.
   *  This column contains strings following the pattern
   *      "municipalityName (provinceName)"
   */
  #SHEETJS_COL = process.env.SHEETJS_COLUMN || '__EMPTY'

  /** Event emitter for listening to custom events */
  events = new EventEmitter()

  /** List of EventEmitter events */
  EVENTS = {
    LOADED: 'loaded'
  }

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

    if (!pathToFile.includes('.xlsx')) {
      throw new Error('pathToFile should contain an excel file name ending in .xlsx')
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
      try {
        // Download from remote URL
        await this.download()
        this.events.emit(this.EVENTS.LOADED)
      } catch (errMsg) {
        throw new Error(errMsg)
      }
    }

    if (this.#url === null && this.#pathToFile !== null) {
      try {
        // Read from file
        this.load()

        // Add a slight delay before emmiting the loaded event
        setTimeout(() => {
          this.events.emit(this.EVENTS.LOADED)
        }, 300)
      } catch (err) {
        throw new Error(err.message)
      }
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
        if (row[this.#SHEETJS_COL] !== undefined && this.followsStringPattern(row[this.#SHEETJS_COL])) {
          const municipality = this.getMunicipalityName(row[this.#SHEETJS_COL])
          const province = this.getProvinceName(row[this.#SHEETJS_COL])

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

      if (this.#datalist.length === 0) {
        throw new Error('Failed to load data. Please check the SHEETJS_COLUMN name.')
      }
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

  // Return the processed Object array (masterlist) of municipality and province names
  get datalist () {
    return this.#datalist
  }

  /**
   * List the municipalities of given province(s)
   * @param {String[]} provinces - Array of case-sensitive province names. Starts with an upper case.
   * @returns {Object} Returns an object with the format:
   *    [
   *      { province1: ['municipality1', 'municipality2', .... ] },
   *      { province2: ['municipality1', 'municipality2', .... ] },
   *      ...
   *    ]
   */
  listMunicipalities ({ provinces }) {
    if (this.#datalist.length === 0) {
      throw new Error('No data to parse.')
    }

    if (provinces === undefined) {
      throw new Error('Missing the provinces parameter.')
    }

    return this.#datalist
      .filter(item => provinces.includes(item.province))
      .reduce((acc, item) => {
        if (acc[item.province] === undefined) {
          acc[item.province] = []
        }

        acc[item.province].push(item.municipality)
        return { ...acc }
      }, {})
  }

  /**
   * Writes queried municipalities data to a JSON file.
   * Lists municipalities by by provinces.
   * @param {String} provinces - Array of case-sensitive province names. Starts with an upper case.
   * @param {String} filName - Full file path to a JSON file
   * @param {Bool} prettify - Write the JSON content with proper spacings and newlines
   * @returns
   */
  writeMunicipalities ({ provinces, fileName, prettify = false }) {
    if (!fileName) {
      fileName = path.resolve(__dirname, '..', '..', '..', 'municipalities.json')
    }

    try {
      // List the municipalities
      const municipalities = this.listMunicipalities({ provinces })
      const str = {
        metadata: {
          source: process.env.EXCEL_FILE_URL,
          title: 'List of PH Municipalities By Province and Region',
          description: 'This dataset generated with reference to the excel file contents from the source URL.',
          date_created: new Date().toDateString()
        },
        data: municipalities
      }

      const json = (prettify)
        ? JSON.stringify(str, null, 2)
        : JSON.stringify(str)

      // Write results to a JSON file
      fs.writeFileSync(fileName, json, 'utf-8')

      return municipalities
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

module.exports = ExcelFile
