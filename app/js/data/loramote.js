import {LoRaMoteDataDecoder} from './decoders/loramote_decoder';

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
                        this.models.temp.set({value: this.decoder.decodeTemperature(message.data).value});
                        this.models.press.set({value: this.decoder.decodePressure(message.data).value});
                        this.models.batt.set({value: this.decoder.decodeBatteryLevel(message.data).value});
                        this.models.position.set({value: JSON.stringify({
                                                        latitude: this.decoder.decodeLatitude(message.data).value,
                                                        longitude: this.decoder.decodeLongitude(message.data).value})
                                                });
                        var rawFrame = JSON.stringify(message);
                        var decodedFrame = JSON.stringify(this.decoder.decode(message.data));
                        Backbone.Mediator.publish('data:newFrame', rawFrame, decodedFrame);
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
