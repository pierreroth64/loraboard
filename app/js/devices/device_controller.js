export class DeviceController {

  constructor(deviceManager) {
    this.devMgr = deviceManager;
    Backbone.Mediator.subscribe('data:upstream', this.onIncomingData, this);
  }

  onIncomingData(data) {
    const eui = data.EUI;
    const incomingData = data.data;
    let dev = this.devMgr.findDevice(eui);

    if (dev === undefined) {
      console.log(`device with eui: ${eui} not found, trying to create it...`);
      dev = this.devMgr.tryToCreateDeviceFromData(eui, incomingData);
      if (dev !== undefined) {
        console.log(`found matching codec, device created for ${eui}`);
      } else {
        console.warn('codec not found, device not created');
        return;
      }
    }

    dev.processReceivedData(incomingData);
    Backbone.Mediator.publish('device:updatePosition', dev.getEUI(), dev.getName(), dev.getPosition());
  }

  runActionOnDevice(eui, action, data) {
    const dev = this.devMgr.findDevice(eui);
    if (dev === undefined) {
      console.warn(`device with eui: ${eui} not found, aborting ${action}...`);
      return;
    }

    if (dev[action] !== undefined) {
      const frame = dev[action](data);
      if (frame !== undefined) {
        Backbone.Mediator.publish('data:downstream', frame);
      }
    } else {
      console.warn(`device with eui: ${eui} does not support '${action}' action!`);
    }
  }
}
