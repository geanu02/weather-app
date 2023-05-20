import { API_KEY } from "./config.js"
import data from "./secrets.json" assert { type: 'json' }
import sampleApi from "./sample.json" assert { type: "json" };

const apiKey = data.api_key || API_KEY
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
    }
    validated = false
})

txtInput.addEventListener("click", e => {
    e.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
    }
    validated = false
})

tempUnit.addEventListener("click", e => {
    e.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
    }
    validated = false
})

async function apiCall(inputQuery, preFilter, unitFilter) {
    let querySub = ""
    let unitSub = `&units=${unitFilter}`
    preFilter == "zip" ? querySub = `zip=${inputQuery},us` : querySub = `q=${inputQuery}`
    if (unitFilter == "standard") { unitSub = `` }
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${querySub}&appid=${apiKey}${unitSub}`
    )
    if (res.ok) {
        const data = await res.json();
        return data
    }
}

// Sample Data
// (() => fillData(sample))()

(async () => {
  const data = await apiCall("new york", "city", "imperial");
  fillData(data);
})();

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (validateForm(filterChoice.value, txtInput.value)) {
        console.log("NagTrue yung ValidateForm")
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

// Validation

function validateForm(validFilter, validTxt) {
    console.log(`ValidFilter: ${validFilter}, ValidTxt: ${validTxt}`)
    if (validFilter == "zip") {
        if (isNaN(validTxt) || validTxt.length !== 5) {
            validateText.innerText = "Enter a valid US Zip Code."
            validated = true
            return false
        }
        else {
            return true
        }
    } else {
        return true
    }
  }