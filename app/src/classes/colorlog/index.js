/**
 * Prints colored console.log messages
 */
class ColorLog {
  /**
   * Text styles for logging.
   * @static
   * @type {Object.<string, string>}
   * @property {string} BOLD - Bold text style.
   * @property {string} NORMAL - Normal text style.
   */
  static TEXT = {
    BOLD: '\x1b[1m',
    NORMAL: '\x1b[0m'
  }

  /**
   * ANSI colors for coloring the logging text.
   * @static
   * @type {Object.<string, object>}
   * @property {Object} TEXT - Object containing color properties.
   * @property {string} TEXT.WHITE - White color.
   * @property {string} TEXT.GRAY - Gray color.
   * @property {string} TEXT.GREEN - Green color.
   * @property {string} TEXT.RED - Red color.
   * @property {string} TEXT.YELLOW - Yellow color.
   * @property {string} TEXT.BLUE - Blue color.
   * @property {string} TEXT.CYAN - Cyan color.
   * @property {string} TEXT.RESET - Reset color.
   * @property {string} TEXT.MAGENTA - Magenta color.
   */
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

  /**
   * Message log text.
   * @type {string | null}
   */
  #log = null

  /**
   * Text color
   * @type {string}
   */
  #color = ColorLog.COLORS.TEXT.GREEN

  /**
   * Text weight (bold, normal)
   * @type {string}
   */
  #weight = false

  /**
   * Initializes a ColorLog class
   * @param {Object} params - Input parameters
   * @param {string} params.color - ANSI color defined in `ColorLog.COLORS`
   * @param {boolean} params.isBold - Flag to render bold colored text
   */
  constructor ({ color, isBold = false } = {}) {
    this.setColor(color)
    this.setText(isBold)
  }

  /**
   * Prints colored log message in console.log()
   * @param {string} message - Log message text
   * @param {Object} options - (Optional)
   * @param {string} options.color - ANSI color defined in `ColorLog.COLORS`
   * @param {boolean} options.isBold - Flag to render bold colored text
   * @returns {boolean}
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
   * @param {string} color - ANSI color defined in `ColorLog.COLORS`
   * @returns {boolean}
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
   * @param {boolean} isBold - Flag to render bold colored text
   * @returns {boolean}
   */
  setText (isBold) {
    if (![true, false].includes(isBold)) return

    this.#weight = isBold
      ? ColorLog.TEXT.BOLD
      : ColorLog.TEXT.NORMAL
  }
}

module.exports = ColorLog
