 // var assert = require('assert');
import {reverseGeocodingAPI, attemptReport, saveLocation, deleteSavedLocation, geocodingAPI, getSavedLocations, deleteAccount} from "../functions.js"
// var dummy = require('../functions.js');
import assert from 'assert'

const mapboxToken = "pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjUsImlhdCI6MTY4MDY2OTU2N30.xWbBNDIS1dpaPujh6id2AyJ-x2ySHWJsyxLVx2f5eF0"


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
        it('should retrieve saved locations for a user if any', function() {
            const fetch = async () => {
                const response = await getSavedLocations(token);
                
                assert.equal(response.length >= 0, true)
            }
            fetch().catch(err => console.log(err))
        })

        it('should fail to retrieve saved locations for a user', function() {
            const fetch = async () => {
                const response = await getSavedLocations("bad token");
                
                assert.equal(response.message, "jwt malformed")
            }
            fetch().catch(err => console.log(err))
        })
    })
})

describe('Find an address', function() {
    describe('#reverseGeocodingAPI()', function() {
        it('should return address based on coordinates', function() {

            const fetchData = async () => {
                var response = await reverseGeocodingAPI("-73.990593", "40.740121", "mapboxToken");
                assert.equal(response.features[0].place_name, "Strand Bookstore at Club Monaco, 160 5th Ave, New York, New York 10010, United States");
            }

            fetchData();
        })
        
    })
}) 

describe('Report an obstruction', function() {
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

describe('Save a location', function() {
    describe('#saveLocation()', function() {
        it('should inject a saved location to the savedlocation database', function() {

            const fetchData = async () => {
                let tempArray = []
                tempArray.push("-73.990593");
                tempArray.push("40.740121");
                var response = await saveLocation(tempArray, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjUsImlhdCI6MTY4MDY2OTU2N30.xWbBNDIS1dpaPujh6id2AyJ-x2ySHWJsyxLVx2f5eF0", "mapboxToken");
                assert.equal(response, "location updated"); 
            }
        
            fetchData();

        })

        it('should fail to inject a saved location to the savedlocation database', function() {

            const fetchData = async () => {
                let tempArray = []
                tempArray.push("-73.990593");
                tempArray.push("40.740121");
                var response = await saveLocation(tempArray, "badkey", "mapboxToken");
                assert.equal(response, "failed to update location");
            }
        
            fetchData();

        })
    })
}) 

describe('Delete a saved location', function() {
    describe('#deleteSavedLocation()', function() {
        it('should delete a saved location from the savedlocation database', function() {

            const fetchData = async () => {
                let tempArray = []
                tempArray.push("-73.990593");
                tempArray.push("40.740121");
                var response = await saveLocation(tempArray, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjUsImlhdCI6MTY4MDY2OTU2N30.xWbBNDIS1dpaPujh6id2AyJ-x2ySHWJsyxLVx2f5eF0", "mapboxToken");
                
                var response2 = await deleteSavedLocation(tempArray[0], tempArray[1], "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjUsImlhdCI6MTY4MDY2OTU2N30.xWbBNDIS1dpaPujh6id2AyJ-x2ySHWJsyxLVx2f5eF0");
                assert.equal(response2, "location deleted");
            }
        
            fetchData();

        })


        it('should fail to delete a location to the savedlocation database', function() {

            const fetchData = async () => {
                tempArray.push("-73.990593");
                tempArray.push("40.740121");
                var response = await saveLocation(tempArray, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjUsImlhdCI6MTY4MDY2OTU2N30.xWbBNDIS1dpaPujh6id2AyJ-x2ySHWJsyxLVx2f5eF0", "mapboxToken");
                
                var response2 = await deleteSavedLocation(tempArray[0], tempArray[1], "badkey");
                assert.equal(response2, "failed to delete location");
            }
        
            fetchData();

        })
    })
})
