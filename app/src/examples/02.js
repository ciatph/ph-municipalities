const path = require('path')
const ExcelFile = require('../classes/excel')

// Use the the following if installed via npm
// const { ExcelFile } = require('ph-municipalities')

// Reads an existing excel file on /app/data/day1.xlsx
const file = new ExcelFile({
  pathToFile: path.join(__dirname, '..', '..', 'data', 'day1.xlsx'),
  fastload: true
})

// listRegions() lists all regions from the regions settings file
const regions = file.listRegions()
console.log('---regions', regions)

// List region data from query
const regionQuery = file.listRegions('region_name')
console.log(`---region full name`, regionQuery)

// listProvinces() lists all provinces of a region
// for each given province
const provinces = file.listProvinces('Region IX')
console.log(`---provinces of ${regions[0]}`, provinces)

const municipalitiesFromProvince = file.listMunicipalities({ provinces })
console.log(`---municipalities`, municipalitiesFromProvince)
