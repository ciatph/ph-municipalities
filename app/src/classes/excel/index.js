const https = require('https')
const fs = require('fs')
const EventEmitter = require('events')

const XLSX = require('xlsx')
const Schema = require('../schema')

// Configuration settings
const regionSchema = require('../../lib/schemas/regionSchema')
const defaultRegionsConfig = require('../../../config/regions.json')

const { capitalizeText } = require('../../lib/utils')

/**
 * Load, process and parse an Excel File containing a list of PH municipalities.
 * The Excel File should contain a column with string pattern:
 *    "municipalityName (ProvinceName)"
 */
class ExcelFile {
  /**
   * Remote download URL of an excel file
   * @type {string | null}
   */
  #url = null

  /**
   * Full file path to excel file on local storage
   * @type {string | null}
   */
  #pathToFile = null

  /**
   * Region information from the `/app/config/regions.json` or other JSON config file.
   * @type {Object | null}
   */
  #settings = null

  /**
   * 10-day Excel file information
   * @type {Object.<string, string | null>}
   */
  #metadata = {
    /**
     * Weather forecast date
     * @type {string | null}
     */
    forecastDate: null
  }

  /**
   * Other class settings and configurations
   * @type {Object.<string, string | number>}
   */
  #options = {
    /**
     * SheetJS array index number translated from the Excel headers row count
     * before elements containing "municipalityName (provinceName)" data
     * @type {number}
     */
    dataRowStart: 0,

    /** Internal excel file column name read by sheetjs.
     *  This column contains strings following the pattern
     *      "municipalityName (provinceName)"
     * @type {string}
     */
    SHEETJS_COL: process.env.SHEETJS_COLUMN || '__EMPTY'
  }

  /**
   * Excel workbook object parsed by sheetjs
   * @type {Object[] | null}
   */
  #workbook = null

  /**
   * Excel sheet names parsed by sheetjs.
   * @type {string[] | null}
   */
  #sheets = null

  /**
   * Objects[] Array corresponding to excel rows extracted from the excel sheet by sheetjs.
   * @type {Object[] | null}
   */
  #data = null

  /**
   * Object[] Array of processed string corresponding to the column in the excel file
   * that contains the list of municipalities following the pattern:
   *  "municipalityName (provinceName)"
   * Content: [{ municipality, province }, ... ]
   * @type {Object[] | null}
   */
  #datalist = []

  /**
   * Node event emitter for listening to custom events.
   * @type {Function}
   */
  events = new EventEmitter()

  /**
   * List of EventEmitter events.
   * @type {Object.<string, string>}
   */
  EVENTS = {
    LOADED: 'loaded'
  }

  /**
   * Initialize an ExcelFile object
   * @param {Object} params - Constructor parameter Object
   * @param {string} [params.url] - (Optional) Remote download URL of an excel file
   * @param {string} params.pathToFile
   *    - Full local file path of an existing Excel file, **required** if `params.url` is not provided
   *    - Full local file path to an existing or non-existent Excel file on which to download/save the remote Excel file from `params.url`,
   *      if the `params.url` parameter is provided
   * @param {Object} [params.settings] - (Optional) Region settings configuration object following the format of the `/app/config/regions.json` file. Defaults to the mentioned file if not provided.
   * @param {boolean} [params.fastload] - (Optional) Start loading and parsing the local excel file on class initialization if the "url" param is not provided.
   *    - If `false` or not provided, call the `.init()` method later on a more convenient time.
   */
  constructor ({ url, pathToFile, fastload = true, settings = null, options = null } = {}) {
    if (url === '' || pathToFile === '') {
      throw new Error('Missing remote file url or local file path.')
    }

    if (pathToFile === undefined) {
      throw new Error('Missing pathToFile.')
    }

    if (!pathToFile.includes('.xlsx')) {
      throw new Error('pathToFile should contain an excel file name ending in .xlsx')
    }

    this.setOptions(options)

    // Set the local Excel file path
    this.#pathToFile = pathToFile

    // Set the regions settings
    this.#settings = new Schema(
      settings || defaultRegionsConfig,
      regionSchema
    ).get()

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
   * Loads an excel file from a local directory using sheetjs.
   * Store excel file data as JSON in this.#data
   */
  load () {
    try {
      this.#workbook = XLSX.readFile(this.#pathToFile)
      this.#sheets = this.#workbook.SheetNames

      // Set data excel row data as Objects
      this.#data = XLSX.utils.sheet_to_json(this.#workbook.Sheets[this.#sheets[0]])

      // Extract the municipality and province names
      this.#datalist = this.#data.reduce((acc, row, index) => {
        if (row[this.#options.SHEETJS_COL] !== undefined && this.followsStringPattern(row[this.#options.SHEETJS_COL])) {
          const municipality = this.getMunicipalityName(row[this.#options.SHEETJS_COL])
          const province = this.getProvinceName(row[this.#options.SHEETJS_COL])

          if (province !== null) {
            acc.push({
              municipality: municipality.trim(),
              province
            })
          }
        } else {
          // Find the SheetJS array index of rows containing data
          // Note: this relies on the structure of the default Excel file in /app/data/day1.xlsx or similar
          if (row[this.#options.SHEETJS_COL] === 'Project Areas') {
            const OFFSET_FROM_FLAG = 2
            this.#options.dataRowStart = index + OFFSET_FROM_FLAG
          }

          if (this.#metadata.forecastDate === null) {
            const contentAsKeys = Object.keys(row ?? '')
            const content = contentAsKeys.filter(item => item.includes('FORECAST DATE'))

            this.#metadata.forecastDate = content.length > 0
              ? capitalizeText(content[0])
              : 'Forecast Date: n/a'
          }
        }

        return acc
      }, [])

      console.log(`Loaded ${this.#data.length} rows, ${this.#datalist.length} with data`)

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
   * @param {string} str - String to check
   * @returns {boolean} true | false
   */
  followsStringPattern (str) {
    return /[a-zA-Z,.] *\([^)]*\) *$/.test(str)
  }

  /**
   * Sets the local this.#options settings
   * @param {Object} options - Miscellaneous app settings defined in this.#options
   * @returns {boolean}
   */
  setOptions (options) {
    if (!options) return false

    for (const key in this.#options) {
      if (options[key] !== undefined) {
        this.#options[key] = options[key]
      }
    }
  }

  /**
   * Checks if a string contains special characters
   * @param {string} str - String to check
   * @returns {boolean}
   */
  static hasSpecialChars (str) {
    /* eslint-disable no-control-regex */
    const regex = /[^\x00-\x7F]/g
    return regex.test(str)
  }

  /**
   * Cleans/removes default-known special characters and garbled text defined in config from string.
   * @param {string} str - String to clean
   * @returns {string} - Clean string
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
   * Extracts the municipality name from a string following the pattern:
   *    "municipalityName (provinceName)"
   * @param {string} str
   * @returns {string} municipality name
   */
  getMunicipalityName (str) {
    const municipalityName = str.replace(/ *\([^)]*\) */g, '')

    const cleanText = ExcelFile.hasSpecialChars(municipalityName)
      ? ExcelFile.removeGarbledText(municipalityName)
      : municipalityName

    return cleanText
  }

  /**
   * Extracts the province name from a string following the pattern:
   *    "municipalityName (provinceName)"
   * @param {string} str
   * @returns {string} province name
   * @returns {null} Returns null if "provinceName" is not found
   */
  getProvinceName (str) {
    if (!str) return null

    const match = str.match(/\(([^)]+)\)/)
    return (match !== null)
      ? match[1]
      : match
  }

  // Returns the processed Object array (masterlist) of municipality and province names
  get datalist () {
    return this.#datalist
  }

  // Sets the private data list contents
  set datalist (data) {
    this.#datalist = data
  }

  // Returns the raw Excel JSON data
  get data () {
    return this.#data
  }

  // Returns the region data settings object
  get settings () {
    return this.#settings
  }

  // Returns the local options object
  get options () {
    return this.#options
  }

  // Returns the loaded Excel file's metadata
  get metadata () {
    return this.#metadata
  }

  // Returns the full path to the 10-day weather forecast Excel file
  get pathToFile () {
    return this.#pathToFile
  }

  get url () {
    return this.#url
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
      .filter(item => provinces.includes(item.province.trim()))
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
   * @param {string} fielName - Full file path to a JSON file
   * @param {boolean} prettify - Write the JSON content with proper spacings and newlines
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

  /**
   * Lists the province names of a region defined in the settings file
   * @param {string} regionName - Region name that matches with the `/app/config/regions.json` file's `data[N].name`
   * @returns {String[]}  List provinces under the `regionName`.
   */
  listProvinces (regionName) {
    return this.#settings.data
      .find(region => region.name === regionName)?.provinces ?? []
  }

  /**
   * Lists the province names of a region defined in the settings (PAGASA seasonal config) file or from the parsed Excel file
   * @param {boolean} fromExcel - Flag to return the province names from the parsed 10-day Excel file. Defaults to `false`.
   *    - Note: Province names from a "remote" Excel file may change without notice.
   *    - It may differ from the contents of the "default" settings (PAGASA seasonal config) file.
   *    - If the province names from the "remote" Excel file and "default" settings (PAGASA seasonal config) file vary,
   *      consider initializing an `ExcelFile` or `ExcelFactory` class with a custom settings config file following
   *      the format of the default settings file in `/app/config/regions.json`
   * @returns {String[]}  List of all provinces from a 10-day Excel file.
   */
  listAllProvinces (fromExcel = false) {
    if (fromExcel) {
      // Return unique province names from the parsed Excel file
      return this.#datalist
        .map(item => item.province)
        .filter((x, i, a) => a.indexOf(x) === i)
    } else {
      // Return province names from the PAGASA seasonal config file
      return this.listRegions().reduce((list, region) => {
        const provinces = this.listProvinces(region)
        return [...list, ...provinces]
      }, [])
    }
  }

  /**
   * Lists the region names defined in the settings file
   * @param {Object} key - Key name of the region data definition key.
   *    - Valid values are: `name`, `abbrev`, `region_num`, and `region_name`
   *    - See the `/app/config/regions.json` file -> `data[]` item keys for more information.
   * @returns {String[]}  A list of province information by key
   */
  listRegions (key = null) {
    if (!key) {
      return this.#settings.data.map(region => region.name)
    } else {
      const keys = [...Object.keys(this.#settings.data[0])]

      if (
        !keys.includes(key) || typeof key !== 'string'
      ) {
        return []
      }

      return this.#settings.data
        .map(region => region[key])
    }
  }
}

module.exports = ExcelFile
