import { useEffect, useState } from "react";
import { getCountries } from "../../services/worldBankApi";
import CountryTable from "./CountryTable";

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
    })

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
            <h2>World Bank Dashboard</h2>
            
            <CountryTable 
                countries={sortedCountries}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}/>
        </div>
    )

}

export default WorldBankDashboard;