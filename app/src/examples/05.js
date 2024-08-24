require('dotenv').config()
const path = require('path')

const ExcelFile = require('../classes/excel')
const config = require('./config.json')

// Load the local Excel file
// Use a custom regions settins file "config"
const file = new ExcelFile({
  pathToFile: path.join(__dirname, '..', '..', 'data', 'day1.xlsx'),
  fastload: true,
  settings: config
})

// Load provinces from the custom config file
const provinces = file
  .settings
  .data
  .find(item => item.abbrev === 'INZ')?.provinces ?? []

// List the municipalities of defined provinces in the config file
// Note: Province/municipality names should match with those in the 10-day Excel file
const municipalities = file.listMunicipalities({ provinces })

console.log('---provinces', provinces)

console.log('\nProvince/municipality names should match with those in the 10-day Excel file')
console.log('---municipalities', municipalities)
