#!/usr/bin/env node

var db = require('./src/database')
var toKML = require('tokml')

db.on('change', () => {
  var geoJSON = {
    type: 'FeatureCollection',
    features: []
  }
  for (var id in db.objects) {
    var object = db.objects[id]
    if (object.sheet === 'nodes') {
      geoJSON.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            object.lng,
            object.lat,
            object.alt
          ]
        },
        properties: object
      })
    } else if (object.sheet === 'links') {
      var nodeA = db.objects[object['node-a']]
      var nodeB = db.objects[object['node-b']]
      geoJSON.features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [ nodeA.lng, nodeA.lat, nodeA.alt ],
            [ nodeB.lng, nodeB.lat, nodeB.alt ]
          ]
        },
        properties: object
      })
    }
  }
  // var json = JSON.stringify(geoJSON, null, 2)
  var kml = toKML(geoJSON)
  console.log(kml)
})
