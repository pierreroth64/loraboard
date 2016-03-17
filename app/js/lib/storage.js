export class SettingsStorageAPI {

  constructor(storageName) {
    this.storageName = storageName;
    this.stored = {};
  }

  buildItemFromKey(key) {
    return `${this.storageName}-${key}`;
  }

  store(settings) {
    for (const k in settings) {
      if (settings.hasOwnProperty(k)) {
        const storageKey = this.buildItemFromKey(k);
        localStorage.setItem(storageKey, settings[k]);
        this.stored[k] = storageKey;
      }
    }
  }

  get(key) {
    const storageKey = this.buildItemFromKey(key);
    const value = localStorage.getItem(storageKey);
    if (value !== null && value !== undefined) {
      this.stored[key] = storageKey;
    }
    return value;
  }

  clear() {
    for (const k in this.stored) {
      if (this.stored.hasOwnProperty(k)) {
        localStorage.removeItem(this.stored[k]);
      }
    }
    this.stored = {};
  }

  getStoredNb() {
    return Object.keys(this.stored).length;
  }

  hasStoredValue(key) {
    const value = this.get(key);
    return !((value === null || value === undefined));
  }
}
