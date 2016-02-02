import {BaseDevice} from '../base_device';
import * as devTypes from '../device_types';
import {NucleoCodec} from './nucleo_codec';
import {LoRaData} from '../../models/lora_data'

export class NucleoDevice extends BaseDevice {

  constructor(eui) {
    super(new NucleoCodec(), eui, devTypes.DEV_TYPE_NUCLEO);
  }

  processData(data) {
    throw new Error('not implemented');
  }
}
