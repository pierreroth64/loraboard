export class SettingsStorageAPI {

  constructor(storageName) {
    this.storageName = storageName;
    this.stored = {};
  }

  buildItemFromKey(key) {
    return this.storageName + '-' + key;
  }

  store(settings) {
    for (let k in settings) {
      let storageKey = this.buildItemFromKey(k);
      localStorage.setItem(storageKey, settings[k]);
      this.stored[k] = storageKey;
    }
  }

  get() {
    var entries = {};
    for (let k in this.stored) {
      entries[k] = localStorage.getItem(this.stored[k]);
    }
    return entries;
  }

  clear() {
    for (let k in this.stored) {
      localStorage.removeItem(this.stored[k]);
    }
    this.stored = {};
  }

  getStoredNb() {
    return Object.keys(this.stored).length;
  }

  hasStoredValue(key) {
    var value = localStorage.getItem(this.buildItemFromKey(key));
    return ((value == null || value == undefined)) ? false: true;
  }
}
