import {assert} from 'chai';
import {DeviceManager} from '../app/js/devices/device_manager';
import * as devTypes from '../app/js/devices/device_types';
import {LoraMoteDevice} from '../app/js/devices/loramote/loramote_device'

(function () {
  'use strict';

  describe('Device Manager', function () {
    beforeEach(function() {
      this.devMgr = new DeviceManager();
    });

    it('should create device', function () {
        assert.notEqual(this.devMgr.createDevice("123456", devTypes.DEV_TYPE_LORAMOTE), undefined);
    });

    it('should create LoRaMote device', function () {
        var dev = this.devMgr.createDevice("123456", devTypes.DEV_TYPE_LORAMOTE);
        assert.equal(dev.getType(), devTypes.DEV_TYPE_LORAMOTE);
    });

    it('should create Nucleo device', function () {
        var dev = this.devMgr.createDevice("123456", devTypes.DEV_TYPE_NUCLEO);
        assert.equal(dev.getType(), devTypes.DEV_TYPE_NUCLEO);
    });
  });
})();
