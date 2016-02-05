import {assert} from 'chai';
import {LoRaMoteDevice} from '../app/js/devices/loramote/loramote_device';


(function () {
  'use strict';

  describe('LoraMote device', function () {

    beforeEach(function() {
        this.dev = new LoRaMoteDevice();
    });

    it('should initialize codec', function () {
        assert.notEqual(this.dev.getCodec(), undefined);
    });
  });
})();
