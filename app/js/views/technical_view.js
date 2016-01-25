
export class TechnicalView extends Backbone.View {

  constructor(options) {
    super(options);
    this.setElement('#technical-window');
    Backbone.Mediator.subscribe('toolbox:technicalClicked', this.toogleVisibility, this);
  }

  toogleVisibility() {
    $('#technical-window').toggle("slow");
  }
}
