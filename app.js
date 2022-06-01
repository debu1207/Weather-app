const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
const port = 8080;
const apikey = "aba999847faa91b7dc3930d187bb061a";

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    const city = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=";

    https.get(url + apikey + "&units=metric", (response) => {
        response.on('data', (data) => {
            
            
            const weatherdata = JSON.parse(data);
            if(weatherdata.cod === '404'){
                res.write("Some error occured. Maybe you have given an invalid city name. Please" + "<a href='/'>try again</a> "+"with valid city name. ")
                res.write("Thank you.");
                res.send();
            }
            const Temp = weatherdata.main.temp;
            const Ftemp = ((Temp * 9/5) + 32).toFixed(1);
            const mintemp = weatherdata.main.temp_min;
            const maxtemp = weatherdata.main.temp_max;
            const humidity = weatherdata.main.humidity;
            const desc = weatherdata.weather[0].description;
            const iconURL = "http://openweathermap.org/img/wn/"+ weatherdata.weather[0].icon +"@2x.png";

            res.render('weather', {city: city, desc: desc, temp: Temp, ftemp: Ftemp, icon: iconURL, mintemp: mintemp, maxtemp: maxtemp, humidity: humidity})

        }).on('TypeError', (e) => {
            console.error(e);
            res.write("Some error occured. Maybe you have given an invalid city name. Please try again with valid city name. ")
            res.write("Thank you.");
            res.send();
        })
    });

});

app.listen(port, ()=> {
    console.log("server running on port 8080...");
});