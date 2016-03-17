import { WidgetView } from './widget_view';

export class FrameIndicatorView extends WidgetView {

  constructor(options) {
    super(options);
    Backbone.Mediator.subscribe('data:upstream', this.newFrame, this);
    this.jqueryId = `#${this.id}`;
  }

  newFrame() {
    const animationClass = 'animated fadeIn';
    $(this.jqueryId).show();
    $(this.jqueryId).addClass(animationClass);
    $(this.jqueryId).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
      $(this.jqueryId).removeClass(animationClass);
      $(this.jqueryId).hide();
    });
  }
}
