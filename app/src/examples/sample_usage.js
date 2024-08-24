require('dotenv').config()
const path = require('path')
const ExcelFile = require('../classes/excel')

const main = async () => {
  const file = new ExcelFile({
    pathToFile: path.join(__dirname, '..', '..', 'data', 'temp.xlsx'),
    url: process.env.EXCEL_FILE_URL
    // fastload: false
  })

  try {
    // Load formatted data from the excel file
    await file.init()
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`)
  }

  try {
    // List the provinces of a target region
    const provinces = file.settings.data.find(x => x.region_name === 'Bicol').provinces

    // List the municipalities of selected region-provinces
    const municipalities = file.writeMunicipalities({
      provinces,
      fileName: path.join(__dirname, '..', '..', 'municipalities_list.json')
    })

    // Write logs to console
    let count = 0
    let stats = '\nPROVINCES:\n'

    for (const province in municipalities.data) {
      count += municipalities.data[province].length
      stats += `${province}: ${municipalities.data[province].length}, ${municipalities.data[province].toString()}\n\n`
    }

    console.log(stats)
    console.log(`total: ${count}`)
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`)
  }
}

main()
