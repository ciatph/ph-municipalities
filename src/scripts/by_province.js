const path = require('path')
const prompt = require('../lib/prompt')
const { formatDisplay } = require('../lib/format_display')
const selectDataSource = require('../lib/datasource_selector')

// Asks for a prompt to enter province names.
// Lists all municipalities under the specified provinces.
const main = async () => {
  let exit = false
  let ExcelHandler

  while (!exit) {
    // Prompt to enter the download URL of a remote excel file or use the default local excel file
    ExcelHandler = await selectDataSource()

    if (ExcelHandler) {
      // Prompt to ask for province name(s)
      const provinces = await prompt('\nEnter province names separated by comma: ')

      if (provinces) {
        // List the municipalities of a targets province(s)
        const { total, data } = formatDisplay(ExcelHandler.listMunicipalities({ provinces }))
        console.log(data)
        console.log(`\nTotal: ${total}`)
      }

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

      const ex = await prompt('\nExit? (Enter X to exit): ')
      exit = (ex === 'X')
    }
  }

  console.log('Goodbye!')
  process.exit(0)
}

main()
