import Dreamy from '../';
import { assert } from 'chai';
import fetch from './mocks/fetch';
import {Promise} from 'es6-promise';

const PUBLIC_TEST_KEY = "6SHU5P2HLDAYECUM";

describe('Dreamy', function() {
  describe('constuctor', function () {
    it('should throw an error without a key', function () {
      assert.throws(function() {
        var d = new Dreamy(undefined);
      })
    });

    it('should return an instance when invoked correctly', function() {
      assert.doesNotThrow(function() {
        var d = new Dreamy(PUBLIC_TEST_KEY, { fetch });
        assert.instanceOf(d, Dreamy);
      });
    });
  });

  describe('#registrations', function () {
    var dreamy;
    beforeEach(function() {
      dreamy = new Dreamy(PUBLIC_TEST_KEY, { fetch });
    });

    it('should return an a list of domain registrations', function() {
      var regs = dreamy.registrations;
      assert.instanceOf(regs, Promise);
      regs.then( value => assert.isArray(value));
    });


  });

});
