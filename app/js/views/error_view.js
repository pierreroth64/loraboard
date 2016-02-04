export class ErrorView extends Backbone.View {

  constructor(msg) {
    super();
    this.setElement('#main');
    this.render(msg);
  }

  render(msg) {
    var html = `<div class="row">
        <div class="center-block">
        </div>
      </div>
      <div class="row">
        <h3>Page not found</h3>
        <h5>${msg}</h5>
      </div>`;
    this.$el.html(html);
    return this;
  }
}
