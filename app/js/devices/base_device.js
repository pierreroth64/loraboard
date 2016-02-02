export class BaseDevice {

  constructor(decoder) {
    this.setDecoder(decoder);
  }

  setValue(model, value) {
    // force trigger event if value is the same
    model.set({value: value}, {silent: true});
    model.trigger("change");
  }

  setDecoder(decoder) {
    this.decoder = decoder;
  }

  getDecoder() {
    return this.decoder;
  }

  processData(data) {
    throw new Error('You _must_ implement the processData(..) method in your device class');
  }
}
