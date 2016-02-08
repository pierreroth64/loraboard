export class BaseDeviceView extends Backbone.View {

  constructor(options) {
    super(options);
    this.device = options.device;
    this.dataService = options.dataService;
    this.eui = options.eui;
    this.models = this.device.getModels();
  }

  getSuperRender() {
    return `
      <div class="row">
        <div class="center-block">
          <div class="col-md-6">
            <h4><span id="device-name" class="label label-primary">${this.device.getName()}</span></h4>
          </div>
        </div>
      </div>`;
  }
}
