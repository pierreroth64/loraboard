/*jshint esnext:true */

import {LoRaData} from "../models/lora_data";
import {TemperatureGraphView} from "./temp_view";
import {PressureGraphView} from "./press_view";
import {BatteryGraphView} from "./battery_view";
import {MapView} from "./map_view";
import {FrameIndicatorView} from "./frame_indicator_view";
import {ToolBoxView} from "./toolbox_view";
import {TechnicalView} from "./technical_view";
import {SettingsView} from "./settings_view";

import {PubNubDataService} from "../cloud/pubnub_data_service";

var temperatureData = new LoRaData({title: "temperature",
                                    value: 25,
                                    unit:"°C"});
var pressureData = new LoRaData({title: "pressure",
                                 value: 800,
                                 unit:"hPa"});
var batteryData = new LoRaData({title: "battery",
                                value: 50,
                                unit:"%"});
var mapPositionData = new LoRaData({title: "position",
                                    value: JSON.stringify({latitude: 0, longitude: 360}),
                                    unit:"%"});

export class DeviceView extends Backbone.View {

  constructor(options) {
    super(options);
    this.dataService = new PubNubDataService();
    this.dataService.start();

    new TemperatureGraphView({model: temperatureData}, "Temperature graph");
    new PressureGraphView({model: pressureData}, "Pressure graph");
    new BatteryGraphView({model: batteryData});
    new MapView({model: mapPositionData});
    new FrameIndicatorView();
    new ToolBoxView({dataService: this.dataService});
    new TechnicalView();
    new SettingsView();
  }
}
