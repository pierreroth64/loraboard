
var MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicGllcnJlcm90aCIsImEiOiJjaWpiaW5obW0wMDRydnVtMndmdWZ3M2IzIn0.7HhhhYZHCWnBM0ZiOsaT6Q';

export class MapView extends Backbone.View {

  constructor(options) {
    super(options);
    this.initMap();
    this.listenTo(this.model, 'change', this.updatePosition);
  }

  render() {
    return this;
  }

  initMap() {
      L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
      var initialPosition = [43.3188648, -0.3203877];
      this.gpsMarker = L.marker(initialPosition);
      this.gpsMarker.bindPopup(this.buildMarkerInfo(...initialPosition));
      this.map = L.mapbox.map('lora-map', 'mapbox.streets').setView(initialPosition, 15);
      this.gpsMarker.addTo(this.map);
  }

  updatePosition() {
    var value = this.model.attributes.value.toJSON();
    var latitude = value.latitude;
    var longitude = value.longitude;
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
