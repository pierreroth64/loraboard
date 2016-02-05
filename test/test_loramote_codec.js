import {assert} from 'chai';
import {LoRaMoteCodec} from '../app/js/devices/loramote/loramote_codec';

var VALID_FRAME = '00270a0abe0157343d9cd8ffc6bd00ee';
var TOO_LONG_FRAME = '00270a0abe0157343d9cd8ffc6bd00ee000000000';
var TOO_SHORT_FRAME = '00270a0abe0157343d9cd8';

(function () {
  'use strict';

  describe('LoraMote codec', function () {
    beforeEach(function() {
          this.codec = new LoRaMoteCodec();
    });
    describe('Decoding', function () {

      it('should decode temperature', function () {
        assert.equal(this.codec.decodeTemperature(VALID_FRAME).value, 27.5);
      });

      it('should decode pressure', function () {
        assert.equal(this.codec.decodePressure(VALID_FRAME).value, 999.4);
      });

      it('should decode battery level', function () {
        assert.equal(this.codec.decodeBatteryLevel(VALID_FRAME).value, 20);
      });

      it('should decode latitude', function () {
        assert.equal(this.codec.decodeLatitude(VALID_FRAME).value, 43.321414389778894);
      });

      it('should decode longitude', function () {
        assert.equal(this.codec.decodeLongitude(VALID_FRAME).value, -0.3145051377421737);
      });

      it('should decode altitude', function () {
        assert.equal(this.codec.decodeAltitude(VALID_FRAME).value, 238);
      });

      it('should decode measured altitude', function () {
        assert.equal(this.codec.decodeMeasuredAltitude(VALID_FRAME).value, 34.3);
      });
    });
    describe('Matching', function () {

      it('should match on valid data', function () {
        assert.isTrue(this.codec.mayMatch(VALID_FRAME));
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
