const {
  createInstances,
  updateInstances
} = require('../../__tests__/provinces')
const prompt = require('./prompt')

const ColorLog = require('../classes/colorlog')
const ExcelFactory = require('../classes/excelfactory')

/**
 * Prompts user to download a new excel file or use the static local excel file as data source
 * @returns {ExcelFactory}
 */
const selectDataSource = async () => {
  let exit = false
  let url
  let ExcelHandler = null

  const logger = new ColorLog({ color: ColorLog.COLORS.TEXT.YELLOW, isBold: true })

  // Warning messages
  const archivedUrl = process.env.ARCHIVED_EXCEL_FILE_URL ||
    'https://raw.githubusercontent.com/ciatph/ph-municipalities/refs/heads/archives/day1.xlsx'

  const msgRemote = `[⚠️  WARNING]: Should you still want to use a remote Excel file, you can use the archived remote Excel file as data source at:\n${archivedUrl}\n`
  const msgUseDefault = '[⚠️  WARNING]: Please use the default local Excel file as data source.\n'
  let msgWarn = '[⚠️  WARNING]: PAGASA 10-Day Excel files are no longer available.\n'
  msgWarn += 'https://github.com/ciatph/ph-municipalities/issues/156\n'

  while (!exit) {
    // Prompt to enter the download URL of a remote excel file
    if (url === undefined) {
      const askDownload = await prompt('\nWould you like to download and use a remote PAGASA 10-Day Excel file?\nPress enter to ignore. Press Y and enter to proceed. [n/Y]: ')
      const askDownloadValue = String(askDownload).trim().toUpperCase()

      if (askDownloadValue === 'Y') {
        while (!url) {
          logger.log(msgWarn, { color: ColorLog.COLORS.TEXT.RED })
          logger.log(msgUseDefault, { color: ColorLog.COLORS.TEXT.GREEN })
          logger.log(msgRemote, { color: ColorLog.COLORS.TEXT.CYAN })

          url = await prompt('\nEnter the download URL of a remote Excel file: ')
        }

        console.log(`Downloading file from ${url}...`)

        try {
          ExcelHandler = new ExcelFactory({ url })
          await ExcelHandler.init()
          exit = true

          console.log(`\nUsing the file downloaded to ${ExcelHandler.pathToFile}\nas data source`)
        } catch (err) {
          console.log(`[ERROR] ${err.message}`)
          ExcelHandler = null
          exit = true
        }
      } else {
        ExcelHandler = new ExcelFactory()
        exit = true
        url = false

        console.log(`\nUsing the default local excel file ${ExcelHandler.pathToFile}\nas data source`)
      }
    }
  }

  // Display parsing/info logs
  const {
    allExcelProvinces,
    allProvinces,
    uniqueExcelProvinces: uniqueExcelList,
    uniqueProvinces: uniqueProvinceList,
    fromConfig,
    fromExcel
  } = createInstances(ExcelHandler)

  updateInstances({
    allExcelProvinces,
    allProvinces,
    uniqueExcelProvinces: uniqueExcelList,
    uniqueProvinces: uniqueProvinceList,
    fromConfig,
    fromExcel
  })

  return ExcelHandler
}

module.exports = selectDataSource
