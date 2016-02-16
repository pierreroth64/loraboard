import {MainView} from './views/main_view';
import {ErrorView} from './views/error_view';
import {LoRaMoteDeviceView} from './views/devices/loramote_device_view';
import {NucleoDeviceView} from './views/devices/nucleo_device_view';
import {NucleoLightingDeviceView} from './views/devices/nucleo_lighting_device_view';
import {DeviceManager} from './devices/device_manager';
import {DeviceController} from './devices/device_controller';
import * as devTypes from './devices/device_types';
import {PubNubDataService} from './cloud/pubnub_data_service';
import {isBuildTargetSet, getBuildTarget} from './lib/util';

export class LoRaApp extends Backbone.Router {

    constructor() {
        super();
        this.routes = {
                '': 'showMain',
                'devices/:eui': 'showDevice'
            };
        this.deviceManager = new DeviceManager();
        this.deviceController = new DeviceController(this.deviceManager);
        this.dataService = new PubNubDataService();
        this._bindRoutes();
        this.deviceViews = {};
        this.mainView = new MainView({ deviceController: this.deviceController,
                                       deviceManager: this.deviceManager,
                                       dataService: this.dataService });
        this.currentView = undefined;
    }

    logStartUpMessage() {
        var startUpMsg = 'LoRa application startup! :)';
        if (isBuildTargetSet()) {
            startUpMsg += ` (buildTarget: ${getBuildTarget()})`;
        }
        console.log(startUpMsg);
    }

    start() {
        this.logStartUpMessage();
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
        var dev = this.deviceManager.findDevice(eui);
        if (dev) {
            var type = dev.getType();
            var options = { device: dev,
                            deviceController: this.deviceController,
                            deviceManager: this.deviceManager,
                            dataService: this.dataService,
                            eui: eui };
            switch(type) {
                case devTypes.DEV_TYPE_LORAMOTE:
                    return new LoRaMoteDeviceView(options);
                break;
                case devTypes.DEV_TYPE_NUCLEO_LIGHTING:
                    return new NucleoLightingDeviceView(options);
                break;
                case devTypes.DEV_TYPE_NUCLEO:
                    return new NucleoDeviceView(options);
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
    }
}



