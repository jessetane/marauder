var Emitter = require('events')
var request = require('simple-get').concat
var queue = require('queue')
var fs = require('fs')

var objects = null
try {
  objects = JSON.parse(fs.readFileSync(__dirname + '/cache.json'))
} catch (err) {
  objects = {}
}

module.exports = new Emitter()
module.exports.objects = objects
module.exports.fetch = getSheets
getSheets()

function getSheets () {
  var url = `https://spreadsheets.google.com/feeds/worksheets/${process.env.GOOGLE_SHEET}/public/full?alt=json`
  request(url, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      console.error(err.message || body)
      return
    }
    try {
      body = JSON.parse(body)
    } catch (err) {
      console.error('failed to list sheets', err)
      return
    }
    objects = {}
    var q = queue()
    body.feed.entry.forEach((sheet, i) => {
      q.push(cb => getSheet(i + 1, sheet.title['$t'], cb))
    })
    q.start(err => {
      if (err) {
        console.error(err)
        return
      }
      var json = JSON.stringify(objects, null, 2)
      fs.writeFile(__dirname + '/cache.json', json, err => {
        if (err) console.error('failed to persist cache')
      })
      module.exports.objects = objects
      module.exports.emit('change')
    })
  })
}

function getSheet (index, sheet, cb) {
  var url = `https://spreadsheets.google.com/feeds/list/${process.env.GOOGLE_SHEET}/${index}/public/values?alt=json`
  request(url, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      cb(err || new Error(body))
      return
    }
    try {
      body = JSON.parse(body)
    } catch (err) {
      cb(err)
      return
    }
    body.feed.entry.forEach((row, i) => {
      var object = { sheet }
      for (var key in row) {
        if (/^gsx/.test(key)) {
          var value = row[key].$t
          if (value.indexOf('https://drive.google.com/open') === 0) {
            value = parseUrl(value, true).query
            value = value ? value.id : ''
            value = {
              id: value,
              url: `https://docs.google.com/uc?authuser=0&export=download&id=${value}`
            }
          }
          object[key.slice(4)] = value
        }
      }
      if (!object.id) {
        object.id = `${sheet}-${i}`
      }
      objects[object.id] = object
    })
    cb()
  })
}
