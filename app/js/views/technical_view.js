
import {RealTimeView} from "./realtime_view";

export class TechnicalView extends Backbone.View {

  constructor(options) {
    super(options);
    this.setElement('#technical-window');
    Backbone.Mediator.subscribe('toolbox:technicalClicked', this.toogleVisibility, this);
    new RealTimeView();
  }

  toogleVisibility() {
    $('#technical-window').toggle("slow");
  }
}
