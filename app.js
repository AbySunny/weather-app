const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const apiKey = "31343ec0eb9941447699a2167fa5d3a6"
const img_apiKey = "X3pkg4XeCwyq1o1NSKHdWp0hvJYLTR6OhJe-xMn_kzY"

const counrtyTxt = document.querySelector(".country-txt")
const tempTxt = document.querySelector(".temp-txt")
const conditionTxt = document.querySelector(".condition-txt")
const humidityValueTxt = document.querySelector(".humidity-value-txt")
const windValueTxt = document.querySelector(".wind-value-txt")
const weatherSummaryImage = document.querySelector(".weather-summary-img")
const currentDateTxt = document.querySelector(".current-date-txt")

const forecastItemsContainer = document.querySelector(".forecast-items-container")


const today = new Date();
const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',  
    month: 'short',    
    day: '2-digit'     
}).format(today);
currentDateTxt.textContent = formattedDate

searchBtn.addEventListener('click', ()=>{
        if(cityInput.value.trim() != ''){
            updateWeatherInfo(cityInput.value)
            cityInput.value = ''
            cityInput.blur()
        }
    
})
cityInput.addEventListener('keydown', (event)=>{
    if(event.key == 'Enter'&& cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }

})

async function fetchImage(city){
    const apiUrl = `https://api.unsplash.com/photos/random?query=${city}&client_id=${img_apiKey}`
    const response = await fetch(apiUrl)
    const result = await response.json()
    if(result.urls.regular){
        document.body.style.backgroundImage = `url("${result.urls.regular}")`
        const styleSheet = document.styleSheets[0]; // Access the first stylesheet
        for (let rule of styleSheet.cssRules) {
            if (rule.selectorText === "body::before") {
                rule.style.backdropFilter = "blur(3px)";
            }
        }

    }

}

async function getFetchData(endpoint,city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`
    const response  = await fetch(apiUrl)
    return response.json()
}
function getWeatherIcon(id){
    if(id<=232) return 'thunderstorm.svg'
    if(id<=321) return 'drizzle.svg'
    if(id<=531) return 'rain.svg'
    if(id<=622) return 'snow.svg'
    if(id<=781) return 'atmosphear.svg'
    if(id<=800) return 'clear.svg'
    else return 'clouds.svg'
}

async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city)
    if(weatherData.cod != 200){
        alert('city name not recognized')
        return
    }

    const {
        name:counrty,
        main:{temp,humidity},
        weather:[{id,main}],
        wind:{speed}
    }=weatherData

    counrtyTxt.textContent = counrty
    tempTxt.textContent = Math.round(temp)+" °C"
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity+"%"    
    windValueTxt.textContent = speed+" m/s"

    weatherSummaryImage.src = `assets/weather/${getWeatherIcon(id)}`

    await upadteForecastInfo(city)
    await fetchImage(city)
}

async function upadteForecastInfo(city){
    const forecastData = await getFetchData('forecast', city)

    const timetaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')

    forecastItemsContainer.innerHTML=''
    forecastData.list.forEach(forecastWeather =>{
        if(forecastWeather.dt_txt.includes(timetaken) && !forecastWeather.dt_txt.includes(todayDate)){
            upadteForecastItems(forecastWeather)
        }
        
    })
}

function upadteForecastItems(weatherData){
    const {
        dt_txt:date,
        weather: [{id}],
        main: {temp}
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day:'2-digit',
        month:"short"
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C  </h5>
        </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend',forecastItem)
}