import axios from "axios"
import { useEffect, useState } from "react"

const CountryView = ({country}) => {
  const [weather, setWeather] = useState({})

  const { name, capital, area, languages, flags} = country
  
  useEffect(() => {
    const apiKey = process.env.REACT_APP_API_KEY
    const { capital } = country
    const apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${capital}`
    
    axios
      .get(apiUrl)
      .then(res => setWeather(res.data))
  }, [country])
  console.log(weather)

  if(!weather.current){
    return null
  }
  
  return (
    <div>
      <h1>{name.common}</h1>

      <p>capital {capital[0]}</p>
      <p>area {area}</p>

      <p><b>languages</b></p>
      <ul>
        {Object.values(languages).map(language => <li key={language}>{language}</li>)}
      </ul>

      <img src={flags.png} alt="country flag" />

      <h1>Weather in {name.common}</h1>

      <p>temperature {weather.current.temperature}</p>
      <img src={weather.current.weather_icons[0]} alt="weather icon" />
      <p>wind {weather.current.wind_speed} m/s</p>
    </div>
  )
}

export default CountryView