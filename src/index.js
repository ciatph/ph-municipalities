require('dotenv').config()
const { ExcelFile } = require('./classes/excel')
const path = require('path')

const main = async () => {
  const file = new ExcelFile({
    pathToFile: path.resolve(__dirname, '..', 'data', 'day1.xlsx')
    // url: process.env.EXCEL_FILE_URL
  })

  try {
    await file.init()
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`)
  }
}

main()
