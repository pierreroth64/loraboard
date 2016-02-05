
var MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicGllcnJlcm90aCIsImEiOiJjaWpiaW5obW0wMDRydnVtMndmdWZ3M2IzIn0.7HhhhYZHCWnBM0ZiOsaT6Q';

export class MapView extends Backbone.View {

  constructor(options) {
    super(options);
    this.initMap();
    this.listenTo(this.model, 'change', this.updatePosition);
  }

  initMap() {
      L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
      var initialPosition = [43.3188648, -0.3203877];
//      this.gpsMarker = L.marker(initialPosition);
//      this.gpsMarker.bindPopup(this.buildMarkerInfo(...initialPosition));
      this.map = L.mapbox.map('lora-map', 'mapbox.streets').setView(initialPosition, 15);
//      this.gpsMarker.addTo(this.map);

      var myLayer = L.mapbox.featureLayer().addTo(this.map);

      var geoJson = [{
          "type": "Feature",
          "geometry": {
              "type": "Point",
              "coordinates": [43.3188648, -0.3203877]
          },
          "properties": {
              "title": "Mote",
              "icon": {
                  "iconUrl": "/images/logo_lora2.png",
                  "iconSize": [50, 38], // size of the icon
                  "iconAnchor": [25, 19], // point of the icon which will correspond to marker's location
                  "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
                  "className": "dot"
              }
          }
      }];

      // Set a custom icon on each marker based on feature properties.
      myLayer.on('layeradd', function(e) {
          var marker = e.layer,
              feature = marker.feature;

          marker.setIcon(L.icon(feature.properties.icon));
      });

      // Add features to the map.
      myLayer.setGeoJSON(geoJson);
  }

  updatePosition() {
    var latitude = this.model.attributes.value.latitude;
    var longitude = this.model.attributes.value.longitude;
    var latlng = L.latLng(latitude, longitude);
    this.gpsMarker.setLatLng(latlng);
    this.gpsMarker.closePopup();
    this.gpsMarker.bindPopup(this.buildMarkerInfo(latitude, longitude));
    this.map.panTo(latlng);
  }

  buildMarkerInfo(latitude, longitude) {
    return `<strong>LoRaMote</strong><br>located at [${latitude}; ${longitude}]`;
  }
}
