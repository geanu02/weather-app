import data from "./secrets.json" assert { type: 'json' }

const { apiKey } = data
const searchForm = document.getElementById('searchForm')
const txtCity = document.getElementById('txtCity')
const infoForecast = document.getElementById('infoForecast')
const infoHigh = document.getElementById('infoHigh')
const infoLow = document.getElementById('infoLow')
const infoTemp = document.getElementById('infoTemp')
const infoFeels = document.getElementById('infoFeels')
const infoHumidity = document.getElementById('infoHumidity')
const videoSource = document.getElementById('videoSource')

async function apiCall(cityName) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
    if (res.ok) {
        const data = await res.json()
        return data
    }
}

(async () => {
 const data = await apiCall('new york')
 fillData(data)
})()

searchForm.addEventListener('submit', async e => {
    e.preventDefault()
    const data = await apiCall(txtCity.value)
    fillData(data)
})

function fillData(data) {
    cityHeader.innerText = data.name
    infoForecast.innerText = data.weather[0].main
    infoHigh.innerText = Math.round(data.main.temp_max)
    infoLow.innerText = Math.round(data.main.temp_min)
    infoTemp.innerText = Math.round(data.main.temp)
    infoFeels.innerText = Math.round(data.main.feels_like)
    infoHumidity.innerText = Math.round(data.main.humidity)
    changeVideo(data.weather[0].main)
}

function changeVideo(forecast) {
    if (forecast == 'Clear') {
        videoSource.src = "./static/video/clear.mp4"
        console.log("Clear!")
    } else if (forecast == 'Rain') {
        videoSource.src = "./static/video/rain.mp4"
    } else if (forecast == 'Hazy') {
        videoSource.src = "./static/video/hazy.mp4"
    } else if (forecast == 'Clouds') {
        videoSource.src = "./static/video/clouds.mp4"
    } else {
        videoSource.src = "./static/video/default.mp4"
    }
}