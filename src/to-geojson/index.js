module.exports = toGeoJSON

function toGeoJSON (objects) {
  var geoJSON = {
    type: 'FeatureCollection',
    features: []
  }
  for (var id in objects) {
    var object = objects[id]
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
      var upstream = objects[object['upstream']]
      var downstream = objects[object['downstream']]
      geoJSON.features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [ upstream.lng, upstream.lat, upstream.alt ],
            [ downstream.lng, downstream.lat, downstream.alt ]
          ]
        },
        properties: Object.assign(object, {
          fill: '#000000',
          'fill-opacity': 0.35
        })
      })
    }
  }
  return geoJSON
}
