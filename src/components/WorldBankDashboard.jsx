import { useEffect, useState } from "react";
import { getCountries } from "../../services/worldBankApi";
import CountryTable from "./CountryTable";

function WorldBankDashboard() {
    const[countries, setCountris] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);

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
            
            <CountryTable countries={countries}/>
        </div>
    )

}

export default WorldBankDashboard;