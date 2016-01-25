// Data decoder for LoRaMote frames
class LoRaMoteDataDecoder {

    constructor() {
        this.deviceName = 'LoRaMote';
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

var PUBNUB_CHANNEL = 'pubnub pierreroth';
var PUBNUB_SUBSCRIBE_KEY = 'sub-c-addd8e9e-b938-11e5-85eb-02ee2ddab7fe';

export class LoRaMoteDataCollector  {

    constructor(models) {
        this.models = models;
        this.pubnubConn = PUBNUB({
                    subscribe_key: PUBNUB_SUBSCRIBE_KEY
        });
        this.decoder = new LoRaMoteDataDecoder();
    }

    start() {
        console.log("Starting LoRa data gathering...");
        this.pubnubConn.subscribe({
                channel: PUBNUB_CHANNEL,
                message: function(message, env, ch, timer, magicCh) {
                    if (message.data) {
                        //logData(`LoRa frame #${message.fcnt}: ${message.data} from: ${message.EUI}\nDecoded as:` + JSON.stringify(decoder.decode(message.data)));
                        this.models.temp.set({value: this.decoder.decodeTemperature(message.data).value});
                        this.models.press.set({value: this.decoder.decodePressure(message.data).value});
                        this.models.batt.set({value: this.decoder.decodeBatteryLevel(message.data).value});
                        this.models.position.set({value: JSON.stringify({
                                                        latitude: this.decoder.decodeLatitude(message.data).value,
                                                        longitude: this.decoder.decodeLongitude(message.data).value})
                                                });
                        Backbone.Mediator.publish('data:newFrame');
                    }
                },
                connect: this.connected
                });
    }

    stop() {
        console.log("Stopping LoRa data gathering...");
        this.pubnubConn.unsubscribe({
                channel: PUBNUB_CHANNEL
        });
    }

    connected() {
        console.log(`Connected to '${PUBNUB_CHANNEL}' channel`);
    }
}
