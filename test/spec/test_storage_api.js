import {assert} from 'chai';
import {SettingsStorageAPI} from '../../app/js/lib/storage';

(function () {
  'use strict';

  beforeEach(function() {
    this.api = new SettingsStorageAPI("test-storage");
  });

  afterEach(function() {
    this.api.clear();
  });

  describe('Settings API', function () {
    it('should store credentials', function () {
      var creds = {channel: 'my-channel', subscribeKey: 'my-key'};
      this.api.store(creds);
      assert.equal(this.api.get('channel'), 'my-channel');
      assert.equal(this.api.get('subscribeKey'), 'my-key');
    });

    it('should clear stored credentials', function () {
      var creds = {channel: 'my-channel', subscribeKey: 'my-key'};
      this.api.store(creds);
      assert.equal(this.api.get('channel'), 'my-channel');
      this.api.clear();
      assert.equal(this.api.get('channel'), null);
    });

    it('should have no values on startup', function () {
      assert.equal(this.api.getStoredNb(), 0);
      this.api.store({channel: 'my-channel', subscribeKey: 'my-key'});
      assert.equal(this.api.getStoredNb(), 2);
    });

    it('should say if value is stored', function () {
      assert.isFalse(this.api.hasStoredValue('channel'));
      this.api.store({channel: "my-funny-channel"});
      assert.isTrue(this.api.hasStoredValue('channel'));
    });
  });
})();
