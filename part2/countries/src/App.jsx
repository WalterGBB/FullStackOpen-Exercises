import React, { useState, useEffect } from 'react'
import CountryService from './services/CountryService'
import Filter from './components/Filter'
import Countries from './components/Countries'

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    CountryService.getAllCountries().then(data => setCountries(data))
  }, [])

  useEffect(() => {
    if (filter.trim() === '') {
      setFilteredCountries([])
      return
    }
    const result = countries.filter(country =>
      country.name.common.toLowerCase().includes(filter.toLowerCase())
    )
    setFilteredCountries(result)
  }, [filter, countries])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <Filter filter={filter} onFilterChange={handleFilterChange} />
      <Countries filteredCountries={filteredCountries} filter={filter} />
    </div>
  )
}

export default App