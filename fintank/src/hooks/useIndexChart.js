import React, {useState, useEffect} from 'react';


export const useIndexCharter = (index, indexLabels, indexData) => {
    const [myChartLabels, setMyChartLabels] = useState([]);
    const [myChartData, setMyChartData] = useState([]);
    const [indexChartCreated, setIndexChartCreated] = useState(false);
    const [createIndexChart, setCreateIndexChart] = useState(null);
    const [indexName, setIndexName] = useState('');


    useEffect(() => {
        setMyChartLabels(indexLabels);
        setMyChartData(indexData)

    }, [indexData, indexLabels])


    useEffect(() => {
        switch(index){
            case 'GSPC':
                setIndexName("S&P 500 Index")
                break;
            case 'IXIC':
                setIndexName("Nasdaq Index")
                break;
            case 'RUT':
                setIndexName("Russell 2000 Index")
                break;
            case 'FTSE':
                setIndexName("FTSE 100 Index")
                break;
            case 'DJI':
                setIndexName("Dow Jones Industrial Index")
                break;
            case 'GSPTSE':
                setIndexName("S&P/TSX Composite Index")
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
                  borderColor: 'rgb(21, 129, 179)',
                  backgroundColor: 'rgba(21, 129, 179)',
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