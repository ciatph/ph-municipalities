/**
 * Formats municipality names into a single text string.
 * Attach municipalities count and total count.
 * @param {Object} municipalitiesGroup - Object that have province names as keys, each containing a String[] of municipalities
 * @returns {Object} { total, data }
 *    - total: {String} total municipalities count
 *    - data: {Object} mutated municipalitiesGroup. The String[] array municipalities are converted to 1 long String text
 */
const formatDisplay = (municipalitiesGroup) => {
  const total = Object.keys(municipalitiesGroup).reduce((count, municipality) => {
    count += municipalitiesGroup[municipality].length
    return count
  }, 0)

  return {
    total,
    data: Object.keys(municipalitiesGroup).reduce((formatted, municipality) => ({
      ...formatted,
      [municipality]: {
        count: municipalitiesGroup[municipality].length,
        municipalities: municipalitiesGroup[municipality].toString().split(',')
      }
    }), {})
  }
}

module.exports = {
  formatDisplay
}
