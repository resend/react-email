let Processor = require('postcss/lib/processor')

let processResult = require('./process-result')
let parse = require('./parser')

module.exports = function (plugins) {
  let processor = new Processor(plugins)
  return input => {
    let result = processor.process(input, { parser: parse, from: undefined })
    return processResult(result)
  }
}
