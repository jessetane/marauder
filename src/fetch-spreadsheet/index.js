module.exports = fetchSpreadsheet

var request = require('simple-get').concat
var queue = require('queue')

var fetching = false
var cbs = []
var objects = null

function fetchSpreadsheet (docId, _cb) {
  cbs.push(_cb)
  if (fetching) return
  fetching = true
  var url = `https://spreadsheets.google.com/feeds/worksheets/${docId}/public/full?alt=json`
  request(url, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      cb(new Error(err.message || body))
      return
    }
    try {
      body = JSON.parse(body)
    } catch (err) {
      cb(err)
      return
    }
    objects = {}
    var q = queue()
    body.feed.entry.forEach((sheet, i) => {
      q.push(cb => getSheet(docId, i + 1, sheet.title['$t'], cb))
    })
    q.start(err => {
      if (err) {
        cb(err)
        return
      }
      cb(null, objects)
    })
  })
}

function getSheet (docId, index, sheet, cb) {
  var url = `https://spreadsheets.google.com/feeds/list/${docId}/${index}/public/values?alt=json`
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

function cb () {
  fetching = false
  cbs.forEach(_cb => {
    _cb.apply(null, arguments)
  })
}
