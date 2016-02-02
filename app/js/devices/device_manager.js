import * as types from './device_types';
import {LoRaMoteDevice} from './loramote/loramote_device';
import {NucleoDevice} from './loramote/nucleo_device';

export class DeviceManager {

  constructor() {
    this.devices = {};
  }

  getDevices() {
    return this.devices;
  }

  createDevice(eui, type) {
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
}
