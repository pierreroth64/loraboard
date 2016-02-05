
export class FrameIndicatorView extends Backbone.View {

  constructor(options) {
    super(options);
    Backbone.Mediator.subscribe('data:upstream', this.newFrame, this);
    this.jqueryId = `#${this.id}`;
  }

  newFrame() {
    var animationClass = 'animated fadeIn';
    $(this.jqueryId).show();
    $(this.jqueryId).addClass(animationClass);
    $(this.jqueryId).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
      $(this.jqueryId).removeClass(animationClass);
      $(this.jqueryId).hide();
    });
  }
}
