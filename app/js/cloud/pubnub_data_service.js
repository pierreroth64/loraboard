import {SettingsStorageAPI} from '../lib/storage';
import {DataService} from './data_service';

var PUBNUB_DEFAULT_CHANNEL = 'pubnub pierreroth';
var PUBNUB_DEFAULT_SUBSCRIBE_KEY = 'sub-c-addd8e9e-b938-11e5-85eb-02ee2ddab7fe';

export class PubNubDataService extends DataService  {

    constructor() {
        super("PubNub");
        this.resetConnection();
        Backbone.Mediator.subscribe('settings:new', this.onNewSettings, this);

        // Setting pubnub handlers with arrow functions makes 'this' available from them
        this.processData = (message, env, ch, timer, magicCh) => { this._processData(message); };
        this.onError = (error) => { this._onError(error); };
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

    _processData(data) {
        data = JSON.parse(data);
        super.onNewData(data);
    }

    _onError(error) {
        var errorMsg = JSON.stringify(error);
        console.log(`Network error on PubNub: ${errorMsg}`);
        super.onError(errorMsg);
    }

    onStart() {
        console.log(`Pubnub info > subscribeKey: '${this.currentSubscribeKey}', and channel:'${this.currentChannel}'`);
        try {
            this.pubnubConn.subscribe({
                    channel: this.currentChannel,
                    message: this.processData,
                    connect: this.onConnected,
                    disconnect: this.onDisconnected,
                    error: this.onError
                    });
        } catch (e) {
            var errorMsg = JSON.stringify(e);
            console.log(`Error when subscribing to PubNub: ${errorMsg}`);
            throw e;
        }
    }

    onStop() {
        this.pubnubConn.unsubscribe({
            channel: this.currentChannel
        });
    }

    onConnected() {
        console.log("Connected to PubNub");
    }

    onDisconnected() {
        console.log("Disconnected from PubNub");
    }
}
