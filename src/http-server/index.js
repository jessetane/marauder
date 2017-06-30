var http = require('http')
var fetchSpreadsheet = require('../fetch-spreadsheet')
var toGeoJSON = require('../to-geojson')
var toKML = require('../to-kml')

var server = new http.Server()

server.on('request', (req, res) => {
  // console.log(req.method + ' ' + req.url, req.headers)
  var pathname = req.url.split('?')[0]
  if (pathname !== '/') {
    res.statusCode = 404
    res.end('not found')
    return
  }
  fetchSpreadsheet(process.env.GOOGLE_SHEET, (err, objects) => {
    if (err) {
      res.statusCode = 500
      res.end(err.message)
      return
    }
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.end(toKML(toGeoJSON(objects)))
  })
})

server.listen(process.env.PORT || 8080, err => {
  if (err) throw err
  console.log('server listening on ' + server.address().port)
})
