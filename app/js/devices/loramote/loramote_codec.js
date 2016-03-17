import { BaseCodec } from '../base_codec';

const FRAME_LENGTH = 32;
export class LoRaMoteCodec extends BaseCodec {

  mayMatch(data) {
    return (data.length === FRAME_LENGTH);
  }

  decodeLedState(frame) {
    let state = false;
    const raw = frame.substr(0, 2);
    if (parseInt(raw, 16)) state = true;
    return { raw, value: state, unit: '-' };
  }

  decodePressure(frame) {
    const raw = frame.substr(2, 4);
    return { raw, value: parseInt(raw, 16) / 10, unit: 'hPa' };
  }

  decodeTemperature(frame) {
    const raw = frame.substr(6, 4);
    return { raw, value: parseInt(raw, 16) / 100, unit: '°C' };
  }

  decodeMeasuredAltitude(frame) {
    const raw = frame.substr(10, 4);
    return { raw, value: parseInt(raw, 16) / 10, unit: 'm' };
  }

  decodeAltitude(frame) {
    const raw = frame.substr(28, 4);
    return { raw, value: parseInt(raw, 16), unit: 'm' };
  }

  decodeBatteryLevel(frame) {
    const raw = frame.substr(14, 2);
    let value = parseInt(raw, 16);
    if (value === 0) {
          // connected to external source -> display 100%
      value = 100;
    } else if (value === 255) {
          // could not determine batt level -> display 0%
      value = 0;
    } else {
      value = (value * 100 / 254).toFixed(0);
    }
    return { raw, value, unit: '%' };
  }

  decodeLatitude(frame) {
    const raw = frame.substr(16, 6);
    let value = parseInt(raw, 16);
    value = value / (Math.pow(2, 23) - 1) * 90;
    return { raw, value, unit: '°' };
  }

  decodeLongitude(frame) {
    const raw = frame.substr(22, 6);
    let value = parseInt(raw, 16);
    // FIXME: properly decode longitude!
    value = value / (Math.pow(2, 23) - 1) * 180;
    if (value > 180) value = value - 360;
    return { raw, value, unit: '°' };
  }

  decode(frame) {
    return {
      pressure: this.decodePressure(frame).value,
      temperature: this.decodeTemperature(frame).value,
      'measured-altitude': this.decodeMeasuredAltitude(frame).value,
      altitude: this.decodeAltitude(frame).value,
      battery: this.decodeBatteryLevel(frame).value,
      latitude: this.decodeLatitude(frame).value,
      longitude: this.decodeLongitude(frame).value,
    };
  }

  encodeDriveLedCmd(eui, state) {
    const cmd = (state === true) ? '1' : '0';
    return { cmd: `{\"command\": \"mote send ${eui} port 2 data ${cmd}\"}` };
  }
}
