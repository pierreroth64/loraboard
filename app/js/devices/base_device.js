export class BaseDevice {

  constructor(codec, eui, type) {
    this.codec = codec;
    this.eui = eui;
    this.type = type;
  }

  setValue(model, value) {
    // force trigger event if value is the same
    model.set({value: value}, {silent: true});
    model.trigger("change");
  }

  getType() {
    return this.type;
  }

  getCodec() {
    return this.codec;
  }

  processData(data) {
    throw new Error('You _must_ implement the processData(..) method in your device class');
  }
}