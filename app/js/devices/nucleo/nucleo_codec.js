import { BaseCodec } from '../base_codec';

const FRAME_LENGTH = 10;

export class NucleoCodec extends BaseCodec {

  mayMatch(data) {
    return (data.length === FRAME_LENGTH);
  }

  decodeBrightness(frame) {
    const raw = frame.substr(2, 8);
    let value = parseInt(raw, 16);
    value &= 0x7fffffff; // remove sign
    const decoded = 0xFF - ((value >>> 12) & 0xFF); // max value is 0xFFFFF (5 digits)
    return { raw, value: decoded, unit: '' };
  }

  decode(frame) {
    return {
      brigthness: this.decodeBrightness(frame).value,
    };
  }
}
