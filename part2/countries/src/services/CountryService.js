import axios from "axios"

const urlApiCountries = 'https://studies.cs.helsinki.fi/restcountries/api'
const urlApiWeather = 'https://api.openweathermap.org/data/2.5/weather'
const apiKeyWeather = 'be6db7e09bac5b69b60b0b939a368b4e'

const getAllCountries = () => {
    const request = axios.get(`${urlApiCountries}/all`)
    return request.then(response => response.data)
}

const getWeather = (capital) => {
    const request = axios.get(`${urlApiWeather}?q=${capital}&appid=${apiKeyWeather}`)
    return request.then(response => response.data)
}

export default { getAllCountries, getWeather }