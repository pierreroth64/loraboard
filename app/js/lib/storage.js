export class SettingsStorageAPI {

  constructor(storageName) {
    this.storageName = storageName;
    this.stored = {};
  }

  buildItemFromKey(key) {
    return this.storageName + '-' + key;
  }

  store(settings) {
    for (var k in settings) {
      var storageKey = this.buildItemFromKey(k);
      localStorage.setItem(storageKey, settings[k]);
      this.stored[k] = storageKey;
    }
  }

  get(key) {
    var storageKey = this.buildItemFromKey(key);
    var value = localStorage.getItem(storageKey);
    if (value != null && value != undefined) {
      this.stored[key] = storageKey;
    }
    return value;
  }

  clear() {
    for (var k in this.stored) {
      localStorage.removeItem(this.stored[k]);
    }
    this.stored = {};
  }

  getStoredNb() {
    return Object.keys(this.stored).length;
  }

  hasStoredValue(key) {
    var value = this.get(key);
    return ((value == null || value == undefined)) ? false: true;
  }
}
