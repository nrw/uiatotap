var through2 = require('through2')
var split = require('split')
var combine = require('stream-combiner')

module.exports = Filter

function Filter (options) {
  options = options || {}
  options.debug = options.debug || false
  options.verbose = options.verbose || false

  var total = 0
  var failed = 0
  var first = true
  var message

  return combine(split('\n'), through2(
    function (chunk, enc, cb) {
      if (first) {
        this.push('TAP version 13\n')
        first = false
      }

      var str = chunk.toString('utf8')
      var line

      if ((message = pullMessage(str, ' Start: '))) {
        this.push('# ' + message + '\n')
      } else if ((message = pullMessage(str, ' Pass: '))) {
        total++
        this.push('ok ' + total + ' ' + message + '\n')
      } else if ((message = pullMessage(str, ' Fail: '))) {
        total++
        failed++
        this.push('not ok ' + total + ' ' + message + '\n')
      } else if ((message = pullMessage(str, ' Debug: '))) {
        if (options.debug) {
          this.push(message + '\n')
        }
      } else {
        if (options.verbose) {
          this.push(str + '\n')
        }
      }

      cb()
    },
    function (cb) {
      this.push('\n')
      this.push('1..' + total + '\n')
      this.push('# tests ' + total + '\n')
      this.push('# pass  ' + (total - failed))
      this.push('\n\n')
      this.push(failed ? '# fail  ' + failed : '# ok')
      this.push('\n\n')

      process.on('exit', function () {
        process.exit(failed ? 1 : 0)
      })

      cb()
    }
  ))
}

function pullMessage (str, pivot) {
  if (RegExp(pivot).test(str)) {
    return str.split(pivot)[1]
  }
}
