import data from "./secrets.json" assert { type: 'json' }
import sampleApi from "./sample.json" assert { type: 'json'}

const { apiKey } = data
const sample = sampleApi
const searchForm = document.getElementById('searchForm')
const txtCity = document.getElementById('txtCity')
const infoForecast = document.getElementById('infoForecast')
const infoHigh = document.getElementById('infoHigh')
const infoLow = document.getElementById('infoLow')
const infoTemp = document.getElementById('infoTemp')
const infoFeels = document.getElementById('infoFeels')
const infoHumidity = document.getElementById('infoHumidity')

const videoBack = document.getElementById('videoBack')
const videoSource = document.getElementById('videoSource')

async function apiCall(cityName) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
    if (res.ok) {
        const data = await res.json()
        return data
    }
}

// Sample Data


(() => fillData(sample))()

// 
// (async () => {
//  const data = await apiCall('new york')
//  fillData(data)
// })()

searchForm.addEventListener('submit', async e => {
    e.preventDefault()
    const data = await apiCall(txtCity.value)
    fillData(data)
})

function fillData(data) {
    cityHeader.innerText = `${data.name}, ${data.sys.country}`
    infoForecast.innerText = data.weather[0].main
    infoHigh.innerText = `${Math.round(data.main.temp_max)}°`
    infoLow.innerText = `${Math.round(data.main.temp_min)}°`
    infoTemp.innerText = `${Math.round(data.main.temp)}°`
    infoFeels.innerText = `${Math.round(data.main.feels_like)}°`
    infoHumidity.innerText = Math.round(data.main.humidity)
    console.log(`fillData(${data.weather[0].main})`)
    changeVideo(data.weather[0].main)
}

function changeVideo(forecast) {
    if (forecast == 'Clear') {
        videoSource.setAttribute('src', "./js/video/clear.mp4")
        console.log("Clear!")
    } else if (forecast == 'Rain') {
        videoSource.setAttribute('src', "./js/video/rain.mp4")
        console.log("Rain!")
    } else if (forecast == 'Hazy') {
        videoSource.setAttribute('src', "./js/video/hazy.mp4")
        console.log("Hazy!")
    } else if (forecast == 'Clouds') {
        videoSource.setAttribute('src', "./js/video/clouds.mp4")
        console.log("Clouds!")
    } else if (forecast == 'Smoke') {
            videoSource.setAttribute('src', "./js/video/smoke.mp4")
            console.log("Smoke!")
    } else {
        videoSource.setAttribute('src', "./js/video/default.mp4")
        console.log("Default!")
    }
    videoBack.load()
    videoBack.play()
}