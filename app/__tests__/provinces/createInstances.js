require('dotenv')

const ColorLog = require('../../src/classes/colorlog')
const logger = new ColorLog({ color: ColorLog.COLORS.TEXT.YELLOW, isBold: true })

/**
 * Builds objects containing all provinces for the PAGASA seasonal config and 10-Day Excel file to use for comparison checks and logs viewing purposes only.
 * The `updateInstances()` method uses and processes its return parameters.
 * @param {Class} excelFile - `ExcelFile` or `ExcelFactory` instance
 * @returns {Object} Object containing Arrays and Sets of province names
 *    - `allExcelProvinces` {String[]} - all provinces from the 10-day Excel file
 *    - `allProvinces` {String[]} - all provinces from the PAGASA seasonal config file
 *    - `uniqueExcelProvinces` {Set} - `Set` version of `allExcelProvinces` to ensure unique province names
 *    - `uniqueProvinces` {Set} - `Set` version of `allProvinces` to ensure unique province names
 *    - `fromConfig` {String[]} - Provinces present in the config (PAGASA seasonal) but missing in the 10-Day Excel file
 *    - `fromExcel` {String[]} - Provinces present in the 10-Day Excel file but missing in the config (PAGASA seasonal)
 */
const createInstances = (excelFile) => {
  if (!excelFile) return

  try {
    // Unique provinces from the Excel file
    const allExcelProvinces = excelFile.datalist
      .map(item => item.province)
      .filter((x, i, a) => a.indexOf(x) === i)
    const uniqueExcelProvinces = new Set(allExcelProvinces)

    // Unique provinces from the config file (PAGASA Seasonal)
    const allProvinces = excelFile.listRegions('provinces').flat()
    const uniqueProvinces = new Set(allProvinces)

    // Provinces present in the config (PAGASA seasonal) but missing in the 10-Day Excel file
    // Action: remove these provinces from provinces count equality check
    const fromConfig = allProvinces.filter(item => !allExcelProvinces.includes(item))

    // Provinces present in the 10-Day Excel file but missing in the config (PAGASA seasonal)
    // Action: remove these provinces from provinces count equality check
    const fromExcel = allExcelProvinces.filter(item => !allProvinces.includes(item))

    // Log other information
    logger.log(`[INFO]: Loaded ${excelFile.datalist.length} data rows`, {
      color: ColorLog.COLORS.TEXT.GREEN
    })

    return {
      allExcelProvinces,
      allProvinces,
      uniqueExcelProvinces,
      uniqueProvinces,
      fromConfig,
      fromExcel
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = createInstances
