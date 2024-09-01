/**
 * Formats municipality names for logging.
 * Attaches municipalities count and total count to the return data.
 * @param {Object} municipalitiesGroup - Object that have province names as keys, each containing a String[] of municipalities
 * @returns {Object} { total, data }
 *    - total: {Number} total municipalities count
 *    - data: {Object} mutated municipalitiesGroup. Contains the String[] municipalities array and the number of municipalities per province.
 */
const formatDisplay = (municipalitiesGroup) => {
  const total = Object.keys(municipalitiesGroup).reduce((count, province) => {
    count += municipalitiesGroup[province].length
    return count
  }, 0)

  return {
    total,
    data: Object.keys(municipalitiesGroup).reduce((formatted, province) => ({
      ...formatted,
      [province]: {
        count: municipalitiesGroup[province].length,
        municipalities: municipalitiesGroup[province]
      }
    }), {})
  }
}

module.exports = {
  formatDisplay
}
