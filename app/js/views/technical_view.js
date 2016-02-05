
import {RealTimeView} from "./realtime_view";

export class TechnicalView extends Backbone.View {

  constructor(options) {
    super(options);
    Backbone.Mediator.subscribe('toolbox:technicalClicked', this.toogleVisibility, this);
    this.jqueryId = `#${this.id}`;
    new RealTimeView();
  }

  toogleVisibility() {
    $(this.jqueryId).toggle("slow");
  }
}
