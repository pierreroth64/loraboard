import { BaseView } from '../base_view';

export class BaseDeviceView extends BaseView {

  constructor(options) {
    super(options);
    this.device = options.device;
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
