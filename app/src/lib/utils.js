/**
 * Checks if a variable is a true JavaScript Object
 * @param {Object} item - JavaScript Object
 * @returns {Bool} true|false
 */
const isObject = (item) => {
  console.log('---type', typeof (item), item)

  return item &&
    typeof item === 'object' &&
    item.constructor === Object
}

module.exports = {
  isObject
}
