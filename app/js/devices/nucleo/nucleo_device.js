import { BaseDevice } from '../base_device';
import * as devTypes from '../device_types';
import { NucleoCodec } from './nucleo_codec';
import { LoRaData } from '../../models/lora_data';

export class NucleoDevice extends BaseDevice {

  constructor(eui) {
    super(new NucleoCodec(), eui, devTypes.DEV_TYPE_NUCLEO);
    this.setName(`Nucleo ${this.getFormattedEUI(eui)}`);
    this.models.brightness = new LoRaData({ title: 'brigthness',
                                            value: 100,
                                            unit: '' });
  }

  processData(data) {
    const codec = this.getCodec();
    const brightness = codec.decodeBrightness(data).value;
    this.setValue(this.models.brightness, brightness);
    return { brightness };
  }
}
