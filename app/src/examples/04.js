require('dotenv').config()
const path = require('path')

const ExcelFile = require('../classes/excel')

// Use the the following if installed via npm
// const { ExcelFile } = require('ph-municipalities')

const main = () => {
  try {
    // Initialize an ExcelFile class instance.
    const PHExcel = new ExcelFile({
      pathToFile: path.join(__dirname, 'excelfile.xlsx'),
      url: process.env.EXCEL_FILE_URL
    })

    // Download file
    PHExcel.init()

    // Listen to the instance's EVENTS.LOADED event.
    PHExcel.events.on(PHExcel.EVENTS.LOADED, () => {
      console.log('--Excel data loaded!', PHExcel.datalist)
    })
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`)
  }
}

main()
