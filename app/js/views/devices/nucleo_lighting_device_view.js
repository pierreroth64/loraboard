import {isLegrandBuild} from '../../lib/util';
import {BaseDeviceView} from './base_device_view';
import {LoRaData} from '../../models/lora_data';
import {BrightnessGraphView} from './../widgets/brightness_view';
import {LightingBrightnessGraphView} from './../widgets/legrand/lighting_brightness_view';
import {FrameIndicatorView} from './../widgets/frame_indicator_view';
import {ToolBoxView} from './../widgets/toolbox_view';
import {TechnicalView} from './../widgets/technical_view';

export class NucleoLightingDeviceView extends BaseDeviceView {

  constructor(options) {
    super(options);
    this.events = {
      'click #start-test': 'startTest',
    };
    this.setElement('#main');
  }

  startTest() {
    this.deviceController.runActionOnDevice(this.eui, 'test');
  }

  render() {
    var html = super.getSuperRender();
    var rtspStream = this.device.getExtras().rtsp;
    html += `
      <div class="row">
        <div id="brightness-chart-box" class="col-md-6">
          <h4>Brightness</h4>
          <div id="brightness-chart" class="graph-box"></div>
          <br />
          <button type="button" id="start-test" class="btn btn-sm btn-success">Test!</button>
        </div>
        <div id="video-box" class="col-md-6">
          <h4>Video feedback</h4>
            <embed
                type="application/x-vlc-plugin" autoplay="yes" width="410" height="310"
                target="${rtspStream}" />
        </div>
      </div>
      <br />
      <div class="row">
        <div id="tool-box" class="col-md-9">
        </div>
        <div class="pull-right">
          <h4>
            <span id="frame-indicator" class="label label-primary">frame</span>
          </h4>
        </div>
      </div>
      <br />
      <div id="technical-window" class="graph-box">
        <div class="row">
          <div class="col-md-6">
            <h4>Setup</h4>
            <p>The LoRa endpoint talks to a LoRa gateway which in turns talks to the <a href="http://www.loriot.io">Loriot</a> service.
              The Loriot.io service has been configured to publish its received data to the <a href="http://www.pubnub.com">PubNub</a> service.
              This page subscribes to the corresponding PubNub channel to get the realtime LoRa data, decodes it and displays live charts. </p>
          </div>
          <div class="col-md-6">
            <h4>Technical details</h4>
            <p>This page relies on the following JS libraries:
              <ul>
                <li><a href="http://www.pubnub.com">PubNub</a> to gather realtime data</li>
                <li><a href="http://c3js.org/">C3.js</a> for charts </li>
                <li><a href="https://www.mapbox.com/">mapbox</a> for maps</li>
              </ul>
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div id="realtime-box">
            </div>
          </div>
        </div>
      </div>`;
    this.$el.html(html);
    new LightingBrightnessGraphView({model: this.models.brightness,
                                       id: 'brightness-chart',
                                       device: this.device});
    new FrameIndicatorView({id: 'frame-indicator',
                            device: this.device});
    new ToolBoxView({id: 'tool-box',
                     device: this.device,
                     dataService: this.dataService});
    new TechnicalView({id: 'technical-window',
                       device: this.device});
    return this;
  }
}
