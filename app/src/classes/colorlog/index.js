/**
 * Prints colored console.log messages
 * @class
 */
class ColorLog {
  static TEXT = {
    BOLD: '\x1b[1m',
    NORMAL: '\x1b[0m'
  }

  static COLORS = {
    TEXT: {
      WHITE: '\x1b[37m',
      GRAY: '\x1b[90m',
      GREEN: '\x1b[32m',
      RED: '\x1b[31m',
      YELLOW: '\x1b[33m',
      BLUE: '\x1b[34m',
      CYAN: '\x1b[36m',
      RESET: '\x1b[0m',
      MAGENTA: '\x1b[35m'
    }
  }

  /** Message log */
  #log = null

  /** Text color */
  #color = ColorLog.COLORS.TEXT.GREEN

  /** Text weight (bold, normal) */
  #weight = false

  /**
   * Initializes a ColorLog class
   * @typedef {Object} params - Input parameters
   * @param {String} params.color - ANSI color defined in `ColorLog.COLORS`
   * @param {Bool} params.isBold - Flag to render bold colored text
   */
  constructor ({ color, isBold = false } = {}) {
    this.setColor(color)
    this.setText(isBold)
  }

  /**
   * Prints colored log message in console.log()
   * @param {String} message - Log message text
   * @param {Object} options - (Optional)
   * @param {String} options.color - ANSI color defined in `ColorLog.COLORS`
   * @param {Bool} options.isBold - Flag to render bold colored text
   * @returns {Bool}
   */
  log (message, options = {}) {
    if (!message || typeof message !== 'string') return

    this.#log = message
    this.setColor(options.color)
    this.setText(options.isBold)

    const style = `${this.#weight}${this.#color}%s${ColorLog.TEXT.NORMAL}`
    console.log(style, this.#log)
  }

  /**
   * Sets the text color in console.log()
   * @param {String} color - ANSI color defined in `ColorLog.COLORS`
   * @returns {Bool}
   */
  setColor (color) {
    if (!color) return

    if (!Object.values(ColorLog.COLORS.TEXT)) {
      throw new Error(`${color} not supported`)
    }

    this.#color = color
  }

  /**
   * Sets the text weight in console.log
   * @param {Bool} isBold - Flag to render bold colored text
   * @returns {Bool}
   */
  setText (isBold) {
    if (![true, false].includes(isBold)) return

    this.#weight = isBold
      ? ColorLog.TEXT.BOLD
      : ColorLog.TEXT.NORMAL
  }
}

module.exports = ColorLog
