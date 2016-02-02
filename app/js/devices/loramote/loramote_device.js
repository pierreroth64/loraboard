import {BaseDevice} from '../base_device';
import * as devTypes from '../device_types';
import {LoRaMoteCodec} from './loramote_codec';
import {LoRaData} from '../../models/lora_data'

export class LoRaMoteDevice extends BaseDevice {

  constructor(eui) {
    super(new LoRaMoteCodec(), eui, devTypes.DEV_TYPE_LORAMOTE);
    this.temperatureData = new LoRaData({ title: "temperature",
                                          value: 25,
                                          unit:"°C" });
    this.pressureData = new LoRaData({ title: "pressure",
                                       value: 800,
                                       unit:"hPa" });
    this.batteryData = new LoRaData({ title: "battery",
                                      value: 50,
                                      unit:"%" });
    this.mapPositionData = new LoRaData({ title: "position",
                                          value: JSON.stringify({latitude: 0, longitude: 360}),
                                          unit:"%"});
  }

  processData(data) {
    var codec = this.getCodec();
    this.setValue(this.temperatureData, codec.decodeTemperature(data.data).value);
    this.setValue(this.pressureData, codec.decodePressure(data.data).value);
    this.setValue(this.batteryData, codec.decodeBatteryLevel(data.data).value);
    this.setValue(this.mapPositionData, {
                                            latitude: codec.decodeLatitude(data.data).value,
                                            longitude: codec.decodeLongitude(data.data).value
                                        });
  }
}
