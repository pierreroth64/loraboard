import {assert} from 'chai';
import {BaseDevice} from '../app/js/devices/base_device';

(function () {
  'use strict';

  describe('Base device', function () {
    beforeEach(function() {
        this.dev = new BaseDevice(undefined, "123456789", undefined);
    });

    it('should throw an error when processing data', function () {
        assert.throws(() => this.dev.processData(""), "You _must_ implement the processData(..) method in your device class");
    });

  });
})();
