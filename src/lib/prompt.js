const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

module.exports = (text) => new Promise(resolve => {
  rl.question(text, (input) => resolve(input))
})

rl.on('close', () => {
  process.exit(0)
})
