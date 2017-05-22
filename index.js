var fetchSpreadsheet = require('./src/fetch-spreadsheet')
var toGeoJSON = require('./src/to-geojson')
var toKML = require('./src/to-kml')

fetchSpreadsheet(process.env.GOOGLE_SHEET, (err, objects) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(toKML(toGeoJSON(objects)))
})
