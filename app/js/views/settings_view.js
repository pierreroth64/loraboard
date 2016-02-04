
import {SettingsStorageAPI} from '../lib/storage';
export class SettingsView extends Backbone.View {

  constructor(options) {
    super(options);
    this.events = {
      'click #save-settings' : 'saveSettings'
    };
    this.setElement('#settings-popup');
    this.api = new SettingsStorageAPI('pubnub');
    this.render();
  }

  render() {
    var upStreamChannel = this.api.get('upStreamChannel');
    var htmlUpStreamChannelValue = (upStreamChannel == null || upStreamChannel == undefined) ? '': `value="${upStreamChannel}"`;

    var downStreamChannel = this.api.get('downStreamChannel');
    var htmlDownStreamChannelValue = (downStreamChannel == null || downStreamChannel == undefined) ? '': `value="${downStreamChannel}"`;

    var subscribeKey = this.api.get('subscribeKey');
    var htmlSubscribeKeyValue = (subscribeKey == null || subscribeKey == undefined) ? '': `value="${subscribeKey}"`;

    var publishKey = this.api.get('publishKey');
    var htmlPublishKeyValue = (publishKey == null || publishKey == undefined) ? '': `value="${publishKey}"`;

    var html = `<div class="modal fade" id="pubnub-setttings" tabindex="-1" role="dialog" aria-labelledby="pubnub-title">
                   <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="pubnub-title">PubNub settings</h4>
                      </div>
                      <div class="modal-body">
                        <div class="input-group">
                          <span class="input-group-addon">Upstream Channel</span>
                          <input type="text" id="pubnub-upstream-channel" class="form-control" placeholder="PubNub Upstream channel" ${htmlUpStreamChannelValue} aria-describedby="basic-addon1">
                        </div>
                        <div class="input-group">
                          <span class="input-group-addon">Upstream Channel</span>
                          <input type="text" id="pubnub-downstream-channel" class="form-control" placeholder="PubNub Downstream channel" ${htmlDownStreamChannelValue} aria-describedby="basic-addon1">
                        </div>
                        <br />
                        <div class="input-group">
                          <span class="input-group-addon">Subscribe Key</span>
                          <input type="text" id="pubnub-subscribe-key" class="form-control" placeholder="PubNub subscribe key" ${htmlSubscribeKeyValue} aria-describedby="basic-addon1">
                        </div>
                        <div class="input-group">
                          <span class="input-group-addon">Subscribe Key</span>
                          <input type="text" id="pubnub-publish-key" class="form-control" placeholder="PubNub publish key" ${htmlPublishKeyValue} aria-describedby="basic-addon1">
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button id="save-settings" type="button" class="btn btn-primary">Save changes</button>
                      </div>
                    </div>
                  </div>
                </div>`;
    this.$el.html(html);
    return this;
  }

  saveSettings() {
    var upStreamChannel = $('#ubnub-upstream-channel').val();
    var downStreamChannel = $('#ubnub-downstream-channel').val();
    var subscribekey = $('#pubnub-subscribe-key').val();
    var publishkey = $('#pubnub-publish-key').val();
    this.api.store({upStreamChannel, downStreamChannel, subscribeKey, publishKey});
    Backbone.Mediator.publish('settings:new');
    $('#pubnub-setttings').modal('hide');
  }
}
