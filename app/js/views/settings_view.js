
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
    var channel = this.api.get('channel');
    var htmlChannelValue = (channel == null || channel == undefined) ? '': `value="${channel}"`;
    var subscribeKey = this.api.get('subscribeKey');
    var htmlSubscribeKeyValue = (subscribeKey == null || subscribeKey == undefined) ? '': `value="${subscribeKey}"`;

    var html = `<div class="modal fade" id="pubnub-setttings" tabindex="-1" role="dialog" aria-labelledby="pubnub-title">
                   <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="pubnub-title">PubNub settings</h4>
                      </div>
                      <div class="modal-body">
                        <div class="input-group">
                          <span class="input-group-addon">Channel</span>
                          <input type="text" id="pubnub-channel" class="form-control" placeholder="PubNub channel" ${htmlChannelValue} aria-describedby="basic-addon1">
                        </div>
                        <br />
                        <div class="input-group">
                          <span class="input-group-addon">Subscribe Key</span>
                          <input type="text" id="pubnub-subscribe-key" class="form-control" placeholder="PubNub subscribe key" ${htmlSubscribeKeyValue} aria-describedby="basic-addon1">
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
    var channel = $('#pubnub-channel').val();
    var key = $('#pubnub-subscribe-key').val();
    this.api.store({channel: channel, subscribeKey: key});
    Backbone.Mediator.publish('settings:new');
    $('#pubnub-setttings').modal('hide');
  }
}
