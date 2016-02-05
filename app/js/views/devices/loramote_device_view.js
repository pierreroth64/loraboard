/*jshint esnext:true */

import {LoRaData} from "../../models/lora_data";
import {TemperatureGraphView} from "./../temp_view";
import {PressureGraphView} from "./../press_view";
import {BatteryGraphView} from "./../battery_view";
import {MapView} from "./../map_view";
import {FrameIndicatorView} from "./../frame_indicator_view";
import {ToolBoxView} from "./../toolbox_view";
import {TechnicalView} from "./../technical_view";
import {SettingsView} from "./../settings_view";

export class LoRaMoteDeviceView extends Backbone.View {

  constructor(options) {
    super(options);
    this.models = options.models;
    this.dataService = options.dataService;
    this.setElement('#main');
  }

  render() {
    var html = `
      <div class="row">
        <div class="center-block">
        </div>
      </div>
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
            <h4>Setup <button id="settings-btn" type="button" class="btn btn-default" data-toggle="modal" data-target="#pubnub-setttings">
                             <span id="settings-btn-icon" class="glyphicon glyphicon-cog" aria-hidden="true"></span>
                           </button></h4>
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
    new TemperatureGraphView({model: this.models.temperature,
                              id: 'temp-chart'},
                             'Temperature graph');
    new PressureGraphView({model: this.models.pressure,
                           id: 'press-chart'}, 'Pressure graph');
    new BatteryGraphView({model: this.models.battery,
                          id: 'batt-chart'});
    new MapView({model: this.models.position,
                 id: 'lora-map'});
    new FrameIndicatorView({id: 'frame-indicator'});
    new ToolBoxView({id: 'tool-box', dataService: this.dataService});
    new TechnicalView({id: 'technical-window'});
    new SettingsView();
    return this;
  }
}
