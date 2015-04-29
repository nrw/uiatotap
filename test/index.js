var test = require('tape')
var concat = require('concat-stream')
var fs = require('fs')

var Filter = require('..')
var filter

test('topic', function (t) {
  filter = Filter()

  filter.pipe(concat(function (data) {
    t.equal(data.toString(), [
      'TAP version 13',
      '# Add Single Waltz Template',
      '',
      '1..0',
      '# tests 0',
      '# pass  0',
      '',
      '# ok',
      '',
      ''
    ].join('\n'))
    t.end()
  }))
  filter.end('2015-04-29 19:11:39 +0000 Start: Add Single Waltz Template')
})

test('pass and fail', function (t) {
  filter = Filter()

  filter.pipe(concat(function (data) {
    t.equal(data.toString(), [
      'TAP version 13',
      '# Add Single Waltz Template',
      'ok 1 correct title',
      'not ok 2 correct duration display',
      '',
      '1..2',
      '# tests 2',
      '# pass  1',
      '',
      '# fail  1',
      '',
      ''
    ].join('\n'))
    t.end()
  }))
  filter.write('2015-04-29 19:11:39 +0000 Start: Add Single Waltz Template\n'+
    '2015-04-29 19:11:45 +0000 Pass: correct title\n')
  filter.end('2015-04-29 19:11:50 +0000 Fail: correct duration display')
})

test('pass and fail', function (t) {
  filter = Filter()

  filter.pipe(concat(function (data) {
    t.equal(data.toString(), fs.readFileSync(__dirname + '/output.txt', 'utf8'))
    t.end()
  }))

  filter.end(fs.readFileSync(__dirname + '/data.txt', 'utf8'))
})
