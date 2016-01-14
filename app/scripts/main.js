class LoRaMoteDataDecoder {

	constructor(devName) {
		this.deviceName = devName;
	}

	decodePressure(raw) {
		var raw = raw.substr(2, 4);
		return {'raw': raw, 'value': parseInt(raw, 16) / 10, "unit": "hPa"};
	}

	decodeTemperature(raw) {
		var raw = raw.substr(6, 4);
		return {'raw': raw, 'value': parseInt(raw, 16) / 100, "unit": "°C"};
	}

	decodeMeasuredAltitude(raw) {
		var raw = raw.substr(10, 4);
		return {'raw': raw, 'value': parseInt(raw, 16) / 10, "unit": "m"};
	}

	decodeAltitude(raw) {
		var raw = raw.substr(28, 4);
		return {'raw': raw, 'value': parseInt(raw, 16), "unit": "m"};
	}

	decodeBatteryLevel(raw) {
		var raw = raw.substr(14, 2);
		var value = parseInt(raw, 16);
		if (value == 0)
			value = "external power";
		return {'raw': raw, 'value': value, "unit": ""};
	}

	decodeLatitude(raw) {
		var raw = raw.substr(16, 6);
		return {'raw': raw, 'value': parseInt(raw, 16), "unit": "°"};
	}

	decodeLongitude(raw) {
		var raw = raw.substr(22, 6);
		return {'raw': raw, 'value': parseInt(raw, 16), "unit": "°"};
	}

	decodeFull(raw) {
		return {
			"pressure": this.decodePressure(raw),
			"temperature": this.decodeTemperature(raw),
			"measured-altitude": this.decodeMeasuredAltitude(raw),
			"altitude": this.decodeAltitude(raw),
			"battery": this.decodeBatteryLevel(raw),
			"latitude": this.decodeLatitude(raw),
			"longitude": this.decodeLongitude(raw),
			}
	}

	decode(raw) {
		return {
			"pressure": this.decodePressure(raw).value,
			"temperature": this.decodeTemperature(raw).value,
			"measured-altitude": this.decodeMeasuredAltitude(raw).value,
			"altitude": this.decodeAltitude(raw).value,
			"battery": this.decodeBatteryLevel(raw).value,
			"latitude": this.decodeLatitude(raw).value,
			"longitude": this.decodeLongitude(raw).value,
			}
	}
}



var TEMPERATURE_COLOR = '#c33e19';
var PRESSURE_COLOR = '#3c3029';

var channel = "pubnub pierreroth";
var pubnub = PUBNUB({
              subscribe_key : 'sub-c-addd8e9e-b938-11e5-85eb-02ee2ddab7fe'
        });
var decoder = new LoRaMoteDataDecoder("LoRaMote");

console.log('Startup of LoRa data gathering!');
console.log("Subscribing to pubnub to get data from", decoder.deviceName);
pubnub.subscribe({
  	channel : channel,
  	message : function(message, env, ch, timer, magic_ch){
  				if (message.data) {
  					console.log("LoRa raw data:", message.data);
  					console.log("Decoded data:", decoder.decodeFull(message.data));
  					tempAndPressureLineChart.flow({
  												columns: [
    												['pressure', decoder.decodePressure(message.data).value],
    												['temperature', decoder.decodeTemperature(message.data).value]
  												],
					});
                    tempBarChart.load({
                                                columns: [
                                                    ['temperature', decoder.decodeTemperature(message.data).value]
                                                ],
                    });
                    pressBarChart.load({
                                                columns: [
                                                    ['pressure', decoder.decodePressure(message.data).value]
                                                ],
                    });
  				}
			},
  	connect: connected
});

var tempAndPressureLineChart = c3.generate({
    bindto: '#temp-press-line-chart',
    data: {
      columns: [
        ['pressure', 800, 800, 800, 800, 800],
        ['temperature', 0, 0, 0, 0, 0]
      ],
      axes: {
        temperature: 'y2'
      },
      type: 'spline',
      colors: {
            pressure: PRESSURE_COLOR,
            temperature: TEMPERATURE_COLOR,
      },
      color: function (color, d) {
            // d will be 'id' when called for legends
            return d.id && d.id === 'temperature' ? d3.rgb(color).darker(d.value / 150) : color;
      }
    },
    axis: {
        x: {
            label: 'sample #'
        },
        y: {
            label: 'pressure (hPa)',
            max: 1100,
            min: 800,
        },
        y2: {
            show: true,
            label: 'temperature (°C)',
            max: 50,
            min: -10,
        }
    }
});

var tempBarChart = c3.generate({
    bindto: '#temp-bar-chart',
    data: {
      columns: [
        ['temperature', 0]
      ],
      type: 'bar',
      colors: {
            temperature: TEMPERATURE_COLOR,
      },
    },
    axis: {
        y: {
            label: 'temperature (°C)',
            max: 50,
            min: 0,
        }
    }
});

var pressBarChart = c3.generate({
    bindto: '#press-bar-chart',
    data: {
      columns: [
        ['pressure', 0]
      ],
      type: 'bar',
      colors: {
            pressure: PRESSURE_COLOR,
      },
    },
    axis: {
        y: {
            label: 'pressure (hPa)',
            max: 1100,
            min: 800,
        }
    }
});

function connected() {
 	console.log("Connected to", channel, "channel");
}


