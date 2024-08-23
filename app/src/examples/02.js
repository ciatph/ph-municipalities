require('dotenv').config()
const path = require('path')
const ExcelFile = require('../classes/excel')

// Use the the following if installed via npm
// const { ExcelFile } = require('ph-municipalities')

const main = async () => {
  // Excel file will be downloaded to /app/src/examples/excelfile.xlsx
  const file = new ExcelFile({
    pathToFile: path.join(__dirname, 'excelfile.xlsx'),
    url: process.env.EXCEL_FILE_URL
  })

  try {
    // Download file
    await file.init()
    console.log(file.datalist)
  } catch (err) {
    console.log(err.message)
  }
}

main()
