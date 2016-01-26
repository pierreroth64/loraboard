
export class SettingsView extends Backbone.View {

  constructor(options) {
    super(options);
    this.setElement('#settings-popup');
    this.render();
  }

  render() {
    var html = `<div class="modal fade" id="pubnub-setttings" tabindex="-1" role="dialog" aria-labelledby="pubnub-title">
                   <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="pubnub-title">PubNub settings</h4>
                      </div>
                      <div class="modal-body">
                        <div class="input-group">
                          <span class="input-group-addon" id="pubnub-channel">Channel</span>
                          <input type="text" class="form-control" placeholder="PubNub channel" aria-describedby="basic-addon1">
                        </div>
                        <br />
                        <div class="input-group">
                          <span class="input-group-addon" id="pubnub-subscribe-key">Subscribe Key</span>
                          <input type="text" class="form-control" placeholder="PubNub subscribe key" aria-describedby="basic-addon1">
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                      </div>
                    </div>
                  </div>
                </div>`;
    this.$el.html(html);
    return this;
  }
}
