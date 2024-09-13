require('dotenv').config()

const ColorLog = require('../../src/classes/colorlog')
const logger = new ColorLog({ color: ColorLog.COLORS.TEXT.YELLOW, isBold: true })

const { arrayToString } = require('../../src/lib/utils')

/**
 * Updates the initial province names data read by an `ExcelFile` or ExcelFactory` class from `createInstances()` for log-viewing purposes only.
 * Displays diagnostic information and error logs.
 * @param {Object} params - Input parameters
 * @param {String[]} params.allExcelProvinces - all provinces from the 10-day Excel file
 * @param {String[]} params.allProvinces - all provinces from the PAGASA seasonal config file
 * @param {Set} params.uniqueExcelProvinces - `Set` version of `allExcelProvinces` to ensure unique province names
 * @param {Set} params.uniqueProvinces - `Set` version of `allProvinces` to ensure unique province names,
 * @param {String[]} params.fromConfig - Provinces present in the config (PAGASA seasonal) but missing in the 10-Day Excel file
 * @param {String[]} params.fromExcel - Provinces present in the 10-Day Excel file but missing in the config (PAGASA seasonal)
 * @returns {Object} Object containing Arrays of processed province names
 *    - `uniqueExcelProvinces` {Set} - updated version of the `uniqueExcelProvinces` input parameter
 *    - `uniqueProvinces` {Set} - updated version of the `uniqueProvinces` input parameter
 */
const updateInstances = ({
  allExcelProvinces,
  allProvinces,
  uniqueExcelProvinces,
  uniqueProvinces,
  fromConfig,
  fromExcel
}) => {
  try {
    // Provinces present in the config (PAGASA seasonal) but missing in the 10-Day Excel file
    if (fromConfig.length > 0) {
      uniqueProvinces = new Set(allProvinces.filter(item => !fromConfig.includes(item)))

      let msg = `[WARNING]: ${fromConfig.length} province(s) in the (PAGASA seasonal) config is/are missing\n`
      msg += `but available in the 10-Day Excel file: ${arrayToString(fromConfig)}`

      logger.log(msg)
    }

    // Provinces present in the 10-Day Excel file but missing in the config (PAGASA seasonal) file
    if (fromExcel.length > 0) {
      uniqueExcelProvinces = new Set(allExcelProvinces.filter(item => !fromExcel.includes(item)))
      let msg = `[WARNING]: ${fromExcel.length} province(s) missing in the 10-Day Excel file\n`
      msg += `but present in the (PAGASA seasonal) config: ${arrayToString(fromExcel)}`
      logger.log(msg)
    }

    // Provinces names do not match in 10-Day Excel file and the (PAGASA seasonal) config file
    if (fromExcel.length > 0 || fromConfig.length > 0) {
      let msg = `[INFO]: Original provinces count are: ${allProvinces.length} (PAGASA seasonal config) vs. ${allExcelProvinces.length} (10-Day Excel file)\n`
      msg += '[INFO]: Removed incosistent provinces in the config and Excel file only during checking/testing (see yellow WARNINGs)\n'
      msg += `[INFO]: Modified provinces count are: ${uniqueProvinces.size} (PAGASA seasonal config) vs. ${uniqueExcelProvinces.size} (10-Day Excel file)\n\n`
      msg += '[NOTE]: If you believe these INFOs are incorrect, feel free to reach out or you may extend and override\n'
      msg += 'the ExcelFile or ExcelFactory classes in your scripts to customize this behaviour and other settings.'

      logger.log(msg, {
        color: ColorLog.COLORS.TEXT.CYAN
      })
    } else {
      logger.log('[PROVINCES]: Province counts match in config and Excel', {
        color: ColorLog.COLORS.TEXT.GREEN
      })
    }

    return {
      uniqueExcelProvinces,
      uniqueProvinces
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = updateInstances
