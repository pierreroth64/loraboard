import {assert} from 'chai';
import {NucleoCodec} from '../app/js/devices/nucleo/nucleo_codec';

var BRIGTHNESS_0_FRAME = '00000fffff';
var BRIGTHNESS_100_FRAME = '0000000000';
var BRIGTHNESS_50_FRAME = '000007ffff';
var TOO_LONG_FRAME = '00ffffff1234';
var TOO_SHORT_FRAME = '00ffffff';

(function () {
  'use strict';

  describe('Nucleo codec', function () {
    beforeEach(function() {
          this.codec = new NucleoCodec();
    });
    describe('Decoding', function () {

      it('should decode 100% brigthness', function () {
        assert.equal(this.codec.decodeBrightness(BRIGTHNESS_0_FRAME).value, 0);
      });

      it('should decode 50% brigthness', function () {
        assert.equal(this.codec.decodeBrightness(BRIGTHNESS_50_FRAME).value, 128);
      });

      it('should decode 0% brigthness', function () {
        assert.equal(this.codec.decodeBrightness(BRIGTHNESS_100_FRAME).value, 255);
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
