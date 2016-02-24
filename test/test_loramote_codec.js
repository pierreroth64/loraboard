import {assert} from 'chai';
import {LoRaMoteCodec} from '../app/js/devices/loramote/loramote_codec';

var VALID_FRAME = '00270a0abe0157343d9cd8ffc6bd00ee';
var VALID_FRAME_LED_ON = '01270a0abe0157343d9cd8ffc6bd00ee';
var TOO_LONG_FRAME = '00270a0abe0157343d9cd8ffc6bd00ee000000000';
var TOO_SHORT_FRAME = '00270a0abe0157343d9cd8';

(function () {
  'use strict';

  describe('LoraMote codec', function () {
    beforeEach(function() {
          this.codec = new LoRaMoteCodec();
    });
    describe('Decoding', function () {

      it('should decode Led state On', function () {
        assert.equal(this.codec.decodeLedState(VALID_FRAME_LED_ON).value, true);
      });

      it('should decode Led state Off', function () {
        assert.equal(this.codec.decodeLedState(VALID_FRAME).value, false);
      });

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

   describe('Encoding', function () {

      it('should encode Led On command', function () {
        var formattedEUI = '01-00-00-00-00-00-00-01';
        var expected = { cmd: `{\"command\": \"mote send 01-00-00-00-00-00-00-01 port 2 data 1\"}` };
        assert.deepEqual(this.codec.encodeDriveLedCmd(formattedEUI, true), expected);
      });

      it('should encode Led Off command', function () {
        var formattedEUI = '01-00-00-00-00-00-00-01';
        var expected = { cmd: `{\"command\": \"mote send 01-00-00-00-00-00-00-01 port 2 data 0\"}` };
        assert.deepEqual(this.codec.encodeDriveLedCmd(formattedEUI, false), expected);
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
