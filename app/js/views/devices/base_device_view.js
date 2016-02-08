export class BaseDeviceView extends Backbone.View {

  constructor(options) {
    super(options);
    this.device = options.device;
    this.dataService = options.dataService;
    this.eui = options.eui;
    this.models = this.device.getModels();
  }
}
