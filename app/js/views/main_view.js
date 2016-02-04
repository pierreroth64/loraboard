import {MAPBOX_ACCESS_TOKEN} from '../constants/mapbox_const';

const MAP_INITIAL_POSITION = [45.824203, 1.277746];
const MAP_INITIAL_ZOOM = 2;
const DEVICE_DEFAULT_POSITION = MAP_INITIAL_POSITION;

export class MainView extends Backbone.View {

  constructor(options) {
    super(options);
    this.deviceMarkers = {};
    this.setElement('#main');
    this.currentPosition = MAP_INITIAL_POSITION;
    this.currentZoom = MAP_INITIAL_ZOOM;
    Backbone.Mediator.subscribe('device:updatePosition', this.onUpdatePosition, this);
  }

  initMap() {
      L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
      this.map = L.mapbox.map('lora-map', 'mapbox.streets').setView(this.currentPosition, this.currentZoom);
      this.map.on('zoomend', (e) => {
        this.currentZoom = this.map.getZoom();
      });
      this.map.on('dragend', (e) => {
        let center = this.map.getCenter()
        this.currentPosition = [center.lat, center.lng];
      });
  }

  initMarkers() {
    this.addDeviceMarker("1234", 45.824203, 1.277746);
    this.addDeviceMarker("5678", 45.824203, 1.278750);
  }

  addDeviceMarker(eui, latitude, longitude) {
    var marker = L.marker([latitude, longitude]);
    marker.bindPopup(`<strong>Device #${eui}</strong>`);
    marker.addTo(this.map);
    marker.on('dblclick', function(e) {
      Backbone.history.navigate(`devices/${eui}`, {trigger: true});
    });
    marker.on('click', function(e) {
      marker.openPopup();
    });
    this.deviceMarkers[eui] = marker;
    return marker;
  }

  render() {
    var html = `<div class="row">
        <div class="center-block">
        </div>
      </div>
      <div class="row">
        <div id="lora-map-box" class="col-md-12">
          <div id="lora-map" class="graph-box big-map-box"></div>
        </div>
      </div>
      </div>`;
    this.$el.html(html);
    this.initMap();
    this.initMarkers();
    return this;
  }

  validatePosition(position) {
    var {latitude, longitude} = position;
    if (isNaN(latitude) || latitude == undefined || isNaN(longitude) || longitude == undefined) {
      return DEVICE_DEFAULT_POSITION;
    } else {
      return [latitude, longitude];
    }
  }

  onUpdatePosition(eui, position) {
    position = this.validatePosition(position);
    var marker = this.deviceMarkers[eui];
    if (marker == undefined || marker == null) {
      marker = this.addDeviceMarker(eui, ...position);
    }
    marker.setLatLng(L.latLng(...position));
  }
}
