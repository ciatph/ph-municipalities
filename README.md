## ph-municipalities

**ph-municipalities** have **npm scripts** that allow interactive querying of Philippines municipalities included in one or more provinces or from a whole region, with an option of writing them to JSON files from the command line.

It uses `/data/day1.xlsx` (downloaded and stored as of this 20220808) from PAGASA's [10-day weather forecast excel files](https://www.pagasa.dost.gov.ph/climate/climate-prediction/10-day-climate-forecast) as the data source.

Extracted municipalities are written in JSON files following the format:

```
{
    "metadata": {
        "source": "https://pubfiles.pagasa.dost.gov.ph/pagasaweb/files/climate/tendayweatheroutlook/day1.xlsx",
        "title": "List of PH Municipalities By Province and Region",
        "description": "This dataset generated with reference to the excel file contents from the source URL on 20220808.",
        "date_created": "Mon Aug 08 2022"
    },
    "data": {
        "Albay": ["Bacacay", "Camalig", ... ],
        "Camarines Norte": ["Basud", "Capalonga", ... ],
        "Camarines Sur": ["Baao", "Balatan", ... ],
         ...
    }
}
```

## Requirements

The following dependencies are used for this project. Feel free to use other dependency versions as needed.

1. Windows 10 OS
2. nvm for Windows v1.1.9
3. NodeJS, installed using nvm
   - node v16.14.2
   - npm v8.5.0
4. Excel file
   - At minimum, the excel file should have a **column** that contains municipality and province names following the pattern `"municipalityName (provinceName)"`
   - Checkout the excel file format on the `/data/day1.xlsx` sample file for more information
5. (Optional) Download URL for a remote excel file.
   - See the `EXCEL_FILE_URL` variable on the [Installation](#installation) section.

## Contents

- [ph-municipalities](#ph-municipalities)
- [Requirements](#requirements)
- [Contents](#contents)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
  - [`npm start` / `npm run list:region`](#npm-start--npm-run-listregion)
  - [`npm run list:province`](#npm-run-listprovince)
  - [`npm run example`](#npm-run-example)
  - [`build:win:region`](#buildwinregion)
  - [`build:win:province`](#buildwinprovince)
  - [`build:win:all`](#buildwinall)
  - [`npm run lint`](#npm-run-lint)
  - [`npm run lint:fix`](#npm-run-lintfix)
- [Class Usage](#class-usage)
  - [Load and Parse a Local Excel File](#load-and-parse-a-local-excel-file)
  - [Download and Parse a Remote Excel File](#download-and-parse-a-remote-excel-file)
  - [Alternate Usage - Events](#alternate-usage---events)
- [Building Standalone Windows Executables](#building-standalone-windows-executables)

## Installation

1. Clone this repository.<br>
`git clone https://github.com/ciatph/municipalities-by-province.git`

2. Install dependencies.<br>
`npm install`

3. Create a `.env` file from the `.env.example` file. Use the default values for `SHEETJS_COLUMN` and `EXCEL_FILE_URL`.

   | Variable Name  | Description                                                                                                                                                                                                                                                    |
   | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | EXCEL_FILE_URL | (Optional) Remote excel file's download URL.<br>If provided, the excel file will be downloaded and saved on the specified `pathToFile` local filesystem location during the `ExcelFile` class initialization.<br>Read on [Usage](#usage) for more information. |
   | SHEETJS_COLUMN | Column name read by [sheetjs](https://sheetjs.com/) in an excel file.<br>This column contains the municipality and province names following the string pattern<br>`"municipalityName (provinceName)"`<br>Default value is `__EMPTY`                            |

## Available Scripts

### `npm start` / `npm run list:region`

- Load and parse the local excel file in `/data/day1.xlsx`.
- Displays a list of available PH **region** names.
- Lists all provinces and municipalities of a specified region via commandline input.
- Asks for an option to write results to a JSON file.

### `npm run list:province`

- Load and parse the local excel file in `/data/day1.xlsx`.
- Lists all municipalities under specified province(s) via commandline input.
- Asks for an option to write results to a JSON file.

### `npm run example`

- Downloads and parses a remote excel file.
- Demonstrates sample usage with `await`

### `build:win:region`

- Package the Node.js project's `npm start` script into a stand-alone windows `node16-win-x64` executable.
- The windows executable file will be stored in `/dist/ph-regions-win.exe`. Click the executable file to run.

### `build:win:province`

- Package the Node.js project's `npm list:province` script into a stand-alone windows `node16-win-x64` executable.
- The windows executable file will be stored in `/dist/ph-provinces-win.exe`. Click the executable file to run.

### `build:win:all`

- Package the Node.js project's `npm start` and `npm list:province` script into a stand-alone windows `node16-win-x64` executables in one go.
- Each window executable file will be stored in the `/dist` directory.

### `npm run lint`

Lint JavaScript source codes.

### `npm run lint:fix`

Fix JavaScript lint errors.

## Class Usage

### Load and Parse a Local Excel File

```
const path = require('path')
const { ExcelFile } = require('./classes/excel')

// Reads an existing excel file on /data/day1.xlsx
file = new ExcelFile({
   pathToFile: path.join(__dirname, '..', 'data', 'day1.xlsx')
})

try {
   file.init()
} catch (err) {
   console.log(`[ERROR]: ${err.message}`)
}

// JSON data of the parsed excel file will be accessible on
// file.datalist
```

### Download and Parse a Remote Excel File

```
require('dotenv').config()
const path = require('path')
const { ExcelFile } = require('./classes/excel')

const main = async () => {
  // Excel file will be downloaded to /data/day1.xlsx
  file = new ExcelFile({
    pathToFile: path.join(__dirname, '..', 'data', 'day1.xlsx'),
    url: process.env.EXCEL_FILE_URL
  })

  try {
    await file.init()
  } catch (err) {
    console.log(err.message)
  }

  // JSON data of the parsed excel file will be accessible on
  // file.datalist
}

main()
```

### Alternate Usage - Events

Initialize an `ExcelFile` class instance.

```
require('dotenv').config()
const path = require('path')
const { ExcelFile } = require('./classes/excel')

const PHExcel = new ExcelFile({
  pathToFile: path.join(path.join(__dirname, '..', '..', 'data', 'day1.xlsx')),
  url: process.env.EXCEL_FILE_URL
})

PHExcel.init()
module.exports = PHExcel
```

Listen to the instance's `EVENTS.LOADED` event.

```
PHExcel.events.on(PHExcel.EVENTS.LOADED, async () => {
   console.log('Excel data loaded!')
})
```

## Building Standalone Windows Executables

The main npm scripts can be packaged into standalone windows executables.

1. Run any of the following scripts to build the programs.
   ```
   npm run build:win:region
   npm run build:win:province
   # npm run build:win:all
   ```
2. Click the resulting executable files in the `/dist` directory to execute.

@ciatph<br>
20220807