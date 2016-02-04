import {SettingsStorageAPI} from '../lib/storage';
import {DataService} from './data_service';
import * as pubnubCreds from '../constants/pubnub_const';

export class PubNubDataService extends DataService  {

    constructor(deviceManager) {
        super('PubNub', deviceManager);
        this.resetConnection();
        Backbone.Mediator.subscribe('settings:new', this.onNewSettings, this);

        // Setting pubnub handlers with arrow functions makes 'this' available from them
        this.processReceivedData = (message, env, ch, timer, magicCh) => { this._processReceivedData(message); };
        this.onError = (error) => { this._onError(error); };
    }

    updateCredentials() {
        var api = new SettingsStorageAPI('pubnub');
        if (!api.hasStoredValue('publishKey') || !api.hasStoredValue('subscribeKey')) {
            console.log('Pubnub credentials not set, using default ones.');
            api.store({
                        downStreamChannel: pubnubCreds.PUBNUB_DEFAULT_DOWNSTREAM_CHANNEL,
                        upStreamChannel: pubnubCreds.PUBNUB_DEFAULT_UPSTREAM_CHANNEL,
                        subscribeKey: pubnubCreds.PUBNUB_DEFAULT_SUBSCRIBE_KEY,
                        publishKey: pubnubCreds.PUBNUB_DEFAULT_PUBLISH_KEY
                      });
        }
        this.creds = {}
        this.creds.currentSubscribeKey = api.get('subscribeKey');
        this.creds.currentPublishKey = api.get('publishKey');
        this.creds.currentUpChannel = api.get('upStreamChannel');
        this.creds.currentDownChannel = api.get('downStreamChannel');
    }

    createConnection() {
        this.pubnubConn = PUBNUB({
            subscribe_key: this.creds.currentSubscribeKey,
            publish_key: this.creds.currentPublishKey
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

    _processReceivedData(data) {
        super.onNewData(data);
    }

    _onError(error) {
        var errorMsg = JSON.stringify(error);
        console.log(`Network error on PubNub: ${errorMsg}`);
        super.onError(errorMsg);
    }

    onStart() {
        console.log('Pubnub info:', this.creds);
        try {
            this.pubnubConn.subscribe({
                    channel: this.creds.currentUpChannel,
                    message: this.processReceivedData,
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
            channel: this.creds.currentDownChannel
        });
    }

    onSendData(data) {
        this.pubnubConn.publish({
            channel : this.creds.currentDownChannel,
            message : data,
            callback: function(m){
                console.log('sent pubnub message', m);
            }
       });
    }

    onConnected() {
        console.log('Connected to PubNub');
    }

    onDisconnected() {
        console.log('Disconnected from PubNub');
    }
}
