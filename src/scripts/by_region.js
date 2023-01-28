const path = require('path')
const prompt = require('../lib/prompt')
const { formatDisplay } = require('../lib/format_display')
const selectDataSource = require('../lib/datasource_selector')
const regions = require('../../data/regions.json')

// Asks for a prompt to enter a region name.
// Lists all municipalities under the provinces of a region.
const main = async () => {
  let exit = false
  let ExcelHandler

  while (!exit) {
    // Prompt to enter the download URL of a remote excel file or use the default local excel file
    ExcelHandler = await selectDataSource()

    if (ExcelHandler) {
      // Display region abbreviations
      const regionNames = regions.data.map(region => region.name)

      console.log('\nREGION NAMES')
      console.log(regionNames.toString().split(',').join('\n'))

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
          const { total, data } = formatDisplay(ExcelHandler.listMunicipalities({ provinces }))
          console.log(data)
          console.log(`\nTotal: ${total}`)

          // Prompt to write results to a JSON file
          const write = await prompt('\nWrite results to a JSON file? [n/Y]: ')

          if (write === 'Y') {
            const fileName = await prompt('\nEnter the JSON filename: ')

            // Use process.cwd() to enable file paths when building with "pkg"
            const filePath = path.join(process.cwd(), fileName)

            ExcelHandler.writeMunicipalities({
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
  }

  console.log('Goodbye!')
  process.exit(0)
}

main()
