import * as types from './device_types';
import { LoRaMoteCodec } from './loramote/loramote_codec';
import { LoRaMoteDevice } from './loramote/loramote_device';
import { NucleoCodec } from './nucleo/nucleo_codec';
import { NucleoDevice } from './nucleo/nucleo_device';
import { NucleoLightingCodec } from './nucleo_legrand/nucleo_lighting_codec';
import { NucleoLightingDevice } from './nucleo_legrand/nucleo_lighting_device';
import { isLegrandBuild } from '../lib/util';

export class DeviceManager {

  constructor() {
    this.devices = {};
    if (isLegrandBuild()) {
      this.availableCodecs = {
        loramote: { type: types.DEV_TYPE_LORAMOTE,
                                        codec: new LoRaMoteCodec() },
        nucleo: { type: types.DEV_TYPE_NUCLEO,
                                      codec: new NucleoCodec() },
        lighting: { type: types.DEV_TYPE_NUCLEO_LIGHTING,
                                      codec: new NucleoLightingCodec() },
      };
    } else {
      this.availableCodecs = {
        loramote: { type: types.DEV_TYPE_LORAMOTE,
                                        codec: new LoRaMoteCodec() },
        nucleo: { type: types.DEV_TYPE_NUCLEO,
                                      codec: new NucleoCodec() },
      };
    }
  }

  getDevices() {
    return this.devices;
  }

  tryCodecsAndReturnDeviceType(data) {
    for (const codecName in this.availableCodecs) {
      if (this.availableCodecs.hasOwnProperty(codecName)) {
        const codec = this.availableCodecs[codecName].codec;
        if (codec.mayMatch(data)) {
          return this.availableCodecs[codecName].type;
        }
      }
    }
    return undefined;
  }

  tryToCreateDeviceFromData(eui, data) {
    let dev = undefined;
    const type = this.tryCodecsAndReturnDeviceType(data);
    if (type !== undefined) {
      dev = this.createDevice(eui, type);
    }
    return dev;
  }

  createDevice(eui, type) {
    let dev = undefined;
    if (this.findDevice(eui) !== undefined) {
      throw new Error('Device with this EUI already exists');
    }

    switch (type) {
      case types.DEV_TYPE_LORAMOTE:
        dev = new LoRaMoteDevice(eui);
        this.devices[eui] = dev;
        return dev;
      case types.DEV_TYPE_NUCLEO:
        dev = new NucleoDevice(eui);
        this.devices[eui] = dev;
        return dev;
      case types.DEV_TYPE_NUCLEO_LIGHTING:
        dev = new NucleoLightingDevice(eui);
        this.devices[eui] = dev;
        return dev;
      default:
        throw Error('unsupported device type');
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
}
