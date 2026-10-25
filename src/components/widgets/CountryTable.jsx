import { useMemo, useState } from 'react'
import './CountryTable.css'
import Pagination from '../ui/Pagination.jsx'
import { formatGdp, formatLifeExpectancy, formatMetricWithYear, formatPopulation } from '../../utils/formatters.js'
import { sortRecords } from '../../utils/sortRecords.js'

const columns = [
  { field: 'name', label: 'Country' },
  { field: 'regionName', label: 'Region' },
  { field: 'incomeLevelName', label: 'Income level' },
  { field: 'gdp', label: 'GDP' },
  { field: 'population', label: 'Population' },
  { field: 'lifeExpectancy', label: 'Life expectancy' },
]

function CountryTable({ records = [], isLoading = false, error = null }) {
  const [sortConfig, setSortConfig] = useState({ field: 'name', direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const sortedRecords = useMemo(
    () => sortRecords(records, sortConfig.field, sortConfig.direction),
    [records, sortConfig],
  )
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize))
  const visiblePage = Math.min(currentPage, totalPages)
  const pageStart = (visiblePage - 1) * pageSize
  const pageRecords = sortedRecords.slice(pageStart, pageStart + pageSize)

  const changeSort = field => {
    setCurrentPage(1)
    setSortConfig(current => current.field === field
      ? { field, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      : { field, direction: 'asc' })
  }

  const changePage = page => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages))
  }

  const changePageSize = size => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return (
    <section className="country-table-card" aria-live="polite" role={error ? 'alert' : undefined}>
      <div className="table-heading">
        <div>
          <p className="eyebrow">World Bank data</p>
          <h2>Country indicators</h2>
        </div>
        {!isLoading && !error && <span className="record-count">{records.length} countries</span>}
      </div>

      {isLoading && <p className="table-state">Loading country indicators…</p>}

      {error && (
        <p className="table-state table-state-error">
          We couldn’t load the country data. {error.message}
        </p>
      )}

      {!isLoading && !error && records.length === 0 && (
        <p className="table-state">No country data is available.</p>
      )}

      {!isLoading && !error && records.length > 0 && <>
        <div className="table-scroll">
        <table>
          <caption className="sr-only">World Bank country indicators with sortable columns</caption>
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.field} scope="col" aria-sort={sortConfig.field === column.field
                  ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                  : 'none'}>
                  <button type="button" className="sort-button" onClick={() => changeSort(column.field)}>
                    {column.label}
                    <span aria-hidden="true">
                      {sortConfig.field === column.field
                        ? sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                        : ' ↕'}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRecords.map(record => (
              <tr key={record.id}>
                <th scope="row">
                  <span className="country-name">{record.name}</span>
                  <span className="country-code">{record.iso2Code ?? '—'}</span>
                </th>
                <td>{record.regionName ?? '—'}</td>
                <td>{record.incomeLevelName ?? '—'}</td>
                <td>{formatMetricWithYear(formatGdp, record.gdp, record.gdpYear)}</td>
                <td>{formatMetricWithYear(formatPopulation, record.population, record.populationYear)}</td>
                <td>{formatMetricWithYear(formatLifeExpectancy, record.lifeExpectancy, record.lifeExpectancyYear)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={sortedRecords.length}
        pageSize={pageSize}
        currentPage={visiblePage}
        onPageChange={changePage}
        onPageSizeChange={changePageSize}
        ariaLabel="Country table pages"
      />
      </>}
    </section>
  )
}

export default CountryTable
