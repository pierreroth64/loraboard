import {MAPBOX_ACCESS_TOKEN} from '../constants/mapbox_const';

export class MainView extends Backbone.View {

  constructor(options) {
    super(options);
    this.setElement('#main');
    this.render();
    this.initMap();
  }

  initMap() {
      L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
      var initialMapPosition = [45.824203, 1.277746];
      this.map = L.mapbox.map('lora-map', 'mapbox.streets').setView(initialMapPosition, 2);
  }

  render() {
    var html = `<div class="row">
        <div class="center-block">
        </div>
      </div>
      <div class="row">
        <div id="lora-map-box" class="col-md-12">
          <div id="lora-map" class="graph-box big-map-box"></div>
        </div>
      </div>
      </div>`;
    this.$el.html(html);
    return this;
  }
}
