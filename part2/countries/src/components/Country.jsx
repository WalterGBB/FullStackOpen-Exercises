import { useEffect, useState } from 'react'
import CountryService from '../services/CountryService'

const difKelvin = 273.15

function Country({ country }) {

    const [weatherData, setWeatherData] = useState(null)

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const data = await CountryService.getWeather(country.capital[0])
                setWeatherData(data)
            } catch (error) {
                alert('Error fetching weather data:', error)
            }
        }
        fetchWeather()
    }, [])

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital[0]}</p>
            <p>Area: {country.area.toLocaleString()} km<sup>2</sup></p>
            <h4>Languages:</h4>
            <ul>
                {Object.values(country.languages).map((lang, index) => (
                    <li key={index}>{lang}</li>
                ))}
            </ul>
            <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="170" />
            <h3>Weather in {country.capital[0]}</h3>
            {
                weatherData && (
                    <>
                        <p>Temperature {(weatherData.main.temp - difKelvin).toFixed(2)} °C</p>
                        <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} alt={`${country.name.common} Flag`} width="70" />
                        <p>Wind {Math.round(weatherData.wind.speed)} m/s</p>
                    </>
                )
            }
        </div>
    )
}

export default Country