let Processor = require('postcss/lib/processor')

let processResult = require('./process-result')
let parse = require('./parser')

module.exports = function async(plugins) {
  let processor = new Processor(plugins)
  return async input => {
    let result = await processor.process(input, {
      parser: parse,
      from: undefined
    })
    return processResult(result)
  }
}
