export class SettingsStorageAPI {

  constructor(storageName) {
    this.channelItem = storageName + '-channel';
    this.SubscribeKeyItem = storageName + '-subscribe-key';
  }

  store(settings) {
    localStorage.setItem(this.channelItem, settings.channel);
    localStorage.setItem(this.SubscribeKeyItem, settings.subscribeKey);
  }

  get() {
    return {
      channel: localStorage.getItem(this.channelItem),
      subscribeKey: localStorage.getItem(this.SubscribeKeyItem),
    }
  }
}
