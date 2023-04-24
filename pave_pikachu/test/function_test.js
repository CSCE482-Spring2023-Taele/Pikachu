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