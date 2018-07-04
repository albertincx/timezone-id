var tz = require('../lib/tz')
var path = require('path'),
  assert = require('assert'),
  inspect = require('util').inspect

var group = path.basename(__filename, '.js') + '/';
[
  {data: '', expected: ''},
  {data: 'Moscow', expected: 'Europe/Moscow'},
  {data: 'istanbul', expected: 'Europe/Istanbul'},
  {data: [55.755814,37.617635], timestamp: 123123, expected: 'Asia/Tehran'}

].forEach(async function (v) {
  var result = await tz.getTimeZone(v.data),
    msg = '[' + group + ']: output mismatch.\n'
      + 'Saw: ' + inspect(result) + '\n'
      + 'Expected: ' + inspect(v.expected)
  assert.deepEqual(result, v.expected, msg)
})