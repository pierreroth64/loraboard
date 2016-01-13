class DataDecoder {

	constructor(name) {
		this.name = name;	
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
var decoder = new DataDecoder("Lora decoder");
console.log("Subscribing to pubnub...");
pubnub.subscribe({                                     
  	channel : channel,
  	message : function(message, env, ch, timer, magic_ch){
  				if (message.data) {
  					console.log("LoRa raw data:", message.data);
  					console.log("Decoded data:", decoder.decodeFull(message.data));
  				}
			},
  	connect: connected
});

setTimeout(startGraph, 5000);

function connected() {
 	console.log("Connected to", channel, "channel");
}

function startGraph() {
 	console.log("Starting graph...");
 	eon.chart({
  		pubnub: pubnub,
  		channel: channel,
  		limit: 20,
  		flow: true,
  		generate: {
    		bindto: '#my-chart'
  		},
  		transform: function(m) {
  			if (m.data) {
  				var decoded = {
                	'eon': decoder.decode(m.data)
	    	    };
  				console.log("from chart transform:", decoded);
	    		return decoded;
	    	}
        }
	});
}

