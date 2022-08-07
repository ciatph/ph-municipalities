require('dotenv').config()
const { ExcelFile } = require('./classes/excel')
const path = require('path')

const main = async () => {
  const file = new ExcelFile({
    pathToFile: path.resolve(__dirname, '..', 'data', 'day1.xlsx')
    // url: process.env.EXCEL_FILE_URL
  })

  try {
    // Load formatted data from the excel file
    await file.init()
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`)
  }

  try {
    // List hand-picked province municipalities
    const provinces = file.listMunicipalities({
      provinces: ['Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Masbate', 'Sorsogon']
    })

    // Write logs to console
    let count = 0
    let stats = '\nPROVINCES:\n'

    for (const province in provinces) {
      count += provinces[province].length
      stats += `${province}: ${provinces[province].length}, ${provinces[province].toString()}\n`
    }

    console.log(stats)
    console.log(`total: ${count}`)
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`)
  }
}

main()
