import React, {useState, useEffect} from 'react'
import {Line} from 'react-chartjs-2'
import numeral from 'numeral'
import './LineGraph.css'
import { Card, CardContent } from '@material-ui/core'
const options = {
    legend: {
        display: false
    },
    elements: {
        point: {
            radius: 0,
        }
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0")
            }
        }

    },

    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false
                },
                ticks: {
                    // include a million sign in the ticks
                    callback: function(value, index, values) {
                        return numeral(value).format("0a")
                    }
                }
            },
        ],
        
    }
}


function LineGraph({casesType = "cases", active}) {

    const [data, setData] = useState({})
    // https://disease.sh/v3/covid-19/historical/all?lastdays=120


    console.log(`isActive ${casesType}`, active);

    useEffect(() => {

        const fetchData = async () => {

            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then(response => response.json())
            .then(data => {
                const chartData = buildChartData(data, casesType)
                setData(chartData)
            })

        }

        fetchData()
    
    }, [casesType])

    const buildChartData =  (data, casesType) => {

        console.log("casestype>>>", casesType);
        const chartData = []
        let lastDataPoint;

        for(let date in data[casesType]){

            if(lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint)
            }
            lastDataPoint = data[casesType][date]
        }

        return chartData;
    }

    return (
        <div className={`lineGraph ${active && "lineGraph--active" }`}>
            <Card 
                variant="outlined"
            >
                <CardContent>
                {
                    data?.length 
                    
                    &&
                
                    (<Line
                        className="lineGraph__line"
                        options={options}
                        data={{
                            datasets: [
                                {
                                    data: data,
                                    backgroundColor: `${casesType === "recovered" ? "rgba(26, 158, 94, 0.5)" :"rgba(204, 16, 52, 0.5)" }`,
                                    borderColor: `${casesType === "recovered" ? "#08520E" :  "#721508" }`
                                }
                            ]
                        }}
                    />)
                }
                </CardContent>
            </Card>
        </div>
    )
}

export default LineGraph
