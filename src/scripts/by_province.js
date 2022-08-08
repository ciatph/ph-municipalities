const path = require('path')
const prompt = require('../lib/prompt')
const PHExcel = require('../lib/ph_excelfile')

// Asks for a prompt to enter province names.
// Lists all municipalities under the specified provinces.
PHExcel.events.on(PHExcel.EVENTS.LOADED, async () => {
  let exit = false

  while (!exit) {
    // Prompt to ask for province name(s)
    const provinces = await prompt('\nEnter province names separated by comma: ')

    if (provinces) {
      // List the municipalities of a targets province(s)
      const municipalities = PHExcel.listMunicipalities({ provinces })
      console.log(municipalities)
    }

    // Prompt to write results to a JSON file
    const write = await prompt('\nWrite results to a JSON file? [n/Y]: ')

    if (write === 'Y') {
      const fileName = await prompt('\nEnter the JSON filename: ')
      const filePath = path.resolve(__dirname, '..', '..', fileName)

      PHExcel.writeMunicipalities({
        provinces,
        fileName: filePath
      })

      console.log(`JSON file created in ${filePath}`)
    }

    const ex = await prompt('\nExit? (Enter X to exit): ')
    exit = (ex === 'X')
  }

  console.log('Goodbye!')
  process.exit(0)
})
