import { useParams } from 'react-router'

function CountryDetailsPage() {
  const { code } = useParams()

  return (
    <main className="dashboard-page">
      <h1>Country details</h1>
      <p>Country code: {code}</p>
    </main>
  )
}

export default CountryDetailsPage
