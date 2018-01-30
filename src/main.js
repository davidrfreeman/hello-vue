import Vue from 'vue'
import axios from 'axios'

var vm = new Vue({
  el: '#app',
  data: {
    city: 'Your City',
    lat: null,
    lon: null,
    weatherData: null,
    description: ' Weather Decription',
    high: null,
    low: null,
    temp: null,
    tempType: 'FAHRENHEIT',
    // 	weatherUrl is prepended with url to avoid CORS error
    weatherUrl: 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?',
    apiKey: '5ff51663eb541e74296530b17a1eaf5e',
    seen: false
  },
  filters: {
    properTemp: function (temp, tempFormat) {
      if (tempFormat === 'FAHRENHEIT') {
        return Math.round(temp * (9 / 5) - 459.67)
        console.log(tempFormat)
      } else {
        return Math.round(temp - 273.15)
        console.log(tempFormat)
      }
    },
    capitalize: function (str) {
      if (!str) return ''
      let temp = []
      str = str.toLowerCase().split(' ')
      str.map((a, b) => {
        temp.push(a[0].toUpperCase() + a.slice(1))
      })
      return temp.join(' ')

    }
  },
  methods: {
    // axios will perform ajax request to get lat and long fron ipinfo.io set lat and lon variable to the api's response
    getLatAndLong: function () {
      if (!navigator.geolocation) {
        axios.get('https://ipinfo.io').then((res) => {
          let locString = res.data.loc.split(",")
          this.city = res.data.city
          this.lat = locString[0]
          this.lon = locString[1]
          // now that the latitude and longitude has been retrieved we can call getWeather method
          this.getWeather(false)

        }, (error) => {
          console.log(error.message)
        })
      } else {
        this.getPosition().then((data) => {
          this.lat = data.coords.latitude
          this.lon = data.coords.longitude
          // now that the latitude and longitude has been retrieved we can call getWeather method
          this.getWeather(true)
        })
      }
    },
    getPosition: function (options) {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      })
    },
    // axios will perform ajax request to openweathermap api to get the current weather using lat and lon returned from getLatAndLong method
    getWeather: function (option) {
      // perform GET request using string template and upon success set weatherData varible to the response object
      axios.get(`${this.weatherUrl}appid=${this.apiKey}&lat=${this.lat}&lon=${this.lon}`).then((res) => {
        this.weatherData = res.data
        if (option) { this.city = this.weatherData.name }
        this.temp = this.weatherData.main.temp
        this.description = this.weatherData.weather[0].description
        this.max = this.weatherData.main.temp_max
        this.min = this.weatherData.main.temp_min
        this.seen = true
      }, (error) => {
        console.log(error.message)
      })
    }
  }
})
