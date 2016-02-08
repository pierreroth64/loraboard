import {BaseDeviceView} from './base_device_view';
import {LoRaData} from '../../models/lora_data';
import {BrightnessGraphView} from './../widgets/brightness_view';
import {FrameIndicatorView} from './../widgets/frame_indicator_view';
import {ToolBoxView} from './../widgets/toolbox_view';
import {TechnicalView} from './../widgets/technical_view';

export class NucleoDeviceView extends BaseDeviceView {

  constructor(options) {
    super(options);
    this.setElement('#main');
  }

  render() {
    var html = `
      <div class="row">
        <div class="center-block">
        </div>
      </div>
      <div class="row">
        <div id="brightness-chart-box" class="col-md-6">
          <h4>brightness</h4>
          <div id="brightness-chart" style="background-color: #ffe5ff" class="graph-box"></div>
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
    new BrightnessGraphView({model: this.models.brightness,
                              id: 'brightness-chart',
                              eui: this.eui});
    new FrameIndicatorView({id: 'frame-indicator',
                            eui: this.eui});
    new ToolBoxView({id: 'tool-box',
                     eui: this.eui,
                     dataService: this.dataService});
    new TechnicalView({id: 'technical-window',
                       eui: this.eui});
    return this;
  }
}
