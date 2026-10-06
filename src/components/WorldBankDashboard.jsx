import { useEffect, useState } from "react";
import { getCountries } from "../../services/worldBankApi";
import CountryTable from "./CountryTable";
import KpiCard from "./KpiCard";

function WorldBankDashboard() {
    const[countries, setCountris] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);

    const[sortField, setSortField] = useState("name");
    const[sortDirection, setSortDirection] = useState("asc");

    useEffect(() => {
        async function loadCountries() {
            try{
                setLoading(true);
                setError(null);
                const data = await getCountries();
                setCountris(data);
            } catch(err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadCountries();
    } , []);

    function handleSort(field) {
        if (sortField === field) {
            setSortDirection(
                sortDirection === "asc" ? "desc" : "asc"
            );
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    }

    const sortedCountries = [...countries].sort((a,b) => {
        if(sortField === "name") {
            return sortDirection === "asc" 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }

        if(sortField === "population") {
            const populationA = a.population ?? 0;
            const populationB = b.population ?? 0;

            return sortDirection === "asc" 
                ? populationA - populationB
                : populationB - populationA;
        }

        return 0;
    });

    const totalPopulation = countries.reduce(
        (sum, country) => sum + (country.population ?? 0),
        0
    );

    const totalGdp = countries.reduce(
        (sum, country) => sum + (country.gdp ?? 0),
        0
    );

    const countriesWithLifeExpectancy = countries.filter(
        country => country.lifeExpectancy != null
    );

    const totalLifeExpectancy = countries.reduce(
        (sum, country) => sum + country.lifeExpectancy,
        0
    );

    const averageLifeExpectancy =
        countriesWithLifeExpectancy.length > 0
            ? totalLifeExpectancy / countriesWithLifeExpectancy.length
            : 0;

    if(loading) {
        return <p>Loading...</p>
    }

    if(error) {
        return <p>Error: {error}</p>
    }

    if (countries.length === 0) {
        return <p>No data available</p>;
    }


    return(
        <div>
            <div className="kpi-container">
                <KpiCard
                    title="Total GDP"
                    value={`$${(totalGdp / 1_000_000_000_000).toFixed(2)} T`}
                />

                <KpiCard
                    title="Population"
                    value={`${(totalPopulation / 1_000_000_000).toFixed(2)} B`}
                />

                <KpiCard
                    title="Life Expectancy"
                    value={`${averageLifeExpectancy.toFixed(1)} years`}
                />
            </div>
            
            <CountryTable 
                countries={sortedCountries}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}/>
        </div>
    )

}

export default WorldBankDashboard;
