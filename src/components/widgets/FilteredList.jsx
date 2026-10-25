import './FilteredList.css'
import { useState } from 'react'
import Pagination from '../ui/Pagination.jsx'
import { filterCountriesByRegion } from '../../utils/filterCountries.js'

function FilteredList({
    title = 'Items',
    countries = [],
    regions = ['All'],
    initialRegion = 'All',
}) {
    const [region, setRegion] = useState(initialRegion);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filteredCountries = filterCountriesByRegion(countries, region)
    const totalPages = Math.max(1, Math.ceil(filteredCountries.length / pageSize))
    const visiblePage = Math.min(currentPage, totalPages)
    const pageStart = (visiblePage - 1) * pageSize
    const visibleCountries = filteredCountries.slice(pageStart, pageStart + pageSize)

    const changeRegion = event => {
        setRegion(event.target.value)
        setCurrentPage(1)
    }

    const changePage = page => {
        setCurrentPage(Math.min(Math.max(page, 1), totalPages))
    }

    const changePageSize = size => {
        setPageSize(size)
        setCurrentPage(1)
    }

    return (
        <div className="filtered-list">

            <h3 className="filtered-list-title">{title}</h3>

            <select
                value={region}
                onChange={changeRegion}>
                {regions.map(regionOption => (
                    <option value={regionOption} key={regionOption}>
                        {regionOption === 'All' ? 'All regions' : regionOption}
                    </option>
                ))}
            </select>

            <div className="country-list">

                {visibleCountries.map(country => (
                    <div className="country-item" key={country.id}>
                        <h4>{country.name}</h4>
                        <p><span>Region:</span> <strong>{country.regionName ?? '—'}</strong></p>
                        <p><span>GDP:</span> <strong>{country.gdp ?? '—'}</strong></p>
                        <p><span>Population:</span> <strong>{country.population ?? '—'}</strong></p>
                    </div>
                ))}

            </div>

            <Pagination
                totalItems={filteredCountries.length}
                pageSize={pageSize}
                currentPage={visiblePage}
                onPageChange={changePage}
                onPageSizeChange={changePageSize}
                ariaLabel="Filtered country list pages"
            />

        </div>
    )
}

export default FilteredList
