import {MainView} from './views/main_view';
import {ErrorView} from './views/error_view';
import {LoRaMoteDeviceView} from './views/devices/loramote_device_view';
import {DeviceManager} from './devices/device_manager';
import {DeviceController} from './devices/device_controller';
import * as devTypes from './devices/device_types';
import {PubNubDataService} from './cloud/pubnub_data_service';

export class LoRaApp extends Backbone.Router {

    constructor() {
        super();
        this.routes = {
                '': 'showMain',
                'devices/:eui': 'showDevice'
            };
        this.deviceMgr = new DeviceManager();
        this.deviceCtlr = new DeviceController(this.deviceMgr);
        this.dataService = new PubNubDataService();
        this._bindRoutes();
        this.deviceViews = {};
        this.mainView = new MainView();
        this.currentView = undefined;
    }

    start() {
        Backbone.history.start({pushState: true});
        this.dataService.start();
    }

    showDevice(eui) {
        if (this.deviceViews[eui] != undefined) {
            this.currentView = this.deviceViews[eui];
        } else {
            this.currentView = this.createDeviceView(eui);
        }
        this.currentView.render();
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
        this.currentView = this.mainView;
        this.currentView.render();
        this.currentView.updateMarkersOnMap();
    }
}



