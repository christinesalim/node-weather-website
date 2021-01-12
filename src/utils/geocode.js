const request = require('postman-request');
const mapbox = require('mapbox');

const geoCode = (address, callback) => {
  const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoiY2hyaXN0aW5lc2FsaW0iLCJhIjoiY2tqa253NnQ0N2ZpOTJ4cWo0aDh5bHU5eCJ9.YQ8YdR325Y5yr7397FUPxg&limit=1';

  request({ url, json: true,}, (error, response, body)=> {
    if (error){
      callback('Unable to connect to location services');
    }else if(body.message){
      callback('Unable to get geolocation data');
    }else {
      if (body.features.length === 0){
        callback('Unable to find location. Try another search');
      }else {
        const {center, place_name} = body.features[0];
        const lat = center[1];
        const long = center[0];        
        callback(null, {location:place_name, lat, long});
      }
    }
  })
}

module.exports = geoCode;