import './FiltredList.css'
import { useState } from 'react'
import countries from '../data/mockData'

function FilteredList() {
    const [region, setRegion] = useState('All');

    const filtredCountries = region === 'All' ? countries : countries.filter(country => country.region === region);

    return (
        <div className="filtered-list"> 

            <h3 className="filtered-list-title">
                Countries
            </h3>

            <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}>
                <option value="All">All regions</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Latin America">Latin America</option>
            </select>

            <div className="country-list">

                {filtredCountries.map(country => (
                    <div className="country-item" key={country.id}>
                        <h4>{country.name}</h4>
                        <p><span>Region:</span> <strong>{country.region}</strong></p>
                        <p><span>GDP:</span> <strong>{country.gdp}</strong></p>
                        <p><span>Population:</span> <strong>{country.population}</strong></p>
                    </div>
                ))}

            </div>

        </div>
    )
}

export default FilteredList