const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast');

//Create express Server
const app = express();

//Get port from Heroku set environment variable  or use 3000
const port = process.env.PORT || 3000;

//Define paths for express config
const publicDirectoryPath = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath); //use the viewsPath instead of default views directory
hbs.registerPartials(partialsPath);


//Set up static directory to serve
app.use(express.static(publicDirectoryPath));

//Routes for our website

//Serve the index using hbs
app.get('',(req,res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Christine S.' }); //render the index page view
})

app.get('/about',(req,res) => {
  res.render('about', {
    title: 'About me',
    name: 'Christine S.'
  }); //route for /about 
})

app.get('/help', (req,res) => { //route for /help
  res.render('help', {
    title: 'Help',
    name: 'Christine S.',
    msg: 'Please enter a location to look up the weather for that place. For example, San Jose, CA.'
  });
})


//Weather data
app.get('/weather',(req,res) => { //route for /weather
  const address = req.query.address;
  if (!address){
    return res.send({
      error: 'Please provide an address'
    })
  }
  console.log("In geocode")
  geoCode (address, (error, {lat,long, location} = {} ) => {
    console.log("lat,long", lat, long);
    if (error){
      return res.send({ error });
    } 
    forecast ( lat, long, (error, {weather}={}) => {
      //console.log('forecast', forecast);
      if (error) {
        return res.send({ error });
      }
      res.send({
        address,
        location,
        forecast:weather
      })      
    });
  })  
})



//Wildcard for help 404 pages
app.get('/help/*',(req,res) => {
  res.render('404', {
    message: 'Help article not found',
    title: '404 Page not Found',
    name: 'Christine'
  });
})

//Wildcard * used to catch 404 pages
app.get('*',(req, res) => {
  res.render('404', {
    message: 'My 404 page',
    title: '404 Page not Found',
    name: 'Christine'
  });
})

app.listen(port, ()=> {
  console.log("Server is up on port " + port);
})