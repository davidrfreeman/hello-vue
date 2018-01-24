import Vue from 'vue'
import axios from 'axios'

new Vue({
  el: '#app',
  data: {
    city: 'Your City',
    lat: null,
    lon: null,
    weatherData: null,
    temp: null,
    // 	weatherUrl is prepended with url to avoid CORS error
    weatherUrl: 'https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?',
    apiKey: '5ff51663eb541e74296530b17a1eaf5e'
  },
  methods: {
    getLatAndLong: function () {
      axios.get('https://ipinfo.io').then((res) => {
        let locString = res.data.loc.split(",")
        this.city = res.data.city
        this.lat = locString[0]
        this.lon = locString[1]
        // now that the latitude and longitude has been retrieved we can call getWeather method
        this.getWeather()
      }, (error) => {
        console.log(error.message)
      })
    },
    // axios will perform ajax request to openweathermap api to get the current weather using lat and lon returned from getLatAndLong method
    getWeather: function () {
      // perform GET request using string template and upon success set weatherData varible to the response object
      axios.get(`${this.weatherUrl}appid=${this.apiKey}&lat=${this.lat}&lon=${this.lon}`).then((res) => {
        this.weatherData = res.data
        this.temp = this.weatherData.main.temp
      }, (error) => {
        console.log(error.message)
      })
    }
  },
  mounted: function () {
    this.getLatAndLong()
  }
})
