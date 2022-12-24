import React, {useState, useEffect} from 'react';


export const useBarChart = (ticker, chartTickers, chartData) => {
    const [myChartLabels, setMyChartLabels] = useState(chartTickers);
    const [myChartData, setMyChartData] = useState(chartData);
    const [barChartCreated, setBarChartCreated] = useState(false);
    const [createChart, setCreateChart] = useState(null);
    const barChartColors = '235, 235, 54';

    // useEffect(() => {
    //     setMyChartLabels(chartTickers);
    //     setMyChartData(chartData)

    // }, [chartData, chartTickers])

    
    
    useEffect(() => {
        const drawChart = () => {
            let chart= {
                type:'line',
                labels:myChartLabels,
                datasets: [{
                  label: frequency+" Rolling Returns",
                  data:myChartData,
                  borderColor: 'rgb(11, 79, 135)',
                  backgroundColor: 'rgba(11, 79, 135)',
                  pointRadius: 1
                }]
              }

              return chart
        }

        setCreateChart(drawChart())
        setBarChartCreated(true)
    }, [myChartLabels, myChartData])

    return {
        barChartCreated, 
        createChart
    }
}