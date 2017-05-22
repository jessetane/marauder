var http = require('http')
var fetchSpreadsheet = require('../fetch-spreadsheet')
var toGeoJSON = require('../to-geojson')
var toKML = require('../to-kml')

var server = new http.Server()

server.on('request', (req, res) => {
  fetchSpreadsheet(process.env.GOOGLE_SHEET, (err, objects) => {
    if (err) {
      res.statusCode = 500
      return res.end(err.message)
    }
    res.end(toKML(toGeoJSON(objects)))
  })
})

server.listen(process.env.PORT || 8080, err => {
  console.log('server listening on ' + server.address().port)
})
