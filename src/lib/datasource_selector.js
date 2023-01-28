const path = require('path')
const prompt = require('./prompt')
const ExcelFactory = require('./excelfactory')

/**
 * Prompts user to download a new excel file or use the static local excel file as data source
 * @returns {ExcelHandler}
 */
const selectDataSource = async () => {
  let exit = false
  let url
  let ExcelHandler = null

  while (!exit) {
    // Prompt to enter the download URL of a remote excel file
    if (url === undefined) {
      const askDownload = await prompt('\nWould you like to download and use a remote Excel file?\nPress enter to ignore. Press Y and enter to proceed. [n/Y]:')

      if (askDownload === 'Y') {
        const pathToFile = path.join(process.cwd(), 'datasource.xlsx')

        url = await prompt('\nEnter the download URL of a remote Excel file: ')
        console.log(`Downloading file from ${url}...`)

        try {
          ExcelHandler = ExcelFactory(url)
          await ExcelHandler.init()
          exit = true

          console.log(`\nUsing the file downloaded to ${pathToFile}\nas data source`)
        } catch (err) {
          console.log(`[ERROR] ${err.message}`)
          ExcelHandler = null
          exit = true
        }
      } else {
        ExcelHandler = ExcelFactory()
        exit = true
        url = false

        console.log(`\nUsing the default local excel file ${ExcelHandler.pathToFile}\nas data source`)
      }
    }
  }

  return ExcelHandler
}

module.exports = selectDataSource
