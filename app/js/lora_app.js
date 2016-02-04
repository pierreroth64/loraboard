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
        this.deviceViews = {};
        this.mainView = new MainView();
    }

    start() {
        Backbone.history.start({pushState: true});
        this.dataService.start();
    }

    showDevice(eui) {
        if (this.deviceViews[eui] != undefined) {
            this.deviceViews[eui].render();
        } else {
            this.createDeviceView(eui).render();
        }
    }

    createDeviceView(eui) {
        var dev = this.deviceMgr.findDevice(eui);
        if (dev) {
            var type = dev.getType();
            switch(type) {
                case devTypes.DEV_TYPE_LORAMOTE:
                    return new LoRaMoteDeviceView({models: dev.getModels(), dataService: this.dataService});
                break;
                default:
                    return new ErrorView(`unknown device type ${type} for device with eui ${eui}`);
                break;
            }
        } else {
            return new ErrorView(`device with eui ${eui} not found`);
        }
    }

    showMain() {
        this.mainView.render();
    }
}



