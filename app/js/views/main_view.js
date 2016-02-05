import {MAPBOX_ACCESS_TOKEN} from '../constants/mapbox_const';
import {SettingsView} from "./settings_view";

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
    this.settingsView = new SettingsView();
    this.populateInitialMarkers();
  }

  initMap() {
    L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
    this.map = L.mapbox.map('global-lora-map', 'mapbox.streets').setView(this.currentPosition, this.currentZoom);
    L.control.scale().addTo(this.map);
    this.map.on('zoomend', (e) => {
      this.currentZoom = this.map.getZoom();
    });
    this.map.on('dragend', (e) => {
      let center = this.map.getCenter()
      this.currentPosition = [center.lat, center.lng];
    });
  }

  populateInitialMarkers() {
    /*this.createDeviceMarker("1234", 45.824203, 1.277746);
    this.createDeviceMarker("5678", 45.824203, 1.278750);*/
  }

  // As the map is recreated when rendering the view, the markers have to be recreated to
  updateMarkersOnMap() {
    var newMarkers = {};
    for (let eui in this.deviceMarkers) {
      let {marker, name} = this.deviceMarkers[eui];
      let {lat, lng} = marker.getLatLng();
      this.map.removeLayer(marker);
      let newMarker = this.createDeviceMarker(eui, name, lat, lng);
      newMarker.addTo(this.map);
      newMarkers[eui] = {};
      newMarkers[eui].marker = newMarker;
      newMarkers[eui].name = name;
    }
    this.deviceMarkers = newMarkers;
  }

  createDeviceMarker(eui, name, latitude, longitude) {
    var marker = L.marker([latitude, longitude]);
    marker.bindPopup(`<strong>${name}</strong>`);
    marker.on('dblclick', function(e) {
      Backbone.history.navigate(`devices/${eui}`, {trigger: true});
    });
    marker.on('click', function(e) {
      marker.openPopup();
    });
    this.deviceMarkers[eui] = {};
    this.deviceMarkers[eui].marker = marker;
    this.deviceMarkers[eui].name = name;
    return marker;
  }

  render() {
    var html = `<div class="row">
        <div class="center-block">
        </div>
      </div>
      <div class="row">
        <div id="global-lora-map-box" class="col-md-12">
          <div id="global-lora-map" class="graph-box big-map-box"></div>
        </div>
      </div>
      </div>`;
    this.$el.html(html);
    this.settingsView.render();
    this.initMap();
    this.updateMarkersOnMap();
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

  onUpdatePosition(eui, name, position) {
    position = this.validatePosition(position);
    var marker = undefined;
    if (this.deviceMarkers[eui] && this.deviceMarkers[eui].marker) {
      marker = this.deviceMarkers[eui].marker;
    } else {
      marker = this.createDeviceMarker(eui, name, ...position);
    }
    marker.setLatLng(L.latLng(...position));
    this.updateMarkersOnMap();
  }
}
