import { useEffect, useState } from "react";
import { getCountries } from "../../services/worldBankApi";

function WorldBankDashboard() {
    const[countries, setCountris] = useState([]);

    useEffect(() => {
        async function loadCountries() {
            const data = await getCountries();
            setCountris(data);
        }

        loadCountries();
    } , []);


    return(
        <div>
            <h2>World Bank Dashboard</h2>
            <p>Loaded countries: {countries.length}</p>
        </div>
    )

}

export default WorldBankDashboard;