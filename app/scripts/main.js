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

console.log('Startup of LoRa data gathering!');

var channel = "pubnub pierreroth";
var pubnub = PUBNUB({
              subscribe_key : 'sub-c-addd8e9e-b938-11e5-85eb-02ee2ddab7fe'
        });
var decoder = new LoRaMoteDataDecoder("LoRaMote");

//FIXME - update UI with current LoRa device
$('#current-lora-device').text(decoder.deviceName);
console.log($('#current-lora-device'));

console.log("Subscribing to pubnub to get data from", decoder.deviceName);
pubnub.subscribe({
  	channel : channel,
  	message : function(message, env, ch, timer, magic_ch){
  				if (message.data) {
  					console.log("LoRa raw data:", message.data);
  					console.log("Decoded data:", decoder.decodeFull(message.data));
  					tempAndPressureChart.flow({
  												columns: [
    												['pressure', decoder.decodePressure(message.data).value],
    												['temperature', decoder.decodeTemperature(message.data).value]
  												],
					});
  				}
			},
  	connect: connected
});

var tempAndPressureChart = c3.generate({
    bindto: '#my-chart',
    data: {
      columns: [
        ['pressure', 800, 800, 800, 800, 800],
        ['temperature', 0, 0, 0, 0, 0]
      ],
      axes: {
        temperature: 'y2'
      },
      type: 'spline'
    },
    axis: {
        x: {
            label: 'time'
        },
        y: {
            label: 'pressure',
            max: 1100,
            min: 800,
        },
        y2: {
            show: true,
            label: 'temperature',
            max: 50,
            min: -10,
        }
    }
});


function connected() {
 	console.log("Connected to", channel, "channel");
}

