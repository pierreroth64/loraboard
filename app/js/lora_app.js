import {MainView} from './views/main_view';
import {LoRaMoteDeviceView} from './views/devices/loramote';
import {DeviceManager} from './devices/device_manager';
import * as devTypes from './devices/device_types';
import {PubNubDataService} from './cloud/pubnub_data_service';

export class LoRaApp extends Backbone.Router {

    constructor() {
        super();
        this.routes = {
                '': 'showMain',
                'devices/:eui': 'showDevice'
            };
        this.dataService = new PubNubDataService();
        this.deviceMgr = new DeviceManager();
        this._bindRoutes();
    }

    start() {
        Backbone.history.start({pushState: true});
        this.dataService.start();
    }

    showDevice(eui) {
        console.log('show device with eui', eui);
        var dev = this.deviceMgr.findDevice(eui);
        console.log('found device:', dev);
        if (dev) {
            var type = dev.getType();
            switch(dev.getType()) {
                case devTypes.DEV_TYPE_LORAMOTE:
                    new LoRaMoteDeviceView({models: dev.getModels(), dataService: this.dataService});
                break;
                default:
                    console.log('device type unknown :(');
                break;
            }
        } else {
            console.log('could not find device with eui', eui);
        }

    }

    showMain() {
        new MainView();
    /*        var eui = '1222222';
        this.deviceMgr.createDevice(eui, devTypes.DEV_TYPE_LORAMOTE);
        this.showDevice(eui);*/
    }

    /*execute(callback, args, name) {
        console.log('calling execute with args:', callback, args, name);
        super.execute(callback,args, name);
    }*/
}



