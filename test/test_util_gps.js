import {assert} from 'chai';
import {isPositionValid, getRandomPosition} from '../app/js/lib/gps';

(function () {
  'use strict';

  describe('GPS', function () {

    describe('Position validation', function () {
        it('should validate correct position', function () {
            assert.isTrue(isPositionValid({latitude: 45.824399, longitude: 1.277633}));
        });

        it('should not validate NaN position', function () {
            assert.isFalse(isPositionValid({latitude: 'not int', longitude: 1.277633}));
        });

        it('should not validate null position', function () {
            assert.isFalse(isPositionValid({latitude: 45.824399, longitude: null}));
        });

        it('should not validate undefined position', function () {
            assert.isFalse(isPositionValid({latitude: 45.824399, longitude: undefined}));
        });

        it('should not validate unset position', function () {
            assert.isTrue(isPositionValid({latitude: 45.824399, longitude: -360}));
            assert.isTrue(isPositionValid({latitude: 0, longitude: 1.277633}));
            assert.isFalse(isPositionValid({latitude: 0, longitude: -360}));
            assert.isFalse(isPositionValid({latitude: 0, longitude: 0}));
            assert.isFalse(isPositionValid({latitude: -360, longitude: 0}));
            assert.isFalse(isPositionValid({latitude: -360, longitude: -360}));
        });
    });
    describe('Random position', function () {
        it('should return random position', function () {
            var initialPos = {latitude: 45.824399, longitude: 1.277633};
            var {latitude, latitude} = getRandomPosition(initialPos);
            assert.isAbove(latitude, initialPos.latitude);
            assert.isAbove(latitude, initialPos.longitude);
        });
    });
  });
})();
