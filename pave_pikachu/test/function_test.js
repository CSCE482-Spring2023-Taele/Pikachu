//var assert = require('assert');
import {dummy, geocodingAPI, getSavedLocations} from "../functions.js"
//var dummy = require('../functions.js')
import assert from 'assert'    

const mapboxToken = "pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjUsImlhdCI6MTY4MDY2OTU2N30.xWbBNDIS1dpaPujh6id2AyJ-x2ySHWJsyxLVx2f5eF0"

describe('Add', function() {
    describe('#dummy()', function() {
        it('should add one to the value passed in', function() {
            assert.equal(dummy(1), 2)
        })
    })
}) 


describe('Geocoding', function() {
    describe('#geocodingAPI()', function() {
        it('should return at least one item', function() {
            const fetch = async () => {
                const response = await geocodingAPI("Zachary Engineering Center", mapboxToken);

                assert.equal(response.features.length > 0, true)
            }
            fetch().catch(err => console.log(err))
        })
    })
})

describe('Get saved locations', function() {
    describe('#getSavedLocation()', function() {
        it('should retrieve saved locations for a user', function() {
            const fetch = async () => {
                const response = await getSavedLocations(token);
                console.log(response)
                assert.equal(response.features.length > 0, true)
            }
            fetch().catch(err => console.log(err))
        })
    })
})