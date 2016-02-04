import * as devTypes from './device_types';

export class DeviceController {

  constructor(deviceManager) {
    this.devMgr = deviceManager;
    Backbone.Mediator.subscribe('data:upstream', this.onIncomingData, this);
  }

  onIncomingData(data) {
    var eui = data.EUI;
    var dev = this.devMgr.findDevice(eui);
    if (dev == undefined) {
        console.log(`device with eui: ${eui} is unknown, creating it...`);
        dev = this.devMgr.createDevice(eui, devTypes.DEV_TYPE_LORAMOTE);
    }
    dev.processData(data.data);
    Backbone.Mediator.publish('device:updatePosition', dev.getEUI(), dev.getPosition());
  }
}
