import React, {useState, useEffect} from 'react';
import './App.css';

import "leaflet/dist/leaflet.css";

import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from '@material-ui/core';

import {prettyPrintStat} from './util'

import {sortData} from './util'

import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import LineGraph from './LineGraph'


function App() {

  const [countries, setCountries] = useState([
    "USA", "UK", "India"
  ])

  const [country, setCountry] = useState("worldwide")

  const [countryInfo, setCountryInfo] = useState({})

  const [tableData, setTableData] = useState([])

  const [casesType, setCasesType] = useState("cases")

  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796
  })

  const [mapCountries, setMapCountries] = useState()

  const [mapZoom, setMapZoom] = useState(2)

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      })
    
  }, [])


  useEffect(() => {
    
      const getCountriesData = async () => {
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2 // UK, IND
            }
          ))
          const sortedData = sortData(data)
          setTableData(sortedData)
          setCountries(countries)
          setMapCountries(data)
        })
      }

      getCountriesData()
    
  }, [])

  const onCountryChange = async (event) => {

    const countryCode = event.target.value

    const url = 
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`


    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode)
        setCountryInfo(data)

        
        // console.log("country info : ", data.countryInfo);

        // console.log(`country- ${data.country}`, data.countryInfo);

        if(countryCode === "worldwide"){
          setMapCenter({
            lat: 34.80746,
            lng: -40.4796
          })

          setMapZoom(4)
        }
        else {
          setMapCenter({
            lat: data.countryInfo.lat,
            lng: data.countryInfo.long
          })
          setMapZoom(4)
        }

        
      })

    // https://disease.sh/v3/covid-19/countries/{query}
    // https://disease.sh/v3/covid-19/countries/all

  }


  return (
    <div className="app">

      <div className="app__left">
        {/* Header */}
      
        {/* Title + Select input dropdown field */}
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">

            <Select
              variant="outlined"
              value={country} 
              onChange={onCountryChange}   
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {
                countries.map(
                  (country) => (<MenuItem value={country.value}>{country.name}</MenuItem>) 
                )
              }
            </Select>

          </FormControl>      
        </div>

        <div className="app__stats">
          {/* Info Boxs */}
          {/* Info Boxs */}
          {/* Info Boxs */}
          <InfoBox isRed active={casesType === "cases"} onClick={e => setCasesType("cases")} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
          <InfoBox active={casesType === "recovered"} onClick={e => setCasesType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
          <InfoBox isRed active={casesType === "deaths"} onClick={e => setCasesType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
        </div>


        {/* Map */}

        <Map 
          casesType={casesType}
          countries={mapCountries} 
          center={mapCenter} 
          zoom={mapZoom}
        />
      </div>

      
      <div className="app__right">
        <Card className="app__table">
          <CardContent>
            <div className="">
              <h2 className="">Cases by country</h2>
              {/* Table */}
              <Table countries={tableData} /> 
            </div>
          </CardContent>
        </Card>
        
        <LineGraph casesType="cases" active={casesType === "cases"} />
        <LineGraph casesType="recovered" active={casesType === "recovered"}/>
        <LineGraph casesType="deaths" active={casesType === "deaths"}/>


      </div>
      
      
    </div>
  );
}

export default App;
