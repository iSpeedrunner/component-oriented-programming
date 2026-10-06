const BASE_URL = "/worldbank/v2";
const YEAR = 2023;

export async function fetchData(url) {

    const response = await fetch(url);

    if(!response.ok) {
        throw new Error("Failed to load countries");
    }

    return response.json();
}

export async function getCountries() {
    const urls = [
        `${BASE_URL}/country?format=json&per_page=400`,
        `${BASE_URL}/country/all/indicator/SP.POP.TOTL?format=json&date=${YEAR}&per_page=400`,
        `${BASE_URL}/country/all/indicator/NY.GDP.MKTP.CD?format=json&date=${YEAR}&per_page=400`,
        `${BASE_URL}/country/all/indicator/SP.DYN.LE00.IN?format=json&date=${YEAR}&per_page=400`,
        `${BASE_URL}/country/all/indicator/SL.UEM.TOTL.ZS?format=json&date=${YEAR}&per_page=400`
    ];

    const [
        countriesResponse,
        populationResponse,
        gdpResponse,
        lifeExpectancyResponse,
        unemploymentResponse
    ] = await Promise.all(urls.map(url => fetchData(url)));

    const countries = countriesResponse[1] ?? [];

    const populationMap = createIndicatorMap(populationResponse);
    const gdpMap = createIndicatorMap(gdpResponse);
    const lifeExpectancyMap = createIndicatorMap(lifeExpectancyResponse);
    const unemploymentMap = createIndicatorMap(unemploymentResponse);

    return countries
        .filter(country => country.region?.value !== "Aggregates")
        .map(country => ({
            id: country.id,
            name: country.name,
            region: country.region?.value ?? "No data",
            population: populationMap.get(country.id) ?? null,
            gdp: gdpMap.get(country.id) ?? null,
            lifeExpectancy: lifeExpectancyMap.get(country.id) ?? null,
            unemployment: unemploymentMap.get(country.id) ?? null
        }));
}

function createIndicatorMap(response) {
    const records = response[1] ?? [];

    return new Map(
        records.map(record => [
            record.countryiso3code,
            record.value
        ])
    );
}