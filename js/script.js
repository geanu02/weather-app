import data from "./secrets.json" assert { type: 'json' }
import sampleApi from "./sample.json" assert { type: 'json'}

const { apiKey } = data
const sample = sampleApi

const videoBack = document.getElementById('videoBack')
const videoSource = document.getElementById('videoSource')

const searchForm = document.getElementById('searchForm')
const txtInput = document.getElementById('txtInput')
const filterChoice = document.getElementById('filterChoice')
const tempUnit = document.getElementById('tempUnit')

const infoForecast = document.getElementById('infoForecast')
const infoHigh = document.getElementById('infoHigh')
const infoLow = document.getElementById('infoLow')
const infoTemp = document.getElementById('infoTemp')
const infoFeels = document.getElementById('infoFeels')
const infoHumidity = document.getElementById('infoHumidity')

filterChoice.addEventListener('change', e => {
    e.preventDefault()
    filterChoice.value == 'zip' ?
    txtInput.setAttribute('placeholder', "US Zip Codes only") :
    txtInput.setAttribute('placeholder', "Cities of the World")
})

async function apiCall(inputQuery, preFilter, unitFilter) {
    let querySub = ""
    let unitSub = `&units=${unitFilter}`
    if (preFilter == 'zip') {
        querySub = `zip=${inputQuery},us`
    } else {
        querySub = `q=${inputQuery}`
    }
    if (unitFilter == 'standard') {
        unitSub = ``
    }
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${querySub}&appid=${apiKey}${unitSub}`)
    if (res.ok) {
        const data = await res.json()
        return data
    } else {
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
    const data = await apiCall(txtInput.value, filterChoice.value, tempUnit.value)
    fillData(data)
})

function fillData(data) {
    cityHeader.innerText = `${data.name}, ${data.sys.country}`
    infoForecast.innerText = data.weather[0].main
    infoHigh.innerText = `${Math.round(data.main.temp_max)}°`
    infoLow.innerText = `${Math.round(data.main.temp_min)}°`
    infoTemp.innerText = `${Math.round(data.main.temp)}°`
    infoFeels.innerText = `${Math.round(data.main.feels_like)}°`
    infoHumidity.innerText = `${Math.round(data.main.humidity)}%`
    changeVideo(data.weather[0].main)
}

function changeVideo(forecast) {
    if (forecast == 'Clear') {
        videoSource.setAttribute('src', "./js/video/clear.mp4")
    } else if (forecast == 'Rain') {
        videoSource.setAttribute('src', "./js/video/rain.mp4")
    } else if (forecast == 'Hazy') {
        videoSource.setAttribute('src', "./js/video/hazy.mp4")
    } else if (forecast == 'Clouds') {
        videoSource.setAttribute('src', "./js/video/clouds.mp4")
    } else if (forecast == 'Smoke') {
        videoSource.setAttribute('src', "./js/video/smoke.mp4")
    } else {
        videoSource.setAttribute('src', "./js/video/default.mp4")
    }
    videoBack.load()
    videoBack.play()
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()