import CountryView from "./CountryView"

const CountriesList = ({countries, onShowCountry, selectedCountry}) => {
  if(countries.length <= 10 && countries.length > 1){
    return (
      <div>
        {countries.map(country => 
          <div key={country.cca2}>
             <p>
              {country.name.common}
            </p>
            <button onClick={() => onShowCountry(country)}>show</button>
            {country.cca2 === selectedCountry.cca2 && <CountryView country={selectedCountry} />}
          </div>
        )}
      </div>
    )
  }

  if(countries.length === 1){
    return <CountryView country={countries[0]} />
  }

  return  <p>Too many matches, specify another filter</p>
}

export default CountriesList