import {assert} from 'chai';
import {NucleoLightingCodec} from '../app/js/devices/nucleo_legrand/nucleo_lighting_codec';

var BRIGTHNESS_0_FRAME = '000fffff';
var BRIGTHNESS_100_FRAME = '00000000';
var BRIGTHNESS_50_FRAME = '0007ffff';
var TOO_LONG_FRAME = 'ffffff1234';
var TOO_SHORT_FRAME = 'ffffff';

(function () {
  'use strict';

  describe('Nucleo lighting codec', function () {
    beforeEach(function() {
          this.codec = new NucleoLightingCodec();
    });

    describe('Encoding', function () {

      it('should encode test command', function () {
        var formattedEUI = '01-00-00-00-00-00-00-01';
        var expected = { cmd: `{\"command\": \"mote send 01-00-00-00-00-00-00-01 port 30 data 32\"}` };
        assert.deepEqual(this.codec.encodeTestCmd(formattedEUI), expected);
      });

    });

    describe('Matching', function () {

      it('should match on valid data', function () {
        assert.isTrue(this.codec.mayMatch(BRIGTHNESS_100_FRAME));
      });

      it('should not match on too long data', function () {
        assert.isFalse(this.codec.mayMatch(TOO_LONG_FRAME));
      });

      it('should not match on too short data', function () {
        assert.isFalse(this.codec.mayMatch(TOO_SHORT_FRAME));
      });

    });
  });
})();
