const https = require('https')
const fs = require('fs')
const EventEmitter = require('events')
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
   * @param {Bool} fastload - Start loading and parsing the local excel file on class initialization if the "url" param is not provided.
   *    - If "false", call init() later on a more convenient time
   */
  constructor ({ url, pathToFile, fastload = true }) {
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
    } else {
      if (fastload) {
        this.init()
      }
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
        throw new Error('Failed to load data. Please check the SHEETJS_COLUMN name or the excel file contents.')
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
   * Checks if a string contains special characters
   * @param {String} str - String to check
   * @returns {Bool}
   */
  static hasSpecialChars (str) {
    /* eslint-disable no-control-regex */
    const regex = /[^\x00-\x7F]/g
    return regex.test(str)
  }

  /**
   * Cleans/removes default-known special characters and garbled text defined in config from string.
   * @param {String} str - String to clean
   * @returns {String} - Clean string
   */
  static removeGarbledText (str) {
    // Known garbled special text
    let charMap = {
      '├â┬▒': 'ñ', // Replace "├â┬▒" with "ñ"
      â: '' // Remove "â"
    }

    // Other special characters from config
    const specialChars = (process.env.SPECIAL_CHARACTERS?.split(',') ?? [])
      .reduce((list, item) => {
        const [key, value] = item.split(':')

        return {
          ...list,
          ...((key || value) && { [key]: value ?? '' })
        }
      }, {})

    charMap = {
      ...charMap,
      ...specialChars
    }

    for (const [key, value] of Object.entries(charMap)) {
      str = str.replace(new RegExp(key, 'g'), value)
    }

    return str
  }

  /**
   * Extract the municipality name from a string following the pattern:
   *    "municipalityName (provinceName)"
   * @param {String} str
   * @returns {String} municipality name
   */
  getMunicipalityName (str) {
    const municipalityName = str.replace(/ *\([^)]*\) */g, '')

    const cleanText = ExcelFile.hasSpecialChars(municipalityName)
      ? ExcelFile.removeGarbledText(municipalityName)
      : municipalityName

    return cleanText
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

  // Set the private data list contents
  set datalist (data) {
    this.#datalist = data
  }

  /**
   * Get the requested data with other misc data
   * @param {String[]} provinces - List of provinces
   * @returns {Object} Formatted raw data with misc. metadata
   */
  shapeJsonData (provinces) {
    const url = (this.#url) ? this.#url : `local datasource cache from ${process.env.DEFAULT_EXCEL_FILE_URL}`

    return {
      metadata: {
        source: url || '',
        title: 'List of PH Municipalities By Province and Region',
        description: 'This dataset generated with reference to the excel file contents from the source URL.',
        date_created: new Date().toDateString()
      },
      data: this.listMunicipalities({ provinces })
    }
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

        const cleanText = ExcelFile.hasSpecialChars(item.municipality)
          ? ExcelFile.removeGarbledText(item.municipality)
          : item.municipality

        acc[item.province].push(cleanText)

        // Sort municipality names alphabetically
        if (process.env.SORT_ALPHABETICAL === '1') {
          acc[item.province].sort()
        }

        return { ...acc }
      }, {})
  }

  /**
   * Writes queried municipalities data to a JSON file.
   * Lists municipalities by by provinces.
   * @param {String[]} provinces - Array of case-sensitive province names. Starts with an upper case.
   * @param {String} fielName - Full file path to a JSON file
   * @param {Bool} prettify - Write the JSON content with proper spacings and newlines
   * @returns {Object} Formatted raw data with misc. metadata
   */
  writeMunicipalities ({ provinces, fileName, prettify = false }) {
    if (!fileName) {
      throw new Error('Please enter a filename ending in .json')
    }

    if (!/\.(json)$/i.test(fileName)) {
      throw new Error('Please enter a filename ending in .json')
    }

    try {
      const str = this.shapeJsonData(provinces)

      const json = (prettify)
        ? JSON.stringify(str, null, 2)
        : JSON.stringify(str)

      // Write results to a JSON file
      fs.writeFileSync(fileName, json, 'utf-8')
      return str
    } catch (err) {
      throw new Error(err.message)
    }
  }

  get pathToFile () {
    return this.#pathToFile
  }
}

module.exports = ExcelFile
