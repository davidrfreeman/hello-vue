<template>
  <div id="app">
    <module1 />
    <h2 id="city-name"> {{ weatherData.name }} </h2>
    <!-- <h3>{{ weather }}</h3> -->
  </div>
</template>

<script>
  import axios from 'axios'
  import module1 from "./templates/module1"

    let lat
    let lon
    let weatherData
    let weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?units=imperial&'
    const apiKey = '5ff51663eb541e74296530b17a1eaf5e'

export default {
  name: 'app',
  components: {
    module1
  },
  data() {
    return {
      
    }
  },
  methods: {
    // axios will perform ajax request to get lat and long fron ipinfo.io set lat and lon variable to the api's response
    getLatAndLong: function() {
      axios.get('https://ipinfo.io').then((res) => {
        let locString = res.data.loc.split(",")
        lat = locString[0]
        lon = locString[1]
        // now that the latitude and longitude has been retrieved we can call getWeather method
        this.getWeather()
      },(error) => {
        console.log(error)
      })
    }
    
    ,
    // axios will perform ajax request to openweathermap api to get the current weather using lat and lon returned from getLatAndLong method
    getWeather: function() {
      // perform GET request using string template and upon success set weatherData varible to the response object
      axios.get(`${weatherUrl}lat=${lat}&lon=${lon}&appid=${apiKey}`).then((res) => {
        this.weatherData = res.data
        console.log(this.weatherData)
      }, (error) => {
        console.log(error)
      })
    }
  },
  // Lifecycle method, once the component is mounted the getLatAndLong method will be called
   mounted: function() {
    this.getLatAndLong()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}

#city-name {
  text-align: center;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
