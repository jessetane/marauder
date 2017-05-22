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
      var nodeA = objects[object['node-a']]
      var nodeB = objects[object['node-b']]
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
  return geoJSON
}
