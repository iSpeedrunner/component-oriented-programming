import "./CountryTable.css";

function formatPopulation(value) {
  if (value == null) return "No data";

  return value.toLocaleString();
}

function formatGdp(value) {
  if (value == null) return "No data";

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)} B`;
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)} M`;
  }

  return `$${value}`;
}

function formatLifeExpectancy(value) {
  if (value == null) return "No data";

  return value.toFixed(1);
}

function formatUnemployment(value) {
  if (value == null) return "No data";

  return `${value.toFixed(1)}%`;
}

function CountryTable({ countries, onSort, sortField, sortDirection }) {
  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => onSort("name")}>
            Country

            {sortField === "name" && (
              sortDirection === "asc" ? " ↑" : " ↓"
            )}  
          </th>
          <th>Region</th>
          <th onClick={() => onSort("population")}>
            Population
            {sortField === "population" && (
                sortDirection === "asc" ? " ↑" : " ↓"
            )}  
          </th>
          <th>GDP</th>
          <th>Life Expectancy</th>
          <th>Unemployment</th>
        </tr>
      </thead>

      <tbody>
        {countries.map((country) => (
          <tr key={country.id}>
            <td>{country.name}</td>
            <td>{country.region}</td>
            <td>{formatPopulation(country.population)}</td>
            <td>{formatGdp(country.gdp)}</td>
            <td>{formatLifeExpectancy(country.lifeExpectancy)}</td>
            <td>{formatUnemployment(country.unemployment)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CountryTable;