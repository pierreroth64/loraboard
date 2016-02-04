import * as types from './device_types';
import {LoRaMoteDevice} from './loramote/loramote_device';
import {NucleoDevice} from './loramote/nucleo_device';

export class DeviceManager {

  constructor() {
    this.devices = {};
    Backbone.Mediator.subscribe('data:newFrame', this.onNewFrame, this);
  }

  getDevices() {
    return this.devices;
  }

  createDevice(eui, type) {
    if (this.findDevice(eui) != undefined) {
      throw new Error('Device with this EUI already exists');
    }

    switch (type) {
        case types.DEV_TYPE_LORAMOTE:
            var dev = new LoRaMoteDevice(eui);
            this.devices[eui] = dev;
            return dev;
        break;
        case types.DEV_TYPE_NUCLEO:
            var dev = new NucleoDevice(eui);
            this.devices[eui] = dev;
            return dev;
        break;
        default:
            throw Error('unsupported device type');
        break;
    }
  }

  removeDevice(eui) {
    delete this.devices[eui];
  }

  findDevice(eui) {
    return this.devices[eui];
  }

  getDeviceNb() {
    return Object.keys(this.devices).length;
  }

  onNewFrame(data) {
    console.log('new frame received by dev mgr:', data);
    var eui = data.EUI;
    var dev = this.findDevice(eui);
    if (dev == undefined) {
      console.log(`device with eui: ${eui} is unknown, creating it...`);
      dev = this.createDevice(eui, types.DEV_TYPE_LORAMOTE);
    }
    dev.processData(data.data);
  }
}
