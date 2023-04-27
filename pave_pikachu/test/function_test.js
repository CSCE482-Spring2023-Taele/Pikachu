// var assert = require('assert');
import {dummy, reverseGeocodingAPI, attemptReport, saveLocation, deleteSavedLocation} from "../functions.js"
// var dummy = require('../functions.js');

import assert from 'assert'
describe('Add', function() {
    describe('#dummy()', function() {
        it('should add one to the value passed in', function() {
            assert.equal(dummy(1), 2)
        })
    })
}) 

describe('Add', function() {
    describe('#reverseGeocodingAPI()', function() {
        it('should return address based on coordinates', function() {

            const fetchData = async () => {
                var response = await reverseGeocodingAPI("-73.990593", "40.740121", "pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA");
                assert.equal(response.features[0].place_name, "Strand Bookstore at Club Monaco, 160 5th Ave, New York, New York 10010, United States");
            }

            fetchData();
        })
        
    })
}) 

describe('Add', function() {
    describe('#attemptReport()', function() {
        it('should inject a report to the obstructions database', function() {

            const fetchData = async () => {
                var response = await attemptReport("149", "65", "type", "test", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjUsImlhdCI6MTY4MDY2OTU2N30.xWbBNDIS1dpaPujh6id2AyJ-x2ySHWJsyxLVx2f5eF0");
                assert.equal(response, "obstruction saved");
            }
        
            fetchData();

        })

        it('should fail to inject a report to the obstructions database', function() {

            const fetchData = async () => {
                var response = await attemptReport("149", "65", "type", "test", "badkey");
                assert.equal(response, "failed to save obstruction");
            }
        
            fetchData();

        })
    })
}) 

describe('Add', function() {
    describe('#saveLocation()', function() {
        it('should inject a saved location to the savedlocation database', function() {

            const fetchData = async () => {
                let tempArray = []
                tempArray.push("-73.990593");
                tempArray.push("40.740121");
                var response = await saveLocation(tempArray, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjUsImlhdCI6MTY4MDY2OTU2N30.xWbBNDIS1dpaPujh6id2AyJ-x2ySHWJsyxLVx2f5eF0", "pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA");
                assert.equal(response, "location updated"); 
            }
        
            fetchData();

        })

        it('should fail to inject a saved location to the savedlocation database', function() {

            const fetchData = async () => {
                let tempArray = []
                tempArray.push("-73.990593");
                tempArray.push("40.740121");
                var response = await saveLocation(tempArray, "badkey", "pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA");
                assert.equal(response, "failed to update location");
            }
        
            fetchData();

        })
    })
}) 

describe('Add', function() {
    describe('#deleteSavedLocation()', function() {
        it('should delete a saved location from the savedlocation database', function() {

            const fetchData = async () => {
                let tempArray = []
                tempArray.push("-73.990593");
                tempArray.push("40.740121");
                var response = await saveLocation(tempArray, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjUsImlhdCI6MTY4MDY2OTU2N30.xWbBNDIS1dpaPujh6id2AyJ-x2ySHWJsyxLVx2f5eF0", "pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA");
                
                var response2 = await deleteSavedLocation(tempArray[0], tempArray[1], "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjUsImlhdCI6MTY4MDY2OTU2N30.xWbBNDIS1dpaPujh6id2AyJ-x2ySHWJsyxLVx2f5eF0");
                assert.equal(response2, "location deleted");
            }
        
            fetchData();

        })

        it('should fail to delete a location to the savedlocation database', function() {

            const fetchData = async () => {
                tempArray.push("-73.990593");
                tempArray.push("40.740121");
                var response = await saveLocation(tempArray, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjUsImlhdCI6MTY4MDY2OTU2N30.xWbBNDIS1dpaPujh6id2AyJ-x2ySHWJsyxLVx2f5eF0", "pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA");
                
                var response2 = await deleteSavedLocation(tempArray[0], tempArray[1], "badkey");
                assert.equal(response2, "failed to delete location");
            }
        
            fetchData();

        })
    })
})
