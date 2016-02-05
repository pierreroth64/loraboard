import * as devTypes from './device_types';
import {LoRaMoteCodec} from './loramote/loramote_codec';
import {NucleoCodec} from './nucleo/nucleo_codec';

export class DeviceController {

  constructor(deviceManager) {
    this.devMgr = deviceManager;
    Backbone.Mediator.subscribe('data:upstream', this.onIncomingData, this);
    this.availableCodecs = {
                              loramote: { type: devTypes.DEV_TYPE_LORAMOTE,
                                          codec: new LoRaMoteCodec() },
                              nucleo: { type: devTypes.DEV_TYPE_NUCLEO,
                                        codec: new NucleoCodec() }
                            };
  }

  // Try available codecs and return device type if a codec matches, else returns undefined
  tryCodecsAndReturnDeviceType(data) {
    for (let codecName in this.availableCodecs) {
      let codec = this.availableCodecs[codecName].codec;
      if (codec.mayMatch(data)) {
        return this.availableCodecs[codecName].type;
      }
    }
    return undefined;
  }

  onIncomingData(data) {
    var eui = data.EUI;
    var data = data.data;
    var dev = this.devMgr.findDevice(eui);
    if (dev == undefined) {
        console.log(`device with eui: ${eui} is unknown, trying to find codec...`);
        let type = this.tryCodecsAndReturnDeviceType(data);
        if (type != undefined) {
          dev = this.devMgr.createDevice(eui, devTypes.DEV_TYPE_LORAMOTE);
          console.log('found matching codec, created device.')
        } else {
          console.log(`could not find matching codec for device with eui: ${eui}`);
          return;
        }
    }
    dev.processReceivedData(data);
    Backbone.Mediator.publish('device:updatePosition', dev.getEUI(), dev.getName(), dev.getPosition());
  }
}
