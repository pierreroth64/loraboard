export class BaseDevice {

  constructor(codec, eui, type, name='Default name') {
    this.codec = codec;
    this.eui = eui;
    this.type = type;
    this.name = name;
    this.models = {};
    this.extras = {};
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  getEUI() {
    return this.eui;
  }

  getPosition() {
    return {latitude: undefined, longitude: undefined};
  }

  getCapabilities() {
    return [];
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

  setType(type) {
    this.type = type;
  }

  getCodec() {
    return this.codec;
  }

  setCodec(codec) {
    this.codec = codec;
  }

  getExtras() {
    return this.extras;
  }

  setExtras(extras) {
    this.extras = extras;
  }

  processReceivedData(data) {
    var decoded = this.processData(data);
    console.log(`frame from ${this.eui}, decoded data:`, decoded);
  }
  processData(data) {
    throw new Error('You _must_ implement the processData(..) method in your device class');
  }
}
