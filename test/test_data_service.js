import {assert} from 'chai';
import {DataService} from '../app/js/cloud/data_service';



(function () {
  'use strict';

  describe('Data Service', function () {
    describe.skip('Data Format', function () {
        beforeEach(function() {
          this.dataSrvc = new DataService();
        });

        it('should be ok with valid data', function () {
            var VALID = {
                            fcnt: 2,
                            data: '00124588EF',
                            EUI: '31245454'
            };
            assert.isTrue(this.dataSrvc.isDataFormatValid(VALID));
        });

        it('should be ko with invalid counter field', function () {
            var INVALID_FCNT = {
                                fcnt: 'not an int',
                                data: '00124588EF',
                                EUI: '31245454'
            };
            assert.isFalse(this.dataSrvc.isDataFormatValid(INVALID_FCNT));
        });

        it('should be ko with missing counter field', function () {
            var MISSING_FCNT = {
                                data: '00124588EF',
                                EUI: '31245454'
            };
            assert.isFalse(this.dataSrvc.isDataFormatValid(MISSING_FCNT));
        });

        it('should be ko with missing data field', function () {
            var MISSING_DATA = {
                                fcnt: 2,
                                EUI: '31245454'
            };
            assert.isFalse(this.dataSrvc.isDataFormatValid(MISSING_DATA));
        });

        it('should be ko with missing EUI field', function () {
            var MISSING_EUI = {
                                fcnt: 2,
                                data: '00124588EF',
            };
            assert.isFalse(this.dataSrvc.isDataFormatValid(MISSING_EUI));
        });

      });
    });
})();
