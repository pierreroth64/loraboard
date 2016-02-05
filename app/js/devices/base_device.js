export class BaseDevice {

  constructor(codec, eui, type, name='Default name') {
    this.codec = codec;
    this.eui = eui;
    this.type = type;
    this.name = name;
    this.models = {};
  }

  getName() {
    return this.name;
  }

  getEUI() {
    return this.eui;
  }

  getPosition() {
    return {latitude: undefined, longitude: undefined};
  }

  setValue(model, value) {
    // force trigger event if value is the same
    model.set({value: value}, {silent: true});
    model.trigger('change');
  }

  getModels() {
    return this.models;
  }

  getType() {
    return this.type;
  }

  getCodec() {
    return this.codec;
  }

  processReceivedData(data) {
    var decoded = this.processData(data);
    console.log(`frame from ${this.eui}, decoded data:`, decoded);
  }
  processData(data) {
    throw new Error('You _must_ implement the processData(..) method in your device class');
  }
}
