import {BaseDevice} from '../base_device';
import {LoRaMoteDecoder} from './loramote_decoder';
import {LoRaData} from '../../models/lora_data'

export class LoRaMoteDevice extends BaseDevice {

  constructor() {
    super();
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
    this.setDecoder(new LoRaMoteDecoder());
  }

  setValue(model, value) {
    // force trigger event if value is the same
    model.set({value: value}, {silent: true});
    model.trigger("change");
  }

  process(data) {
    decoder = this.getDecoder();
    this.setValue(this.temperatureData, this.decoder.decodeTemperature(message.data).value);
    this.setValue(this.pressureData, this.decoder.decodePressure(message.data).value);
    this.setValue(this.batteryData, this.decoder.decodeBatteryLevel(message.data).value);
    this.setValue(this.mapPositionData, {
                                            latitude: this.decoder.decodeLatitude(message.data).value,
                                            longitude: this.decoder.decodeLongitude(message.data).value
                                        });
  }
}
