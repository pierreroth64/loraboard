import {MainView} from './views/main_view';
import {ErrorView} from './views/error_view';
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
            switch(type) {
                case devTypes.DEV_TYPE_LORAMOTE:
                    new LoRaMoteDeviceView({models: dev.getModels(), dataService: this.dataService});
                break;
                default:
                    new ErrorView(`unknown device type ${type} for device with eui ${eui}`);
                break;
            }
        } else {
            new ErrorView(`device with eui ${eui} not found`);
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



