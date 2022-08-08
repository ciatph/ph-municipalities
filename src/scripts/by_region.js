const path = require('path')
const prompt = require('../lib/prompt')
const PHExcel = require('../lib/ph_excelfile')
const regions = require('../../data/regions.json')

// Asks for a prompt to enter a region name.
// Lists all municipalities under the provinces of a region.
PHExcel.events.on(PHExcel.EVENTS.LOADED, async () => {
  let exit = false

  while (!exit) {
    // Display region abbreviations
    const regionNames = regions.data.map(region => region.name)
    console.log('REGION NAMES')
    console.log(regionNames.toString().split(',').join(', '))

    // Prompt to ask for province name(s)
    const region = await prompt('\nEnter a region name: ')

    if (region) {
      // Check if the region name exists in the masterlist
      const idx = regions.data.findIndex(item => item.name === region)

      if (idx === -1) {
        console.log('Region name not found.')
      } else {
        // List the provinces of a target region
        const provinces = regions.data.find(x => x.name === region).provinces

        // List the municipalities of all provinces under a region
        const municipalities = PHExcel.listMunicipalities({ provinces })
        console.log(municipalities)

        // Prompt to write results to a JSON file
        const write = await prompt('\nWrite results to a JSON file? [n/Y]: ')

        if (write === 'Y') {
          const fileName = await prompt('\nEnter the JSON filename: ')

          // Use process.cwd() to enable file paths when building with "pkg"
          const filePath = path.join(process.cwd(), fileName)

          PHExcel.writeMunicipalities({
            provinces,
            fileName: filePath
          })

          console.log(`JSON file created in ${filePath}`)
        }
      }
    }

    const ex = await prompt('\nExit? (Enter X to exit): ')
    exit = (ex === 'X')
  }

  console.log('Goodbye!')
  process.exit(0)
})
