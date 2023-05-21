import { API_KEY } from "../etc/secrets/config.js"
import data from "../etc/secrets/secrets.json" assert { type: 'json' }
import sampleApi from "./sample.json" assert { type: "json" };

const apiKey =  API_KEY || data.api_key
//const { apiKey } = data
const sample = sampleApi;

const videoBack = document.getElementById("videoBack");
const videoSource = document.getElementById("videoSource");

const searchForm = document.getElementById("searchForm");
const txtInput = document.getElementById("txtInput");
const filterChoice = document.getElementById("filterChoice");
const tempUnit = document.getElementById("tempUnit");
const validateText = document.getElementById("validText")
let validated = false

const infoForecast = document.getElementById("infoForecast");
const infoHigh = document.getElementById("infoHigh");
const infoLow = document.getElementById("infoLow");
const infoTemp = document.getElementById("infoTemp");
const infoFeels = document.getElementById("infoFeels");
const infoHumidity = document.getElementById("infoHumidity");

filterChoice.addEventListener("change", e => {
    e.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
    }
    filterChoice.value == "zip"
        ? txtInput.setAttribute("placeholder", "US Zip Code")
        : txtInput.setAttribute("placeholder", "City Name")
});

filterChoice.addEventListener("click", e => {
    e.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
        validated = false
    }
})

txtInput.addEventListener("click", e => {
    e.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
        txtInput.value = ""
        validated = false
    }
})

tempUnit.addEventListener("click", e => {
    e.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
        validated = false
    }
})

async function apiCall(inputQuery, preFilter, unitFilter) {
    let querySub = ""
    let unitSub = `&units=${unitFilter}`
    preFilter == "zip" ? querySub = `zip=${inputQuery},us` : querySub = `q=${inputQuery}`
    if (unitFilter == "standard") { unitSub = `` }
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${querySub}&appid=${apiKey}${unitSub}`
    )
    // Validation for API Responses not equal to res.ok
    if (res.ok) {
        const data = await res.json()
        return data
    } else if (!res.ok) {
        if (preFilter == "zip") {
            validateText.innerText = "Enter a valid US Zip Code"
            validated = true
        } else {
            validateText.innerText = "Enter a valid City"
            validated = true
        }
    } else {
        validateText.innerText = "Something went wrong. Try again in a few minutes."
        validated = true
    }
}

// Sample Data
// (() => fillData(sample))()

(async () => {
  const data = await apiCall("new york", "city", "imperial");
  fillData(data);
})();

searchForm.addEventListener("submit", async e => {
    e.preventDefault();
    if (validateForm(filterChoice.value, txtInput.value)) {
        const data = await apiCall(txtInput.value, filterChoice.value, tempUnit.value)
        if (filterChoice.value == 'zip') {
            fillData(data, txtInput.value)
        } else {
            fillData(data)
        }
    }
});

function fillData(data, zip=null) {
    const zipCode = zip ? `${zip} - ` : ''
    cityHeader.innerText = `${zipCode}${data.name}, ${data.sys.country}`
    infoForecast.innerText = data.weather[0].main
    infoHigh.innerText = `${Math.round(data.main.temp_max)}°`
    infoLow.innerText = `${Math.round(data.main.temp_min)}°`
    infoTemp.innerText = `${Math.round(data.main.temp)}°`
    infoFeels.innerText = `${Math.round(data.main.feels_like)}°`
    infoHumidity.innerText = `${Math.round(data.main.humidity)}%`
    changeVideo(data.weather[0].main)
}

// changeVideo controls the background video depends on the forecast (param)

function changeVideo(forecast) {
  if (forecast == "Clear") {
    videoSource.setAttribute("src", "./js/video/clear.mp4")
  } else if (forecast == "Rain") {
    videoSource.setAttribute("src", "./js/video/rain.mp4")
  } else if (forecast == "Haze") {
    videoSource.setAttribute("src", "./js/video/hazy.mp4")
  } else if (forecast == "Clouds") {
    videoSource.setAttribute("src", "./js/video/clouds.mp4")
  } else if (forecast == "Smoke") {
    videoSource.setAttribute("src", "./js/video/smoke.mp4")
  } else if (forecast == "Mist") {
    videoSource.setAttribute("src", "./js/video/mist.mp4")
  } else {
    videoSource.setAttribute("src", "./js/video/default.mp4")
  }
  videoBack.load()
  videoBack.play()
}

// Validation for text inputs

// US Zip Code == not empty and five numeric characters

// City == not empty and string of letters

function validateForm(validFilter, validTxt) {
    if (validFilter == "zip") {
        if (!validTxt.length) {
            validateText.innerText = "Provide a Zip Code"
            validated = true
            return false
        } else if (validTxt.match(/[A-Za-z]/i) || validTxt.length !== 5) {
            validateText.innerText = "Enter a valid US Zip Code"
            validated = true
            return false
        }
    } else if (validFilter == "city") {
        if (!validTxt.length) {
            validateText.innerText = "Provide a City"
            validated = true
            return false
        } else if (validTxt.match(/[0-9]/i)) {
            validateText.innerText = "Enter a valid City"
            validated = true
            return false
        }
    }
    return true
}