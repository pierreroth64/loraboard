import { MainView } from './views/main_view';
import { DeviceManager } from './devices/device_manager';
import { DeviceController } from './devices/device_controller';
import { PubNubDataService } from './cloud/pubnub_data_service';
import { DeviceViewFactory } from './views/devices/device_view_factory';
import { isBuildTargetSet, getBuildTarget } from './lib/util';

export class LoRaApp extends Backbone.Router {

  constructor() {
    super();
    this.routes = {
      '': 'showMain',
      'devices/:eui': 'showDevice',
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
    this.devViewfactory = new DeviceViewFactory();
  }

  logStartUpMessage() {
    let startUpMsg = 'LoRa application startup! :)';
    if (isBuildTargetSet()) {
      startUpMsg += ` (buildTarget: ${getBuildTarget()})`;
    }
    console.log(startUpMsg);
  }

  start() {
    this.logStartUpMessage();
    Backbone.history.start({ pushState: true });
    this.dataService.start();
  }

  showDevice(eui) {
    if (this.deviceViews[eui] !== undefined) {
      this.currentView = this.deviceViews[eui];
    } else {
      this.currentView = this.createDeviceView(eui);
    }
    this.currentView.render();
  }

  createDeviceView(eui) {
    const dev = this.deviceManager.findDevice(eui);
    const options = { deviceController: this.deviceController,
                      deviceManager: this.deviceManager,
                      dataService: this.dataService,
                      eui };
    return this.devViewfactory.createDeviceView(eui, dev, options);
  }

  showMain() {
    this.currentView = this.mainView;
    this.currentView.render();
  }
}
