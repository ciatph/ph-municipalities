const path = require('path')
const prompt = require('../lib/prompt')
const { formatDisplay } = require('../lib/format_display')
const selectDataSource = require('../lib/selector')

// Asks for a prompt to enter a region name.
// Lists all municipalities under the provinces of a region.
const main = async () => {
  let exit = false
  let ExcelHandler = null
  let idx
  console.log('\nWelcome! Press Ctrl+C to stop anytime.')

  while (!exit) {
    // Prompt to enter the download URL of a remote excel file or use the default local excel file
    if (ExcelHandler === null) {
      ExcelHandler = await selectDataSource()
    }

    if (ExcelHandler !== null) {
      // Display region abbreviations
      const regionNames = ExcelHandler.listRegions()

      console.log('\nREGION NAMES')
      console.table(regionNames)

      // Prompt to ask for province name(s)
      const region = await prompt('\nEnter a region name: ')

      if (region) {
        // Check if the region name exists in the masterlist
        idx = ExcelHandler
          .settings
          .data
          .findIndex(item => item.name === region)

        if (idx === -1) {
          await prompt('Region name not found.\n')
        } else {
          // List the provinces of a target region
          const provinces = ExcelHandler
            .settings
            .data
            .find(x => x.name === region).provinces

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

            try {
              ExcelHandler.writeMunicipalities({
                provinces,
                fileName: filePath
              })

              console.log(`JSON file created in ${filePath}`)
            } catch (err) {
              console.log(err.message)
            }
          }
        }
      }

      if (idx >= 0) {
        const ex = await prompt('\nExit? (Enter X to exit): ')
        exit = (ex === 'X')
      }
    }
  }

  console.log('Goodbye!')
  process.exit(0)
}

main()
