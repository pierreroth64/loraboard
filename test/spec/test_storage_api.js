import {assert} from 'chai';
import {SettingsStorageAPI} from '../../app/js/lib/storage';

(function () {
  'use strict';

  beforeEach(function() {
    this.api = new SettingsStorageAPI("test-storage");
  });

  describe('Settings API', function () {
    it('should store credentials', function () {
      var creds = {channel: 'my-channel', subscribeKey: 'my-key'};
      this.api.store(creds);
      assert.equal(this.api.get().channel, 'my-channel');
      assert.equal(this.api.get().subscribeKey, 'my-key');
    });
  });
})();
