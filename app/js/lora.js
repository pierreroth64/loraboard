/*jshint esnext:true */

// Traceur TodoMVC
// ---------------
// This is a re-write of the Backbone [TodoMVC](http://todomvc.com) app using
// ECMAScript 6 features. It's made possible using
// [Traceur](https://github.com/google/traceur-compiler) compiler and was
// authored by Addy Osmani, Pascal Hartig, Sindre Sorhus, Stephen Sawchuk,
// Rick Waldron, Domenic Denicola and Guy Bedford.

// You can [run](http://addyosmani.github.io/todomvc-backbone-es6/) the completed app,
// [watch](https://github.com/addyosmani/todomvc-backbone-es6) the project repository
// or look at the original [ES5 implementation](http://goo.gl/8opExB).

// Begin your ES6 adventure here
// -----------------------------

// #### Imports
// We import the classes we defined in the TodoApp module using the `import`
// keyword.
import {DeviceView} from './views/device_view';
import {DeviceManager} from './devices/device_manager';
import * as devTypes from './devices/device_types';
import {PubNubDataService} from "./cloud/pubnub_data_service";

$(() => {
  var dataService = new PubNubDataService();
  dataService.start();
  var deviceMgr = new DeviceManager();
  var dev = deviceMgr.createDevice("123131313", devTypes.DEV_TYPE_LORAMOTE);

  new DeviceView({models: dev.getModels(), dataService});
  Backbone.history.start();
});

