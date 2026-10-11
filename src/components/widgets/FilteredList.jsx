import './FilteredList.css'
import { useState } from 'react'
import { filterCountriesByRegion } from '../../utils/filterCountries.js'

function FilteredList({
    title = 'Items',
    countries = [],
    regions = ['All'],
    initialRegion = 'All',
}) {
    const [region, setRegion] = useState(initialRegion);

    const filteredCountries = filterCountriesByRegion(countries, region)

    return (
        <div className="filtered-list">

            <h3 className="filtered-list-title">{title}</h3>

            <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}>
                {regions.map(regionOption => (
                    <option value={regionOption} key={regionOption}>
                        {regionOption === 'All' ? 'All regions' : regionOption}
                    </option>
                ))}
            </select>

            <div className="country-list">

                {filteredCountries.map(country => (
                    <div className="country-item" key={country.id}>
                        <h4>{country.name}</h4>
                        <p><span>Region:</span> <strong>{country.regionName ?? '—'}</strong></p>
                        <p><span>GDP:</span> <strong>{country.gdp ?? '—'}</strong></p>
                        <p><span>Population:</span> <strong>{country.population ?? '—'}</strong></p>
                    </div>
                ))}

            </div>

        </div>
    )
}

export default FilteredList
