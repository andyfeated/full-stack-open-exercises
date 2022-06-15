import axios from "axios"
import { useEffect, useState } from "react"
import CountriesList from "./components/CountriesList"

const App = () => {
  const [filter, setFilter] = useState("")
  const [countries, setCountries] = useState([])
  const [selectedCountry,setSelectedCountry] = useState({})
  
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then(res => {
      setCountries(res.data)
    })
  }, [])

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    const filteredCountries = countries.filter(country => 
      country.name.common.toLowerCase().includes(e.target.value.toLowerCase())
    )

    setCountries(filteredCountries)
  }

  return (
    <div>
      find countries <input onChange={handleFilterChange} value={filter} />
      <CountriesList selectedCountry={selectedCountry} onShowCountry={handleShowCountry} countries={countries} />
    </div>
  )
}

export default App