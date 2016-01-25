
export class FrameIndicatorView extends Backbone.View {

  constructor(options) {
    super(options);
    Backbone.Mediator.subscribe('data:newFrame', this.newFrame, this);
  }

  newFrame() {
    var animationClass = 'animated fadeIn';
    $('#frame-indicator').show();
    $('#frame-indicator').addClass(animationClass);
    $('#frame-indicator').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $('#frame-indicator').removeClass(animationClass);
      $('#frame-indicator').hide();
    });
  }
}
