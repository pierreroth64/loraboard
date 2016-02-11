export class BaseView extends Backbone.View {

  constructor(options) {
    super(options);
    this.deviceController = options.deviceController;
    this.deviceManager = options.deviceManager;
    this.dataService = options.dataService;
  }
}
