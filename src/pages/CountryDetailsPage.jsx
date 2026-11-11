import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import './CountryDetailsPage.css'
import useFetch from '../hooks/useFetch.js'
import { fetchCountryDetails } from '../services/worldBankApi.js'

const valueOrPlaceholder = value => value ?? 'Not available'

function CountryDetailsPage() {
  const { code } = useParams()
  const requestParams = useMemo(() => ({ code }), [code])
  const { data: country, loading, error } = useFetch(fetchCountryDetails, requestParams)

  const details = country ? [
    ['Country name', country.name],
    ['Three-letter country code', country.id],
    ['Two-letter ISO code', country.iso2Code],
    ['Region', country.regionName],
    ['Administrative region', country.adminRegionName],
    ['Income level', country.incomeLevelName],
    ['Capital city', country.capitalCity],
    ['Lending type', country.lendingTypeName],
    ['Latitude', country.latitude],
    ['Longitude', country.longitude],
  ] : []

  return (
    <main className="country-details-page">
      <Link className="back-link" to="/">Back to dashboard</Link>

      {loading && <p className="country-details-state">Loading country information…</p>}

      {!loading && error && (
        <p className="country-details-state country-details-state-error">
          We couldn’t load country information. {error.message}
        </p>
      )}

      {!loading && !error && !country && (
        <p className="country-details-state">Country information is not available.</p>
      )}

      {!loading && !error && country && (
        <>
          <header className="country-details-header">
            <p className="eyebrow">World Bank country profile</p>
            <h1>{valueOrPlaceholder(country.name)}</h1>
            <p>Country code: {valueOrPlaceholder(code)}</p>
          </header>

          <dl className="country-details-grid">
            {details.map(([label, value]) => (
              <div className="country-detail-card" key={label}>
                <dt>{label}</dt>
                <dd>{valueOrPlaceholder(value)}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </main>
  )
}

export default CountryDetailsPage
