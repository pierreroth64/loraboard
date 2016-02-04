import {BaseDevice} from '../base_device';
import * as devTypes from '../device_types';
import {LoRaMoteCodec} from './loramote_codec';
import {LoRaData} from '../../models/lora_data'

export class LoRaMoteDevice extends BaseDevice {

  constructor(eui) {
    super(new LoRaMoteCodec(), eui, devTypes.DEV_TYPE_LORAMOTE);
    this.models.temperature = new LoRaData({ title: 'temperature',
                                             value: 25,
                                             unit:'°C' });
    this.models.pressure = new LoRaData({ title: 'pressure',
                                          value: 800,
                                          unit:'hPa' });
    this.models.battery = new LoRaData({ title: 'battery',
                                         value: 50,
                                         unit:'%' });
    this.models.position = new LoRaData({ title: 'position',
                                          value: JSON.stringify({latitude: 0, longitude: 360}),
                                          unit:'%'});
  }

  processData(data) {
    var codec = this.getCodec();
    this.setValue(this.models.temperature, codec.decodeTemperature(data).value);
    this.setValue(this.models.pressure, codec.decodePressure(data).value);
    this.setValue(this.models.battery, codec.decodeBatteryLevel(data).value);
    this.setValue(this.models.position, {
                                            latitude: codec.decodeLatitude(data).value,
                                            longitude: codec.decodeLongitude(data).value
                                        });
  }

  getPosition() {
    var position = this.models.position.attributes.value;
    return position ;
  }
}
