// Simple script to gather LoRa frames from pubnub service
// decode them and display data on a single page

// developed with love by the SwAT team

'use strict';

/* global c3, L, PUBNUB */

// Data decoder for LoRaMote frames
class LoRaMoteDataDecoder {

	constructor(devName) {
		this.deviceName = devName;
	}

	decodePressure(frame) {
		var raw = frame.substr(2, 4);
		return {'raw': raw, 'value': parseInt(raw, 16) / 10, 'unit': 'hPa'};
	}

	decodeTemperature(frame) {
		var raw = frame.substr(6, 4);
		return {'raw': raw, 'value': parseInt(raw, 16) / 100, 'unit': '°C'};
	}

	decodeMeasuredAltitude(frame) {
		var raw = frame.substr(10, 4);
		return {'raw': raw, 'value': parseInt(raw, 16) / 10, 'unit': 'm'};
	}

	decodeAltitude(frame) {
		var raw = frame.substr(28, 4);
		return {'raw': raw, 'value': parseInt(raw, 16), 'unit': 'm'};
	}

  decodeBatteryLevel(frame) {
    var raw = frame.substr(14, 2);
    var value = parseInt(raw, 16);
    if (value === 0) {
      // connected to external source -> display 100%
      value = 100;
    } else if (value === 255) {
      // could not determine batt level -> display 0%
      value = 0;
    } else {
      value = (value * 100 / 254).toFixed(0);
    }
    return {'raw': raw, 'value': value, 'unit': '%'};
  }

	decodeLatitude(frame) {
		var raw = frame.substr(16, 6);
    var value = parseInt(raw, 16);
    value = value / (Math.pow(2, 23) - 1) * 90;
		return {'raw': raw, 'value': value, 'unit': '°'};
	}

	decodeLongitude(frame) {
		var raw = frame.substr(22, 6);
    var value = parseInt(raw, 16);
    //FIXME: properly decode longitude!
    value = value / (Math.pow(2, 23) - 1) * 180;
    value = value - 360;
    return {'raw': raw, 'value': value, 'unit': '°'};
	}

	decodeFull(frame) {
		return {
			'pressure': this.decodePressure(frame),
			'temperature': this.decodeTemperature(frame),
			'measured-altitude': this.decodeMeasuredAltitude(frame),
			'altitude': this.decodeAltitude(frame),
			'battery': this.decodeBatteryLevel(frame),
			'latitude': this.decodeLatitude(frame),
			'longitude': this.decodeLongitude(frame)
			};
	}

	decode(frame) {
		return {
			'pressure': this.decodePressure(frame).value,
			'temperature': this.decodeTemperature(frame).value,
			'measured-altitude': this.decodeMeasuredAltitude(frame).value,
			'altitude': this.decodeAltitude(frame).value,
			'battery': this.decodeBatteryLevel(frame).value,
			'latitude': this.decodeLatitude(frame).value,
			'longitude': this.decodeLongitude(frame).value
			};
	}
}

// Constants

var TEMPERATURE_COLOR = '#c40079';
var PRESSURE_COLOR = '#f5d304';
var BATT_USED_COLOR = '#9b1889';
var BATT_REMAINING_COLOR = '#d67b19';
var INITIAL_PRESSURES = [800, 800, 800, 800, 800, 800, 800, 800];
var INITIAL_TEMPERATURES = [0, 0, 0, 0, 0, 0, 0, 0];
var MAX_TEMPERATURE = 50;
var MIN_TEMPERATURE = 0;
var MAX_PRESSURE = 1100;
var MIN_PRESSURE = 800;

// Globals

var pubnubChannel = 'pubnub pierreroth';
var pubnubConn = PUBNUB({
                    subscribe_key: 'sub-c-addd8e9e-b938-11e5-85eb-02ee2ddab7fe'
                });
var decoder = new LoRaMoteDataDecoder('LoRaMote');
var gpsMarker, map;
var tempChart, pressChart, batteryChart;

// Main script

initUI();
console.log('Startup of LoRa data gathering!');
console.log('Subscribing to pubnub to get data from', decoder.deviceName);
pubnubConn.subscribe({
  channel: pubnubChannel,
  message: function(message, env, ch, timer, magicCh) {
				if (message.data) {
          logData(`LoRa frame #${message.fcnt}: ${message.data}`)
          logData('Decoded as:' + JSON.stringify(decoder.decode(message.data)), true);
          refreshUI(message);
				}
	},
  connect: connected
});

// Routines

function connected() {
  console.log(`Connected to '${pubnubChannel}' channel`);
}

function initUI() {
  initTemperatureUI();
  initPressureUI();
  initBatteryUI();
  initMapUI();
  initLogsUI();
}

function refreshUI(message) {
  refreshTemperatureUI(message);
  refreshPressureUI(message);
  refreshBatteryUI(message);
  refreshMapUI(message);
  refreshFrameIndicatorUI();
}

/// LOGS
function initLogsUI() {
  $('#realtime-button').click(function() {
      $('#realtime-window').toggle("slow");
  });
}

function logData(message, eol) {
  console.log(message);
  logToScreen(message + (eol ? '\n': ''));
}

function logToScreen(message) {
  $('#realtime-window').append(message + '\n');
}

/// MAP
function initMapUI() {
  L.mapbox.accessToken = 'pk.eyJ1IjoicGllcnJlcm90aCIsImEiOiJjaWpiaW5obW0wMDRydnVtMndmdWZ3M2IzIn0.7HhhhYZHCWnBM0ZiOsaT6Q';
  var initialPosition = [43.3188648, -0.3203877];
  gpsMarker = L.marker(initialPosition);
  gpsMarker.bindPopup(buildMarkerInfo(...initialPosition));
  map = L.mapbox.map('lora-map', 'mapbox.streets').setView(initialPosition, 15);
  gpsMarker.addTo(map);
}

function buildMarkerInfo(latitude, longitude) {
  return `<strong>LoRaMote</strong><br>located at [${latitude}; ${longitude}]`;
}

function refreshMapUI(message) {
  var longitude = decoder.decodeLongitude(message.data).value;
  var latitude = decoder.decodeLatitude(message.data).value;
  var latlng = L.latLng(latitude, longitude);
  gpsMarker.setLatLng(latlng);
  gpsMarker.closePopup();
  gpsMarker.bindPopup(buildMarkerInfo(latitude, longitude));
  map.panTo(latlng);
}

/// BATTERY LEVEL
function initBatteryUI() {
  batteryChart = c3.generate({
    bindto: '#batt-chart',
    data: {
        columns: [
            ['used', 100],
            ['remaining', 0]
        ],
        type: 'pie',
        colors: {
            used: BATT_USED_COLOR,
            remaining: BATT_REMAINING_COLOR
        }
    }
  });
}

function refreshBatteryUI(message) {
  var remaining = decoder.decodeBatteryLevel(message.data).value;
  batteryChart.load({
        columns: [
            ['used', 100 - remaining],
            ['remaining', remaining]
        ]
  });
}

/// PRESSURE
function initPressureUI() {
  pressChart = c3.generate({
    bindto: '#press-chart',
    data: {
      columns: [
        ['pressure', ...INITIAL_PRESSURES]
      ],
      type: 'area-spline',
      colors: {
            pressure: PRESSURE_COLOR
      }
    },
    axis: {
        y: {
            label: 'pressure (hPa)',
            max: MAX_PRESSURE,
            min: MIN_PRESSURE
        }
    }
  });
}

function refreshPressureUI(message) {
  pressChart.flow({
        columns: [
            ['pressure', decoder.decodePressure(message.data).value]
        ]
  });
}

/// TEMPERATURE
function initTemperatureUI() {
  tempChart = c3.generate({
    bindto: '#temp-chart',
    data: {
      columns: [
        ['temperature', ...INITIAL_TEMPERATURES]
      ],
      type: 'area-spline',
      colors: {
            temperature: TEMPERATURE_COLOR
      }
    },
    axis: {
        y: {
            label: 'temperature (°C)',
            max: MAX_TEMPERATURE,
            min: MIN_TEMPERATURE
        }
    }
  });
}

function refreshTemperatureUI(message) {
  tempChart.flow({
        columns: [
            ['temperature', decoder.decodeTemperature(message.data).value]
        ]
  });
}

// FRAME INDICATOR
function refreshFrameIndicatorUI() {
  var animationClass = 'animated fadeIn';
  $('#frame-indicator').show();
  $('#frame-indicator').addClass(animationClass);
  $('#frame-indicator').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
    $('#frame-indicator').removeClass(animationClass);
    $('#frame-indicator').hide();
  });
}
