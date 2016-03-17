import { BaseDeviceView } from './base_device_view';
import { TemperatureGraphView } from './../widgets/temp_view';
import { PressureGraphView } from './../widgets/press_view';
import { BatteryGraphView } from './../widgets/battery_view';
import { MapView } from './../widgets/map_view';
import { FrameIndicatorView } from './../widgets/frame_indicator_view';
import { ToolBoxView } from './../widgets/toolbox_view';
import { TechnicalView } from './../widgets/technical_view';

export class LoRaMoteDeviceView extends BaseDeviceView {

  constructor(options) {
    super(options);
    this.setElement('#main');
  }

  render() {
    let html = super.getSuperRender();
    html += `
      <div class="row">
        <div id="press-chart-box" class="col-md-6">
          <h4>Pressure</h4>
          <div id="press-chart" class="graph-box"></div>
        </div>
        <div id="temp-chart-box" class="col-md-6">
          <h4>Temperature</h4>
          <div id="temp-chart" class="graph-box"></div>
        </div>
      </div>
      <div class="row">
        <div id="batt-chart-box" class="col-md-6">
          <h4>Battery</h4>
          <div id="batt-chart" class="graph-box"></div>
        </div>
        <div id="lora-map-box" class="col-md-6">
          <h4>GPS</h4>
          <div id="lora-map" class="graph-box map-box"></div>
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
    this.tempView = new TemperatureGraphView({ model: this.models.temperature,
                                               id: 'temp-chart',
                                               device: this.device },
                                              'Temperature graph');
    this.pressView = new PressureGraphView({ model: this.models.pressure,
                                             id: 'press-chart',
                                             device: this.device }, 'Pressure graph');
    this.battView = new BatteryGraphView({ model: this.models.battery,
                                          id: 'batt-chart',
                                          device: this.device });
    this.mapView = new MapView({ model: this.models.position,
                                 id: 'lora-map',
                                device: this.device });
    this.frameView = new FrameIndicatorView({ id: 'frame-indicator',
                                              device: this.device });
    this.toolboxView = new ToolBoxView({ id: 'tool-box',
                                         device: this.device,
                                         dataService: this.dataService });
    this.techView = new TechnicalView({ id: 'technical-window',
                                        device: this.device });
    return this;
  }
}
