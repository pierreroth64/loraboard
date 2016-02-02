import {assert} from 'chai';
import {LoRaMoteDevice} from '../app/js/devices/loramote/loramote_device';


(function () {
  'use strict';

  beforeEach(function() {
    this.dev = new LoRaMoteDevice();
  });

  describe('LoraMote device', function () {
    it('should initialize decoder', function () {
      assert.notEqual(this.dev.getDecoder(), undefined);
    });
  });
})();
