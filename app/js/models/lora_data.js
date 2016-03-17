// LoRa data container
export class LoRaData extends Backbone.Model {

  defaults() {
    return {
      title: 'title unset',
      value: 10,
      unit: 'unset',
    };
  }

  sync(method, model, options) {
    console.log('sync does nothing for now!');
  }
}
