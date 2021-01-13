const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {

  const url = 'http://api.weatherstack.com/current?access_key=5a9fd3bb29b692027a39e5d9752c394b&query=' + latitude + ',' + longitude + '&units=f';
  request({url, json: true}, (error, response, body={})=> {
    console.log(error, body);
    if (error){//low level request error
        callback("Unable to connect to weatherstack.com");    
    } else if (body.error) {//API error
      callback("Unable to get weather data - API error")
    } else {
      if (body.current !== undefined){
        const {
          weather_descriptions, 
          temperature, 
          feelslike,
          humidity } = body.current;
        const data = "The temperature is " + temperature + 
        " degrees and it feels like " + feelslike + " degrees. It is currently " + weather_descriptions[0].toLowerCase() + ". The humidity is " + humidity + " percent.";
        callback(null,{weather:data});//null value for error
      } else {
        //Handle error when no error is present, but data is missing
        callback("Unable to get weather data - API error")
      }
    }
  });
}

module.exports = forecast;