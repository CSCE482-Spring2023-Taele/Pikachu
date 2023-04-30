/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//var assert = require('assert');
import {dummy} from "../functions.js"
//var dummy = require('../functions.js')
import assert from 'assert' 

describe('Add', function() {
  describe('#dummy()', function() {
      it('should add one to the value passed in', function() {
          assert.equal(dummy(1), 2)
      })
  })
}) 
