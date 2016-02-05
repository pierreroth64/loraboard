import {BaseDevice} from '../base_device';
import * as devTypes from '../device_types';
import {LoRaMoteCodec} from './loramote_codec';
import {LoRaData} from '../../models/lora_data'

export class LoRaMoteDevice extends BaseDevice {

  constructor(eui) {
    super(new LoRaMoteCodec(), eui, devTypes.DEV_TYPE_LORAMOTE, `LoRaMote ${eui}`);
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
    var temperature = codec.decodeTemperature(data).value;
    var pressure = codec.decodePressure(data).value;
    var battery = codec.decodeBatteryLevel(data).value;
    var latitude = codec.decodeLatitude(data).value;
    var longitude = codec.decodeLongitude(data).value;

    this.setValue(this.models.temperature, temperature);
    this.setValue(this.models.pressure, pressure);
    this.setValue(this.models.battery, battery);
    this.setValue(this.models.position, {latitude, longitude});

    return {temperature, pressure, battery, latitude, longitude};
  }

  getPosition() {
    var position = this.models.position.attributes.value;
    return position ;
  }
}
