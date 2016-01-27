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

import {LoRaMoteDataCollector} from "../data/loramote";

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

export class MainView extends Backbone.View {

  constructor(options) {
    super(options);
    this.dataCollector = new LoRaMoteDataCollector({'temp': temperatureData,
                           'press': pressureData,
                           'batt': batteryData,
                           'position': mapPositionData})
    this.dataCollector.start();

    new TemperatureGraphView({model: temperatureData});
    new PressureGraphView({model: pressureData});
    new BatteryGraphView({model: batteryData});
    new MapView({model: mapPositionData});
    new FrameIndicatorView();
    new ToolBoxView({dataCollector: this.dataCollector});
    new TechnicalView();
    new SettingsView();


  }
}

