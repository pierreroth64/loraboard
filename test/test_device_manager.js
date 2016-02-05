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
        assert.equal(this.devMgr.getDeviceNb(), 1);
    });

    it('should remove device', function () {
        this.devMgr.createDevice("123456", devTypes.DEV_TYPE_LORAMOTE);
        this.devMgr.createDevice("78945688888", devTypes.DEV_TYPE_LORAMOTE);
        assert.equal(this.devMgr.getDeviceNb(), 2);

        this.devMgr.removeDevice("123456");
        assert.equal(this.devMgr.getDeviceNb(), 1);
    });

    it('should remove device silently if device is not there', function () {
        this.devMgr.createDevice("123456", devTypes.DEV_TYPE_LORAMOTE);
        this.devMgr.createDevice("78945688888", devTypes.DEV_TYPE_LORAMOTE);
        assert.equal(this.devMgr.getDeviceNb(), 2);

        this.devMgr.removeDevice("8888888");
        assert.equal(this.devMgr.getDeviceNb(), 2);
    });

    it('should create LoRaMote device', function () {
        var dev = this.devMgr.createDevice("123456", devTypes.DEV_TYPE_LORAMOTE);
        assert.equal(dev.getType(), devTypes.DEV_TYPE_LORAMOTE);
    });

    it('should create Nucleo device', function () {
        var dev = this.devMgr.createDevice("123456", devTypes.DEV_TYPE_NUCLEO);
        assert.equal(dev.getType(), devTypes.DEV_TYPE_NUCLEO);
    });

    it('should error when creating a device already there', function () {
        this.devMgr.createDevice("123456", devTypes.DEV_TYPE_NUCLEO);
        assert.throws(() => this.devMgr.createDevice("123456", devTypes.DEV_TYPE_NUCLEO), "Device with this EUI already exists");
    });

    it('should retrieve devices from eui', function () {
        this.devMgr.createDevice("123456", devTypes.DEV_TYPE_NUCLEO);
        this.devMgr.createDevice("789123", devTypes.DEV_TYPE_LORAMOTE);
        this.devMgr.createDevice("456789", devTypes.DEV_TYPE_LORAMOTE);

        assert.notEqual(this.devMgr.findDevice("789123"), undefined);
        assert.equal(this.devMgr.findDevice("888888"), undefined);
    });

  });
})();
