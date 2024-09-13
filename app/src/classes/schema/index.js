/**
 * Validates Objects with [zod](https://github.com/colinhacks/zod) schemas and formats validation error(s) for log output.
 */
class Schema {
  /**
   * Settings object.
   * @type {Object | null}
   */
  #data = null

  /**
   * Initializes a `Schema` class with custom Object settings
   * @param {Object} settings - Custom Object containing key-value pairs
   * @param {Object} schema - zod Schema
   */
  constructor (settings, schema) {
    if (!settings) {
      throw new Error('Missing settings data')
    }

    if (!schema) {
      throw new Error('Missing Schema object')
    }

    this.validate(settings, schema)
    this.#data = settings
  }

  /**
   * Validates a settings Object
   * @param {Object} settings - JSON-like Object
   * @throws {Error} validation errors
   */
  validate (settings, schema) {
    try {
      const result = schema.safeParse(settings)

      if (!result?.success) {
        const errorLog = this.formatErrorLog(result?.error?.errors)
        throw new Error(`Schema settings validation failed\n${errorLog}`)
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  /**
   * Formats error messages into a single string
   * @param {Object[]} errors - List of zod error messages
   * @returns {boolean}
   */
  formatErrorLog (errors = []) {
    if (!Array.isArray(errors)) {
      throw new Error('Errors object not an array.')
    }

    return errors.reduce((log, item) => {
      log += ` - ${item.path.join(',').replace(/,/g, '/')}: ${item.message}\n`
      return log
    }, '')
  }

  /**
   * Returns the validated settings Object
   * @returns {Object} Validated settings Object
   */
  get () {
    return this.#data
  }
}

module.exports = Schema
