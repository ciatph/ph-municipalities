require('dotenv').config()
const path = require('path')
const { ExcelFile } = require('../classes/excel')

const PHExcel = new ExcelFile({
  pathToFile: path.resolve(__dirname, '..', '..', 'data', 'day1.xlsx'),
  url: process.env.EXCEL_FILE_URL
})

PHExcel.init()
module.exports = PHExcel
