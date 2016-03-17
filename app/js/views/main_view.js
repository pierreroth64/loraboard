import { BaseView } from './base_view';
import { isLegrandBuild } from '../lib/util';
import { isPositionValid, getRandomPosition, getDefaultPosition } from '../lib/gps';
import { MAPBOX_ACCESS_TOKEN } from '../constants/mapbox_const';
import { SettingsView } from './settings_view';

let MAP_INITIAL_POSITION = undefined;
let MAP_INITIAL_ZOOM = undefined;
let MAP_BOX_MAP = undefined;

if (isLegrandBuild()) {
  MAP_INITIAL_POSITION = [45.824399, 1.277633];
  MAP_INITIAL_ZOOM = 18;
  MAP_BOX_MAP = 'mapbox.satellite';
} else {
  MAP_INITIAL_POSITION = [45.824203, 1.277746];
  MAP_INITIAL_ZOOM = 2;
  MAP_BOX_MAP = 'mapbox.streets';
}

export class MainView extends BaseView {

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
    this.map = L.mapbox.map('global-lora-map', MAP_BOX_MAP).setView(this.currentPosition, this.currentZoom);
    L.control.scale().addTo(this.map);
    this.map.on('zoomend', (e) => {
      this.currentZoom = this.map.getZoom();
    });
    this.map.on('dragend', (e) => {
      const center = this.map.getCenter();
      this.currentPosition = [center.lat, center.lng];
    });
  }

  populateInitialMarkers() {
    if (isLegrandBuild()) {
      this.createDeviceMarker('1234', 'Gateway', { latitude: 45.824676,
                                                   longitude: 1.276448 });
      this.createDeviceMarker('4567', 'Meeting room', { latitude: 45.824710,
                                                        longitude: 1.276680 });
    }
  }

  updateMapcenter() {
    const bounds = [];
    if (this.map) {
      for (const eui in this.deviceMarkers) {
        if (this.deviceMarkers.hasOwnProperty(eui)) {
          const { marker } = this.deviceMarkers[eui];
          const { lat, lng } = marker.getLatLng();
          bounds.push([L.latLng(lat, lng)]);
        }
      }
      this.map.fitBounds(bounds);
    }
  }

  // As the map is recreated when rendering the view, the markers have to be recreated to
  updateMarkersOnMap() {
    const newMarkers = {};
    if (this.map) {
      for (const eui in this.deviceMarkers) {
        if (this.deviceMarkers.hasOwnProperty(eui)) {
          const { marker } = this.deviceMarkers[eui];
          const { lat, lng } = marker.getLatLng();
          this.map.removeLayer(marker);
          const newMarker = this.createDeviceMarker(eui, name, { latitude: lat, longitude: lng });
          newMarker.addTo(this.map);
          newMarkers[eui] = {};
          newMarkers[eui].marker = newMarker;
          newMarkers[eui].name = name;
        }
      }
      this.deviceMarkers = newMarkers;
    }
  }

  buildPopupForDevice(dev, name) {
    let popup;
    if (dev !== undefined) {
      const eui = dev.getEUI();
      popup = `<strong>${dev.getName()}</strong>`;
      // If device has control capabilities, display action buttons
      const capabilities = dev.getCapabilities();
      for (const cap in capabilities) {
        if (capabilities.hasOwnProperty(cap)) {
          const { action, actionLabel } = capabilities[cap];
          popup += `<br /><button type="button" id="trigger-${action}-${eui}" class="btn btn-sm btn-success">${actionLabel}</button>`;
          $('#global-lora-map').on('click', `#trigger-${action}-${eui}`, () => {
            this.deviceController.runActionOnDevice(eui, action);
          });
        }
      }
    } else {
      popup = `<strong>${name}</strong>`;
    }
    return popup;
  }

  createDeviceMarker(eui, name, position) {
    const dev = this.deviceManager.findDevice(eui);
    const { latitude, longitude } = position;
    const marker = L.marker([latitude, longitude]);
    marker.bindPopup(this.buildPopupForDevice(dev, name));
    if (dev !== undefined) { // only go to device page if device is defined
      marker.on('dblclick', (e) => {
        Backbone.history.navigate(`devices/${eui}`, { trigger: true });
      });
    }
    marker.on('click', (e) => {
      marker.openPopup();
    });

    if (this.map) {
      marker.addTo(this.map);
    }

    this.deviceMarkers[eui] = {};
    this.deviceMarkers[eui].marker = marker;
    this.deviceMarkers[eui].name = name;

    return marker;
  }

  render() {
    const html = `
      <div class="row">
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

  onUpdatePosition(eui, name, position) {
    let marker = undefined;
    let validatedPos = position;
    if (isPositionValid(position) === false) {
      validatedPos = getRandomPosition(getDefaultPosition());
    }

    if (this.deviceMarkers[eui] && this.deviceMarkers[eui].marker) {
      marker = this.deviceMarkers[eui].marker;
    } else {
      marker = this.createDeviceMarker(eui, name, validatedPos);
    }
    marker.setLatLng(L.latLng(validatedPos.latitude, validatedPos.longitude));
    // FIXME: an UI button should be provided to the the user
    // to disable the autofocus
    // this.updateMapcenter();
  }
}

