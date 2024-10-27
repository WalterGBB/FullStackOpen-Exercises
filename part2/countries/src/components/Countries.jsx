import Country from './Country'

function Countries({ filteredCountries, filter }) {

    if (filter.trim() === '') {
        return
    } else {
        if (filteredCountries.length > 10) {
            return <p>Too many matches, specify another filter</p>
        } else if (filteredCountries.length > 1) {
            return (
                <ul>
                    {filteredCountries.map(country => (
                        <li key={country.cca3}>{country.name.common}</li>
                    ))}
                </ul>
            )
        } else if (filteredCountries.length === 1) {
            return <Country country={filteredCountries[0]} />
        }
        return <p>No matches found</p>
    }
}

export default Countries