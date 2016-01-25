
export class ToolBoxView extends Backbone.View {

  constructor(options) {
    super(options);
    this.events = {
      "click #technical-details-button" : "clickTechnical"
    };
    this.setElement('#tool-box');
    this.render();
  }

  render() {
    var html = `<button id="technical-details-button" type="button" class="btn btn-default">
                   <span id="technical-details-button-icon" class="glyphicon glyphicon-menu-right" aria-hidden="true"></span> Details
                </button>`;
    this.$el.html(html);
    return this;
  }

  clickTechnical() {
    if ($('#technical-details-button-icon').hasClass("glyphicon-menu-right")) {
      $('#technical-details-button-icon').removeClass("glyphicon-menu-right");
      $('#technical-details-button-icon').addClass("glyphicon-menu-down");
    } else {
      $('#technical-details-button-icon').removeClass("glyphicon-menu-down");
      $('#technical-details-button-icon').addClass("glyphicon-menu-right");
    }
    Backbone.Mediator.publish('toolbox:technicalClicked');
  }
}
