const projectData = {}; //endpoint 
const express = require ('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('website'));
app.use(express.json());

const port = 8000;
const server = app.listen(port, ()=> console.log ('server is running'));
 
app.post('/postWeatherData', (request, response)=>{
    
    const weatherData = request.body;
    projectData['temprature'] = weatherData.temprature;
    projectData['date'] = weatherData.date;
    projectData['city'] = weatherData.city;
    projectData['country'] = weatherData.country;
    projectData['feelings'] = weatherData.feelings;
});
app.get('/getWeatherData', (request, response)=>{
        response.send(projectData);
});
 

 

