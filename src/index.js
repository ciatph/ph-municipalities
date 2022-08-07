require('dotenv').config()
const path = require('path')
const { ExcelFile } = require('./classes/excel')
const regions = require('../data/regions.json')

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
    // List the provinces of a target region
    const provinces = regions.data.find(x => x.abbrev === 'Bicol').provinces

    // List the municipalities of selected region-provinces
    const municipalities = file.writeMunicipalities({
      provinces,
      fileName: path.resolve(__dirname, '..', 'municipalities_list.json')
    })

    // Write logs to console
    let count = 0
    let stats = '\nPROVINCES:\n'

    for (const province in municipalities) {
      count += municipalities[province].length
      stats += `${province}: ${municipalities[province].length}, ${municipalities[province].toString()}\n\n`
    }

    console.log(stats)
    console.log(`total: ${count}`)
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`)
  }
}

main()
