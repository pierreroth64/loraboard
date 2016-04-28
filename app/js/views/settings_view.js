
import { SettingsStorageAPI } from '../lib/storage';
import * as PNSettings from '../constants/pubnub_const.js';

export class SettingsView extends Backbone.View {

  constructor(options) {
    super(options);
    this.events = {
      'click #save-settings': 'saveSettings',
      'click #restore-default-settings': 'restoreDefaultSettings'
    };
    this.setElement('#settings-popup');
    this.api = new SettingsStorageAPI('pubnub');
  }

  render() {
    const upStreamChannel = this.api.get('upStreamChannel');
    const htmlUpStreamChannelValue = (upStreamChannel === null || upStreamChannel === undefined) ? '' : `value="${upStreamChannel}"`;

    const downStreamChannel = this.api.get('downStreamChannel');
    const htmlDownStreamChannelValue = (downStreamChannel === null || downStreamChannel === undefined) ? '' : `value="${downStreamChannel}"`;

    const subscribeKey = this.api.get('subscribeKey');
    const htmlSubscribeKeyValue = (subscribeKey === null || subscribeKey === undefined) ? '' : `value="${subscribeKey}"`;

    const publishKey = this.api.get('publishKey');
    const htmlPublishKeyValue = (publishKey === null || publishKey === undefined) ? '' : `value="${publishKey}"`;

    const html =
    `<div class="modal fade" id="pubnub-setttings" tabindex="-1" role="dialog" aria-labelledby="pubnub-title">
       <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="pubnub-title">PubNub settings</h4>
          </div>
          <div class="modal-body">
            <div class="input-group">
              <span class="input-group-addon">Upstream Channel</span>
              <input type="text" id="pubnub-upstream-channel" class="form-control" placeholder="PubNub Upstream channel"
                    ${htmlUpStreamChannelValue} aria-describedby="basic-addon1">
            </div>
            <div class="input-group">
              <span class="input-group-addon">Downstream Channel</span>
              <input type="text" id="pubnub-downstream-channel" class="form-control" placeholder="PubNub Downstream channel"
                     ${htmlDownStreamChannelValue} aria-describedby="basic-addon1">
            </div>
            <br />
            <div class="input-group">
              <span class="input-group-addon">Subscribe Key</span>
              <input type="text" id="pubnub-subscribe-key" class="form-control" placeholder="PubNub subscribe key"
                    ${htmlSubscribeKeyValue} aria-describedby="basic-addon1">
            </div>
            <div class="input-group">
              <span class="input-group-addon">Publish Key</span>
              <input type="text" id="pubnub-publish-key" class="form-control" placeholder="PubNub publish key"
                     ${htmlPublishKeyValue} aria-describedby="basic-addon1">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button id="save-settings" type="button" class="btn btn-primary">Save changes</button>
            <button id="restore-default-settings" type="button" class="btn btn-success pull-left">Restore default</button>
          </div>
        </div>
      </div>
    </div>`;
    this.$el.html(html);
    return this;
  }

  saveSettings() {
    const upStreamChannel = $('#pubnub-upstream-channel').val();
    const downStreamChannel = $('#pubnub-downstream-channel').val();
    const subscribeKey = $('#pubnub-subscribe-key').val();
    const publishKey = $('#pubnub-publish-key').val();
    this.storeSettings(upStreamChannel, downStreamChannel, subscribeKey, publishKey);
  }

  restoreDefaultSettings() {
    this.storeSettings(PNSettings.PUBNUB_DEFAULT_UPSTREAM_CHANNEL,
                       PNSettings.PUBNUB_DEFAULT_DOWNSTREAM_CHANNEL,
                       PNSettings.PUBNUB_DEFAULT_SUBSCRIBE_KEY,
                       PNSettings.PUBNUB_DEFAULT_PUBLISH_KEY);
  }

  storeSettings(upStreamChannel, downStreamChannel, subscribeKey, publishKey) {
    this.api.store({ upStreamChannel, downStreamChannel, subscribeKey, publishKey });
    Backbone.Mediator.publish('settings:new');
    $('#pubnub-setttings').modal('hide');
  }
}
