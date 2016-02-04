export class DeviceController {

  constructor(deviceManager) {
    this.devMgr = deviceManager;
    Backbone.Mediator.subscribe('data:newFrame', this.onNewFrame, this);
  }

  onNewFrame(data) {
    var eui = data.EUI;
    var dev = this.devMgr.findDevice(eui);
    if (dev == undefined) {
      console.log(`device with eui: ${eui} is unknown, creating it...`);
      dev = this.devMgr.createDevice(eui, types.DEV_TYPE_LORAMOTE);
    }
    dev.processData(data.data);
  }
}
