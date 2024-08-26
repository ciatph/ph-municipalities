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

const arrayToString = (array) => array.toString().split(',').join(', ')

module.exports = {
  isObject,
  arrayToString
}
