import { WidgetView } from './widget_view';

export class ToolBoxView extends WidgetView {

  constructor(options) {
    super(options);
    this.events = {
      'click #technical-details-button': 'clickTechnical',
      'click #technical-start-stop-button': 'clickStartStop',
    };
    this.dataService = options.dataService;
    this.setElement(`#${this.id}`);
    this.render();
  }

  render() {
    const startStopClass = this.dataService.isStarted ? 'glyphicon-stop' : 'glyphicon-play';
    const html = `
      <button id="technical-details-button" type="button" class="btn btn-default">
         <span id="technical-details-button-icon" class="glyphicon glyphicon-menu-right" aria-hidden="true"></span> Details
      </button>
      <button id="technical-start-stop-button" type="button" class="btn btn-default">
         <span id="technical-start-stop-button-icon" class="glyphicon ${startStopClass}" aria-hidden="true"></span> Data gathering
      </button>`;
    this.$el.html(html);
    return this;
  }

  clickTechnical() {
    if ($('#technical-details-button-icon').hasClass('glyphicon-menu-right')) {
      $('#technical-details-button-icon').addClass('glyphicon-menu-down');
      $('#technical-details-button-icon').removeClass('glyphicon-menu-right');
    } else {
      $('#technical-details-button-icon').addClass('glyphicon-menu-right');
      $('#technical-details-button-icon').removeClass('glyphicon-menu-down');
    }
    Backbone.Mediator.publish('toolbox:technicalClicked');
  }

  clickStartStop() {
    if (this.dataService.isStarted) {
      $('#technical-start-stop-button-icon').removeClass('glyphicon-stop');
      $('#technical-start-stop-button-icon').addClass('glyphicon-play');
      this.dataService.stop();
    } else {
      $('#technical-start-stop-button-icon').removeClass('glyphicon-play');
      $('#technical-start-stop-button-icon').addClass('glyphicon-stop');
      this.dataService.start();
    }
  }
}
