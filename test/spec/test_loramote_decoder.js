import {assert} from 'chai';
import {LoRaMoteDataDecoder} from '../../app/js/data/decoders/loramote_decoder';

var VALID_FRAME = '00270a0abe0157343d9cd8ffc6bd00ee';
(function () {
  'use strict';

  beforeEach(function() {
    this.decoder = new LoRaMoteDataDecoder();
  });

  describe('LoraMote data decoding', function () {
    it('should decode temperature', function () {
      assert.equal(this.decoder.decodeTemperature(VALID_FRAME).value, 27.5);
    });
    it('should decode pressure', function () {
      assert.equal(this.decoder.decodePressure(VALID_FRAME).value, 999.4);
    });
    it('should decode battery level', function () {
      assert.equal(this.decoder.decodeBatteryLevel(VALID_FRAME).value, 20);
    });
    it('should decode latitude', function () {
      assert.equal(this.decoder.decodeLatitude(VALID_FRAME).value, 43.321414389778894);
    });
    it('should decode longitude', function () {
      assert.equal(this.decoder.decodeLongitude(VALID_FRAME).value, -0.3145051377421737);
    });
    it('should decode altitude', function () {
      assert.equal(this.decoder.decodeAltitude(VALID_FRAME).value, 238);
    });
    it('should decode measured altitude', function () {
      assert.equal(this.decoder.decodeMeasuredAltitude(VALID_FRAME).value, 34.3);
    });
  });
})();
