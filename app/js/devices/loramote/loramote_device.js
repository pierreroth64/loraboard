import {BaseDevice} from '../base_device';
import * as devTypes from '../device_types';
import {LoRaMoteCodec} from './loramote_codec';
import {LoRaData} from '../../models/lora_data'

export class LoRaMoteDevice extends BaseDevice {

  constructor(eui) {
    super(new LoRaMoteCodec(), eui, devTypes.DEV_TYPE_LORAMOTE);
    this.setName(`LoRaMote ${this.getFormattedEUI(eui)}`);
    this.models.led = new LoRaData({ title: 'led',
                                     value: false,
                                     unit:'-' });
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

  getCapabilities()  {
      return [ {
                  action: 'toggleLed',
                  actionLabel: 'Toggle LED!'
                } ];
  }

  toggleLed(data) {
      var currentState = this.models.led.attributes.value;
      return this.codec.encodeDriveLedCmd(this.getFormattedEUI(), !currentState);
  }

  processData(data) {
    var codec = this.getCodec();
    var led = codec.decodeLedState(data).value;
    var temperature = codec.decodeTemperature(data).value;
    var pressure = codec.decodePressure(data).value;
    var battery = codec.decodeBatteryLevel(data).value;
    var latitude = codec.decodeLatitude(data).value;
    var longitude = codec.decodeLongitude(data).value;

    this.setValue(this.models.led, led);
    this.setValue(this.models.temperature, temperature);
    this.setValue(this.models.pressure, pressure);
    this.setValue(this.models.battery, battery);
    this.setValue(this.models.position, {latitude, longitude});

    return {led, temperature, pressure, battery, latitude, longitude};
  }

  getPosition() {
    var position = this.models.position.attributes.value;
    return position ;
  }
}
