import {MAPBOX_ACCESS_TOKEN} from '../constants/mapbox_const';

export class MapView extends Backbone.View {

  constructor(options) {
    super(options);
    this.initMap();
    this.listenTo(this.model, 'change', this.updatePosition);
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
