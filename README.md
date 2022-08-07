## municipalities-by-province

Extract the `municipalities` of a given `province` from an excel file and write them in a JSON file.

### Requirements

The following dependencies are used for this project. Feel free to use other dependency versions as needed.

1. Windows 10 OS
2. nvm for Windows v1.1.9
3. NodeJS, installed using nvm
   - node v16.14.2
   - npm v8.5.0

## Installation

1. Clone this repository.<br>
`git clone https://github.com/ciatph/municipalities-by-province.git`

2. Install dependencies.<br>
`npm install`

3. Create a `.env` file from the `.env.example` file. Use the default value for EXCEL_FILE_URL.

   | Variable Name  | Description                       |
   | -------------- | --------------------------------- |
   | EXCEL_FILE_URL | Remote excel file's download URL. |

## Usage

### Load and Parse a Local Excel File

```
const { ExcelFile } = require('./classes/excel')

file = new ExcelFile({
   pathToFile: path.resolve(__dirname, 'path', 'to', 'file.xlsx')
})

file.init()

// JSON data of the parsed excel file will be accessible on
// file.data
```

### Download and Parse a Remote Excel File

```
require('dotenv).config()
const { ExcelFile } = require('./classes/excel')

// Excel file will be downloaded to /path/to/file.xlsx
file = new ExcelFile({
   pathToFile: path.resolve(__dirname, 'path', 'to', 'file.xlsx'),
   url: process.env.EXCEL_FILE_URL
})

try {
   await file.init()
} catch (err) {
   console.log(err.message)
}

// JSON data of the parsed excel file will be accessible on
// file.data
```

## Available Scripts

### `npm start`

Load and parse a local excel file in the `/data` directory.

### `npm run lint`

Lint JavaScript source codes.

### `npm run lint:fix`

Fix JavaScript lint errors.

Run the main program.

@ciatph<br>
20220807