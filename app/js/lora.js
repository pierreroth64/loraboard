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
import {MainView} from './views/main_view';

$(() => {
  new MainView();
  Backbone.history.start();
});

