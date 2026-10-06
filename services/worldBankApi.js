const BASE_URL = "https://api.worldbank.org/v2";

export async function getCountries() {

    const response = await fetch(`${BASE_URL}/country?format=json&per_page=400`);

    const data = await response.json();

    return data[1] ?? [];
}