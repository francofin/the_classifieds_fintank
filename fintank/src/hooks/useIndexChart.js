import React, {useState, useEffect} from 'react';


export const useIndexCharter = (index, indexLabels, indexData) => {
    const [myChartLabels, setMyChartLabels] = useState([]);
    const [myChartData, setMyChartData] = useState([]);
    const [indexChartCreated, setIndexChartCreated] = useState(false);
    const [createIndexChart, setCreateIndexChart] = useState(null);
    const [indexName, setIndexName] = useState('');
    const [chartColor, setChartColor] = useState('')


    useEffect(() => {
        setMyChartLabels(indexLabels);
        setMyChartData(indexData)

    }, [indexData, indexLabels])


    useEffect(() => {
        switch(index){
            case 'GSPC':
                setIndexName("S&P 500 Index")
                setChartColor('rgba(21, 129, 179)')
                break;
            case 'IXIC':
                setIndexName("Nasdaq Index")
                setChartColor('rgba(245, 223, 24)')
                break;
            case 'RUT':
                setIndexName("Russell 2000 Index")
                setChartColor('rgba(11, 191, 134)')
                break;
            case 'FTSE':
                setIndexName("FTSE 100 Index")
                setChartColor('rgba(138, 19, 122)')
                break;
            case 'DJI':
                setIndexName("Dow Jones Industrial Index")
                setChartColor('rgba(20, 191, 11)')
                break;
            case 'GSPTSE':
                setIndexName("S&P/TSX Composite Index")
                setChartColor('rgba(78, 78, 78)')
                break;
            default:
                break
        }
        const drawChart = () => {
            let chart= {
                type:'line',
                labels:myChartLabels,
                datasets: [{
                  label: indexName,
                  data:myChartData,
                  borderColor: chartColor,
                  backgroundColor: chartColor,
                  pointRadius: 1
                }]
              }
              setIndexChartCreated(true)
              return chart
        }

        setCreateIndexChart(drawChart())
        
    }, [myChartData])


    // bool, chart, namne
    return {
        indexChartCreated, 
        createIndexChart,
        indexName
    }
}