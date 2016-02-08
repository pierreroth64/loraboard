import * as devTypes from './device_types';

export class DeviceController {

  constructor(deviceManager) {
    this.devMgr = deviceManager;
    Backbone.Mediator.subscribe('data:upstream', this.onIncomingData, this);
  }

  onIncomingData(data) {
    var eui = data.EUI;
    var data = data.data;
    var dev = this.devMgr.findDevice(eui);

    if (dev == undefined) {
      console.log(`device with eui: ${eui} not found, trying to create it...`)
      dev = this.devMgr.tryToCreateDeviceFromData(eui, data);
      if (dev != undefined) {
        console.log(`found matching codec, device created for ${eui}`);
      } else {
        console.log(`codec not found, device not created`);
        return;
      }
    }

    dev.processReceivedData(data);
    Backbone.Mediator.publish('device:updatePosition', dev.getEUI(), dev.getName(), dev.getPosition());
  }
}
