/*jshint esnext:true */

import {LoRaData} from "../models/lora_data";
import {TemperatureGraphView} from "./temp_view";
import {PressureGraphView} from "./press_view";
import {BatteryGraphView} from "./battery_view";
import {LoRaMoteDataCollector} from "../data/loramote";

var temperatureData = new LoRaData({title: "temperature", value: 25, unit:"°C"});
var pressureData = new LoRaData({title: "pressure", value: 800, unit:"hPa"});
var batteryData = new LoRaData({title: "battery", value: 50, unit:"%"});

export class MainView extends Backbone.View {

  constructor() {
    this.temperatureGraphView = new TemperatureGraphView({model: temperatureData});
    this.pressureGraphView = new PressureGraphView({model: pressureData});
    this.batteryGraphView = new BatteryGraphView({model: batteryData});
    super();
    this.render();
    this.dataCollector = new LoRaMoteDataCollector({'temp': temperatureData,
                                                    'press': pressureData,
                                                    'batt': batteryData});
    this.on('rawLoraFrame', function(event, args) { console.log("view received raw frame event", event, args);});
    this.dataCollector.start();
  }

  render() {
    this.temperatureGraphView.render();
    this.pressureGraphView.render();
    this.batteryGraphView.render();
  }
}

