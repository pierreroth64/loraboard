// Simple script to gather LoRa frames from pubnub service
// decode them and display data on a single page

// developed with love by the SwAT team

// Data decoder for LoRaMote frames
class LoRaMoteDataDecoder {

	constructor(devName) {
		this.deviceName = devName;
	}

	decodePressure(raw) {
		var raw = raw.substr(2, 4);
		return {'raw': raw, 'value': parseInt(raw, 16) / 10, 'unit': 'hPa'};
	}

	decodeTemperature(raw) {
		var raw = raw.substr(6, 4);
		return {'raw': raw, 'value': parseInt(raw, 16) / 100, 'unit': '°C'};
	}

	decodeMeasuredAltitude(raw) {
		var raw = raw.substr(10, 4);
		return {'raw': raw, 'value': parseInt(raw, 16) / 10, 'unit': 'm'};
	}

	decodeAltitude(raw) {
		var raw = raw.substr(28, 4);
		return {'raw': raw, 'value': parseInt(raw, 16), 'unit': 'm'};
	}

  decodeBatteryLevel(raw) {
    var raw = raw.substr(14, 2);
    var value = parseInt(raw, 16);
    if (value == 0) {
      // connected to external source -> display 100%
      value = 100;
    } else if (value == 255) {
      // could not determine batt level -> display 0%
      value = 0;
    } else {
      value = (value * 100 / 254).toFixed(0);
    }
    return {'raw': raw, 'value': value, 'unit': '%'};
  }

	decodeLatitude(raw) {
		var raw = raw.substr(16, 6);
    var value = parseInt(raw, 16);
    value = value / (Math.pow(2, 23) - 1) * 90;
		return {'raw': raw, 'value': value, 'unit': '°'};
	}

	decodeLongitude(raw) {
		var raw = raw.substr(22, 6);
    var value = parseInt(raw, 16);
    //FIXME: properly decode longitude!
    value = value / (Math.pow(2, 23) - 1) * 180;
    value = value - 360;
    return {'raw': raw, 'value': value, 'unit': '°'};
	}

	decodeFull(raw) {
		return {
			'pressure': this.decodePressure(raw),
			'temperature': this.decodeTemperature(raw),
			'measured-altitude': this.decodeMeasuredAltitude(raw),
			'altitude': this.decodeAltitude(raw),
			'battery': this.decodeBatteryLevel(raw),
			'latitude': this.decodeLatitude(raw),
			'longitude': this.decodeLongitude(raw),
			}
	}

	decode(raw) {
		return {
			'pressure': this.decodePressure(raw).value,
			'temperature': this.decodeTemperature(raw).value,
			'measured-altitude': this.decodeMeasuredAltitude(raw).value,
			'altitude': this.decodeAltitude(raw).value,
			'battery': this.decodeBatteryLevel(raw).value,
			'latitude': this.decodeLatitude(raw).value,
			'longitude': this.decodeLongitude(raw).value,
			}
	}
}

// Constants

var TEMPERATURE_COLOR = '#c33e19';
var PRESSURE_COLOR = '#3c3029';
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
                    subscribe_key : 'sub-c-addd8e9e-b938-11e5-85eb-02ee2ddab7fe'
                });
var decoder = new LoRaMoteDataDecoder('LoRaMote');
var gpsMarker, map;
var tempChart, pressChart, batteryChart;

// Main script

initUI();
console.log('Startup of LoRa data gathering!');
console.log('Subscribing to pubnub to get data from', decoder.deviceName);
pubnubConn.subscribe({
  	channel : pubnubChannel,
  	message : function(message, env, ch, timer, magic_ch) {
				if (message.data) {
				  console.log(`LoRa frame #${message.fcnt}: ${message.data}`);
					console.log('Decoded data:', decoder.decode(message.data));
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
}

function refreshUI(message) {
  refreshTemperatureUI(message);
  refreshPressureUI(message);
  refreshBatteryUI(message);
  refreshMapUI(message);
}

/// MAP
function initMapUI() {
  L.mapbox.accessToken = 'pk.eyJ1IjoicGllcnJlcm90aCIsImEiOiJjaWpiaW5obW0wMDRydnVtMndmdWZ3M2IzIn0.7HhhhYZHCWnBM0ZiOsaT6Q';
  var initialPosition = [43.3188648, -0.3203877];
  gpsMarker = L.marker(initialPosition);
  map = L.mapbox.map('lora-map', 'mapbox.streets').setView(initialPosition, 15);
  gpsMarker.addTo(map);
}

function refreshMapUI(message) {
  var longitude = decoder.decodeLongitude(message.data).value;
  var latitude = decoder.decodeLatitude(message.data).value;
  var latlng = L.latLng(latitude, longitude);
  gpsMarker.setLatLng(latlng);
  map.panTo(latlng);
}

/// BATTERY LEVEL
function initBatteryUI() {
  batteryChart = c3.generate({
    bindto: '#batt-chart',
    data: {
        columns: [
            ['used', 100],
            ['remaining', 0],
        ],
        type : 'pie',
        colors: {
            used: BATT_USED_COLOR,
            remaining: BATT_REMAINING_COLOR
        },
    }
  });
}

function refreshBatteryUI(message) {
  var remaining = decoder.decodeBatteryLevel(message.data).value;
  batteryChart.load({
        columns: [
            ['used', 100 - remaining],
            ['remaining', remaining]
        ],
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
            pressure: PRESSURE_COLOR,
      },
    },
    axis: {
        y: {
            label: 'pressure (hPa)',
            max: MAX_PRESSURE,
            min: MIN_PRESSURE,
        }
    }
  });
}

function refreshPressureUI(message) {
  pressChart.flow({
        columns: [
            ['pressure', decoder.decodePressure(message.data).value]
        ],
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
            temperature: TEMPERATURE_COLOR,
      },
    },
    axis: {
        y: {
            label: 'temperature (°C)',
            max: MAX_TEMPERATURE,
            min: MIN_TEMPERATURE,
        }
    }
  });
}

function refreshTemperatureUI(message) {
  tempChart.flow({
        columns: [
            ['temperature', decoder.decodeTemperature(message.data).value]
        ],
  });
}
