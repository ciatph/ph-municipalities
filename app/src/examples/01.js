const path = require('path')
const ExcelFile = require('../classes/excel')

// Use the following if installed via npm
// const { ExcelFile } = require('ph-municipalities')

// Reads an existing excel file on /app/data/day1.xlsx
const file = new ExcelFile({
  pathToFile: path.join(__dirname, '..', '..', 'data', 'day1.xlsx')
  // fastload: false
})

// Call init() if fastload=false
// file.init()

// listMunicipalities() lists all municipalities
// for each given province
const provinces = ['Albay', 'Masbate', 'Sorsogon']

/* eslint-disable no-unused-vars */
const municipalitiesFromProvince = file.listMunicipalities({ provinces })

// writeMunicipalities() writes municipalities data to a JSON file
// and returns the JSON object
const json = file.writeMunicipalities({
  provinces,
  fileName: path.join(__dirname, 'municipalities.json'),
  prettify: true
})

// shapeJsonData() returns the output of writeMunicipalities()
// without writing to a JSON file
const json2 = file.shapeJsonData(provinces)

// JSON data of the parsed excel file will is accessible on
// file.datalist
console.log(file.datalist)

// Set the contents of file.datalist
file.datalist = [
  { municipality: 'Tayum', province: 'Abra' },
  { municipality: 'Bucay', province: 'Abra' }]

// List all regions
const regions = file.listRegions()
console.log('---regions', regions)

// List region data from query
const regionQuery = file.listRegions('region_name')
console.log(`---region ${regionQuery}`, regionQuery)

// List the provinces of a region
const regionProvinces = file.listProvinces('Test')
console.log(`---provinces of ${regions[0]}`, regionProvinces)
