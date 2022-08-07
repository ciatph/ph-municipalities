require('dotenv').config()
const { ExcelFile } = require('./classes/excel')
const path = require('path')

const main = async () => {
  const file = new ExcelFile({
    pathToFile: path.resolve(__dirname, '..', 'data', 'day1.xlsx')
  })

  try {
    file.init()
  } catch (err) {
    console.log(err.message)
  }
}

main()
