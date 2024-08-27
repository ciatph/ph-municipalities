/**
 * Checks if a variable is a true JavaScript Object
 * @param {Object} item - JavaScript Object
 * @returns {Bool} true|false
 */
const isObject = (item) => {
  return item &&
    typeof item === 'object' &&
    item.constructor === Object
}

/**
 * Converts an Array of strings (text) into a single comma-separated string
 * @param {String[]} arrayOfText - Array containing String items
 * @returns {String} Comma-separated text
 */
const arrayToString = (arrayOfText) => arrayOfText.toString().split(',').join(', ')

/**
 * Capitalizes the first letter of words in a text
 * @param {String} text - String text
 * @returns {String} Capitalized text
 */
const capitalizeText = (text) => {
  if (typeof text !== 'string') return null

  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

module.exports = {
  isObject,
  arrayToString,
  capitalizeText
}
