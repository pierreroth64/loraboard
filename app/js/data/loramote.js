import {LoRaMoteDataDecoder} from './decoders/loramote_decoder';
import {SettingsStorageAPI} from '../lib/storage';

var PUBNUB_DEFAULT_CHANNEL = 'pubnub pierreroth';
var PUBNUB_DEFAULT_SUBSCRIBE_KEY = 'sub-c-addd8e9e-b938-11e5-85eb-02ee2ddab7fe';

export class LoRaMoteDataCollector  {

    constructor(models) {
        this.name = "LoRaMote data collector through PubNub service";
        this.models = models;
        this.resetConnection();
        this.decoder = new LoRaMoteDataDecoder();
        this.isStarted = undefined;
        Backbone.Mediator.subscribe('settings:new', this.onNewSettings, this);
        this.processData = (message, env, ch, timer, magicCh) => { this._processData(message); };
    }

    updateCredentials() {
        var api = new SettingsStorageAPI('pubnub');
        if (!api.hasStoredValue('subscribeKey')) {
            console.log('Pubnub credentials not set, using default ones.');
            api.store({
                        channel: PUBNUB_DEFAULT_CHANNEL,
                        subscribeKey: PUBNUB_DEFAULT_SUBSCRIBE_KEY
                      });
        }
        this.currentChannel = api.get('channel');
        this.currentSubscribeKey = api.get('subscribeKey');
    }

    createConnection() {
        this.pubnubConn = PUBNUB({
            subscribe_key: this.currentSubscribeKey
        });
    }

    resetConnection() {
        this.stop();
        this.updateCredentials();
        this.createConnection();
    }

    onNewSettings() {
        this.resetConnection();
        this.start();
    }

    _processData(message) {
        console.log("received data:", message);
        message = JSON.parse(message);
        if (message.data) {
            this.models.temp.set({value: this.decoder.decodeTemperature(message.data).value});
            this.models.press.set({value: this.decoder.decodePressure(message.data).value});
            this.models.batt.set({value: this.decoder.decodeBatteryLevel(message.data).value});
            this.models.position.set({value: {
                                                latitude: this.decoder.decodeLatitude(message.data).value,
                                                longitude: this.decoder.decodeLongitude(message.data).value
                                             }
                                     });
            var rawFrame = JSON.stringify(message);
            var decodedFrame = JSON.stringify(this.decoder.decode(message.data));
            Backbone.Mediator.publish('data:newFrame', rawFrame, decodedFrame);
        }
    }

    start() {
        console.log("Starting LoRa data gathering...");
        console.log(`Pubnub info > subscribeKey: '${this.currentSubscribeKey}', and channel:'${this.currentChannel}'`);
        try {
            this.pubnubConn.subscribe({
                    channel: this.currentChannel,
                    message: this.processData,
                    connect: this.onConnected,
                    disconnect: this.onDisconnected,
                    error: this.onError
                    });
            this.isStarted = true;
        } catch (e) {
            var errorMsg = JSON.stringify(e);
            console.log(`Error when subscribing to PubNub: ${errorMsg}`);
        }
    }

    stop() {
        if (this.isStarted) {
            console.log("Stopping LoRa data gathering...");
            this.pubnubConn.unsubscribe({
                channel: this.currentChannel
            });
            this.isStarted = false;
            console.log("Stopped LoRa data gathering.");
        }
    }

    onConnected() {
        console.log("Connected to PubNub");
        console.log("Started LoRa data gathering.");
    }

    onDisconnected() {
        console.log("Disconnected from PubNub");
    }

    onError(error) {
        var errorMsg = JSON.stringify(error);
        console.log(`Network error on PubNub: ${errorMsg}`);
    }
}
