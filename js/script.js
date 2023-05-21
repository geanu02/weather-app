import { API_KEY } from "../config.js"
import data from "../secrets.json" assert { type: "json" }
import sampleApi from "./sample.json" assert { type: "json" }

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

// addEventListener "change" to DropDown menu
// to change Search textbox placeholder
// from City to Zip Code and vice-versa
filterChoice.addEventListener("change", e => {
    e.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
    }
    filterChoice.value == "zip"
        ? txtInput.setAttribute("placeholder", "US Zip Code")
        : txtInput.setAttribute("placeholder", "City Name")
});

// addEventListener "click" to DropDown menu
// to remove validation text
filterChoice.addEventListener("click", e => {
    e.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
        validated = false
    }
})

// addEventListener "click" to Search textbox
// to remove validation text
txtInput.addEventListener("click", e => {
    e.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
        txtInput.value = ""
        validated = false
    }
})

// addEventListener "click" to DropDown menu
// to remove validation text
tempUnit.addEventListener("click", e => {
    e.preventDefault()
    if (validated) {
        validateText.innerHTML = ""
        validated = false
    }
})

async function apiCall(inputQuery, preFilter, unitFilter) {
    // Format substrings for the API Fetch Call URL
    let querySub = ""
    let unitSub = `&units=${unitFilter}`
    preFilter == "zip" ? querySub = `zip=${inputQuery},us` : querySub = `q=${inputQuery}`
    if (unitFilter == "standard") { unitSub = `` }
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${querySub}&appid=${apiKey}${unitSub}`
    )
    if (res.ok) {
        const data = await res.json()
        return data
    } else if (!res.ok) {
    // Validation for API Responses not equal to res.ok
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

// Sample Data to debug
// (() => fillData(sample))()

// apiCall invoking defaulted to New York City in Imperial Units
(async () => {
  const data = await apiCall("new york", "city", "imperial");
  fillData(data);
})();

// addEventListener "submit" to Submit button
// to invoke the apiCall
searchForm.addEventListener("submit", async e => {
    e.preventDefault();
    // Validation for text input (see bottom of script file)
    if (validateForm(filterChoice.value, txtInput.value)) {
        const data = await apiCall(txtInput.value, filterChoice.value, tempUnit.value)
        // Optional parameter if the filter is Zip Code
        // for reusable code
        if (filterChoice.value == 'zip') {
            fillData(data, txtInput.value)
        } else {
            fillData(data)
        }
    }
});


// Fill elements on html
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
    const listAtmos = { 
        sand: ["dust", "sand", "ash"], 
        thunderstorm: ["thunderstorm", "squall"] 
    }
    if (listAtmos.sand.includes(forecast)) {
        videoSource.setAttribute("src", "../static/video/sand.mp4")
    } else if (listAtmos.thunderstorm.includes(forecast)) {
        videoSource.setAttribute("src", "../static/video/thunderstorm.mp4")
    } else {
        videoSource.setAttribute("src", `../static/video/${forecast.toLowerCase()}.mp4`)
    }
    videoBack.load()
    videoBack.play()
}

// Validation for text inputs

// US Zip Code == not empty and five numeric characters

// City == not empty and string of letters

function validateForm(validFilter, validTxt) {
    if (validFilter == "zip") {

        if (!validTxt.length) { // if empty
            validateText.innerText = "Provide a Zip Code"
            validated = true
            return false
        } else if (validTxt.match(/[A-Za-z]/i) || validTxt.length !== 5) {
            // if string of letters and length is not 5 digits
            validateText.innerText = "Enter a valid US Zip Code"
            validated = true
            return false
        }
    } else if (validFilter == "city") {
        if (!validTxt.length) { // if empty
            validateText.innerText = "Provide a City"
            validated = true
            return false
        } else if (validTxt.match(/[0-9]/i)) { // if numeric
            validateText.innerText = "Enter a valid City"
            validated = true
            return false
        }
    }
    return true
}