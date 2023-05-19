import data from "./secrets.json" assert { type: 'json' }

const { apiKey } = data

async function apiCall(cityName) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    if (res.ok) {
        const data = await res.json()
        return JSON.stringify(data, null, 2)
    }
}

(async () => {
    document.getElementById('dataContainer').innerText = await apiCall('new york')
})()