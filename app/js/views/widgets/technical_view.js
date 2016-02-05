import {WidgetView} from './widget_view';
import {RealTimeView} from "./realtime_view";

export class TechnicalView extends WidgetView {

  constructor(options) {
    super(options);
    Backbone.Mediator.subscribe('toolbox:technicalClicked', this.toogleVisibility, this);
    this.jqueryId = `#${this.id}`;
    new RealTimeView({eui: this.eui});
  }

  toogleVisibility() {
    $(this.jqueryId).toggle("slow");
  }
}
