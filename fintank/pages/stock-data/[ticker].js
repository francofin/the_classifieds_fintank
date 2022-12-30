import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {Container,Row,Col,Form,Button, ToggleButton, Badge, Overlay} from "react-bootstrap";
import UseWindowSize from "@hooks/UseWindowSize";
import roomData from "@data/stock-research.json";
import blog from "@data/blog.json";
import SwiperGallery from "@components/SwiperGallery";
import Image from "@components/CustomImage";
import Gallery from "@components/Gallery";
import Map from "@components/Map";
import { useStockData } from "@hooks/useStockData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import { useStockReturns } from "@hooks/useStockReturns";
import { useStockChart } from "@hooks/useStockCharts";
import swal from 'sweetalert';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useBarChart } from "@hooks/useBarCharts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);





export function getAllPostIds() {
  return blog.posts.map((post) => ({
    params: {
      slug: post.slug,
    },
  }))
}

export function getPostData(slug) {
  for (var i = 0; i < blog.posts.length; i++) {
    if (blog.posts[i].slug == slug) {
      return blog.posts[i]
    }
  }
}

export const barOptions = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: false,
      text: 'Comparative Exposures',
    },
  },
};


export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Time Series Data',
    },
  },
  animations: {
    tension: {
      duration: 1000,
      easing: 'linear',
      from: 1,
      to: 0,
      loop: false
    }
  }
};


export async function getServerSideProps({query }) {

    const ticker = query.ticker
    console.log(ticker)
    const stockRequested = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/stock-data/${ticker}`);
    const data = stockRequested.data

    const dailyStockData = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/getdailydata/${ticker}`);
    const dailyData = dailyStockData.data;
    const labels = dailyData.dates;
    const prices = dailyData.prices;

    let universe;
    

    try{
      const universeData = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/getpeerlist/${ticker}/${data.stock[0]['universe']}`)
      universe = universeData.data
      
    } catch(e){
      console.log("No Universe Data Found", e)
    }
    
    const postData = getPostData("escape-city-today")
    return {
        props: {
        nav: {
            light: true,
            classes: "shadow",
            color: "white",
        },
        // title: postData.title,
        postData,
        data,
        dailyData,
        labels,
        prices,
        universe
        },
    }
}
const StockDetail = (props) => {
  const stockData = props.data.stock[0]
  const requestedData = useStockData(stockData.symbol)
  const dailyData = props.dailyData;
  const symbolPeers = props.universe?.raw_data || null;
  const chartMappings = props.universe?.mappings || null;

  const chartData = {
    type:'line',
    labels:props.labels,
    datasets: [{
      label: stockData.symbol,
      data:props.prices,
      borderColor: 'rgb(50, 166, 168)',
      backgroundColor: 'rgba(50, 166, 168, 0.5)',
      pointRadius: 1
    }]
  }

  const [dataForStock, setDataForStock] = useState(null);
  const [position, setPosition] = useState(null);
  const [frequency, setFrequency] = useState('30d');
  const [buttonClass, setButtonClass] = useState('outline-primary')

  const {chartLabels, chartReturns} = useStockReturns(props.dailyData,frequency)
  const {chartCreated, createChart} = useStockChart(frequency, chartLabels,chartReturns);
  

  const {barChartCreated:peBarChart, createChart:peChartCreated} = useBarChart(stockData.symbol, symbolPeers?.symbols, symbolPeers?.pe, chartMappings?.peRatioTTM)
  const {barChartCreated:psBarChart, createChart:psChartCreated} = useBarChart(stockData.symbol, symbolPeers?.symbols, symbolPeers?.psales, chartMappings?.priceToSalesRatioTTM)
  const {barChartCreated:pcfBarChart, createChart:pcfChartCreated} = useBarChart(stockData.symbol, symbolPeers?.symbols, symbolPeers?.pcf, chartMappings?.pfcfRatioTTM)
  const {barChartCreated:pbBarChart, createChart:pbChartCreated} = useBarChart(stockData.symbol, symbolPeers?.symbols, symbolPeers?.pb, chartMappings?.pbRatioTTM)
  const {barChartCreated:deBarChart, createChart:deChartCreated} = useBarChart(stockData.symbol, symbolPeers?.symbols, symbolPeers?.de, chartMappings?.debtToEquityTTM)
  const {barChartCreated:roeBarChart, createChart:roeChartCreated} = useBarChart(stockData.symbol, symbolPeers?.symbols, symbolPeers?.roe, chartMappings?.roeTTM)
  const {barChartCreated:roicBarChart, createChart:roicChartCreated} = useBarChart(stockData.symbol, symbolPeers?.symbols, symbolPeers?.roic, chartMappings?.roicTTM)
  const {barChartCreated:divBarChart, createChart:divChartCreated} = useBarChart(stockData.symbol, symbolPeers?.symbols, symbolPeers?.div, chartMappings?.dividendYieldPercentageTTM)
  const {barChartCreated:intCovBarChart, createChart:intCovChartCreated} = useBarChart(stockData.symbol, symbolPeers?.symbols, symbolPeers?.int_cov, chartMappings?.interestCoverageTTM)
  const {barChartCreated:fcfYldBarChart, createChart:fcfYldChartCreated} = useBarChart(stockData.symbol, symbolPeers?.symbols, symbolPeers?.fcfyld, chartMappings?.freeCashFlowYieldTTM)
  const {barChartCreated:eyldBarChart, createChart:eyldChartCreated} = useBarChart(stockData.symbol, symbolPeers?.symbols, symbolPeers?.eyld, chartMappings?.earningsYieldTTM)
  const {barChartCreated:fcfBarChart, createChart:fcfChartCreated} = useBarChart(stockData.symbol, symbolPeers?.symbols, symbolPeers?.fcf, chartMappings?.freeCashFlowPerShareTTM)
  
 
  useEffect(() => {
    setDataForStock(requestedData ? requestedData[0] : "")
  }, [requestedData])



  useMemo(() => {
    const fetcher = async (url) => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/getgeocode/${dataForStock?.city}${" "}${dataForStock?.state}`)
      const resData = res.data
      setPosition(resData)
      return resData
    }

    fetcher()

  }, [dataForStock])


  const size = UseWindowSize()
  const [range, setRange] = useState({
    from: false,
    to: false,
  })

  const groupByN = (n, data) => {
    let result = []
    for (let i = 0; i < data.length; i += n) result.push(data.slice(i, i + n))
    return result
  }

  const adjustTimeStamp = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric"}
    return new Date(date).toLocaleDateString(undefined, options)
  }

  const groupedAmenities = roomData.amenities && groupByN(4, roomData.amenities)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const fromRef = useRef()
  const toRef = useRef()
  useEffect(() => {
    if (range?.from && (!range?.to || range.to !== range.from)) {
      const timer = setTimeout(() => setShowDatePicker(false), 200)
      return () => clearTimeout(timer)
    }
  }, [range])


  const changeFrequency = (frequency) => {
    setFrequency(frequency);
  }



  return (
    <React.Fragment>
      <section>
        <SwiperGallery data={roomData.swiper} />
        <Container className="py-5">
          <Row>
            <Col lg="8">
              <div className="text-block">
                {stockData.name && <h1>{stockData.name}: {stockData.symbol}</h1>}
                {stockData.exchange && (
                  <div className="text-muted text-uppercase mb-4">
                    {stockData.exchange}
                  </div>
                )}
                <ul className="list-inline text-sm mb-4">
                      <li className="list-inline-item me-3">
                        Industry: {dataForStock?.sector && dataForStock?.sector}
                      </li>
                      <li className="list-inline-item me-3">
                        Number of Employees: {dataForStock?.fullTimeEmployees && Intl.NumberFormat().format(dataForStock?.fullTimeEmployees)}
                      </li>
                </ul>
                <h6 className="mb-3">Company Profile</h6>
                <p className="text-muted fw-light">
                  {dataForStock?.description && dataForStock?.description}.{" "}
                </p>
              </div>
              {roomData.frequencies && (
                <React.Fragment>
                  <div className="text-block">
                    <h4 className="mb-4">Stock Price Movements</h4>
                    <Row>
                      <Line options={options} data={chartData} style={{height:'100px'}}/>
                    </Row>
                  </div>
                  <div className="text-block">
                    <h4 className="mb-2">Return Frequency</h4>
                    <ul className="list-inline">
                      {roomData.frequencies.map((freq, index) => (
                        <li
                          key={index}
                          className="list-inline-item mb-2"
                        >
                          <ToggleButton 
                            type="radio"
                            bg="light"
                            value={freq.value}
                            variant={freq.value === frequency ? 'primary' : buttonClass}
                            onClick = {() => changeFrequency(freq.value)}
                          >
                            {freq.label}
                          </ToggleButton >
                        </li>
                      ))}
                    </ul>
                  </div>
                  {chartCreated && <div className="text-block">
                    <h4 className="mb-4">Rolling Returns: {stockData.symbol}</h4>
                    <Row>
                      <Line options={options} data={createChart} style={{height:'100px'}}/>
                    </Row>
                  </div>}
                </React.Fragment>
              )}
              <React.Fragment>
                  {peBarChart && 
                    <Row className="pt-3">
                      <Col lg="6">
                        <Bar options={barOptions} data={peChartCreated} height={200}/>
                      </Col>
                      <Col lg="6">
                        <Bar options={barOptions} data={psChartCreated} height={200}/>
                      </Col>
                    </Row>
                  }
                  {pcfBarChart && 
                    <Row className="pt-3">
                      <Col lg="6">
                        <Bar options={barOptions} data={pcfChartCreated} height={200}/>
                      </Col>
                      <Col lg="6">
                        <Bar options={barOptions} data={pbChartCreated} height={200}/>
                      </Col>
                    </Row>
                  }
                  {roeBarChart && 
                    <Row className="pt-3">
                      <Col lg="6">
                        <Bar options={barOptions} data={roeChartCreated} height={200}/>
                      </Col>
                      <Col lg="6">
                        <Bar options={barOptions} data={roicChartCreated} height={200}/>
                      </Col>
                    </Row>
                  }
                  {fcfYldBarChart && 
                    <Row className="pt-3">
                      <Col lg="6">
                        <Bar options={barOptions} data={fcfYldChartCreated} height={200}/>
                      </Col>
                      <Col lg="6">
                        <Bar options={barOptions} data={fcfChartCreated} height={200}/>
                      </Col>
                    </Row>
                  }
                  {eyldBarChart && 
                    <Row className="pt-3">
                      <Col lg="6">
                        <Bar options={barOptions} data={eyldChartCreated} height={200}/>
                      </Col>
                      <Col lg="6">
                        <Bar options={barOptions} data={intCovChartCreated} height={200}/>
                      </Col>
                    </Row>
                  }
                  {deBarChart && 
                    <Row className="pt-3">
                      <Col lg="6">
                        <Bar options={barOptions} data={deChartCreated} height={200}/>
                      </Col>
                      <Col lg="6">
                        <Bar options={barOptions} data={divChartCreated} height={200}/>
                      </Col>
                    </Row>
                  }
              </React.Fragment>
              {roomData.author && (
                <div className="text-block">
                  <div className="d-flex">
                    <div className={`avatar avatar-lg "me-4"`}>
                      <div className="position-relative overflow-hidden rounded-circle h-100 d-flex align-items-center justify-content-center">
                          <Image
                              src={`https://res.cloudinary.com/dkekvnsiy/image/fetch/${dataForStock?.image}`}
                              alt={stockData.name}
                              width={72}
                              height={72}
                              layout="intrinsic"
                              className={`rounded-circle`}
                              loading={props.eager ? "eager" : "lazy"}
                            />
                      </div>
                    </div>
                    <div>
                      <p>
                        <span className="text-muted text-uppercase text-sm">
                          CEO:
                        </span>
                        <br />
                        <strong>{dataForStock?.ceo && dataForStock?.ceo}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {position && 
                <div className="text-block">
                <h3 className="mb-4">Location</h3>
                <div className="map-wrapper-300 mb-3">
                  <Map
                    className="h-100"
                    center={[position?.lat, position?.long]}
                    circlePosition={[position?.lat, position?.long]}
                    circleRadius={500}
                    zoom={14}
                  />
                </div>
              </div>
              }
              
              <div className="py-5">
              <Button
                  type="button"
                  variant="outline-primary"
                  // onClick={() => setReviewCollapse(!reviewCollapse)}
                >
                  Add Stock to Profile
                </Button>
              </div>
            </Col>
            <Col lg="4">
              <div
                style={{ top: "100px" }}
                className="p-4 shadow ms-lg-4 rounded sticky-top"
              >
                <p className="text-muted">
                  <span className="text-primary h4">
                    Current Price: ${dataForStock?.price && dataForStock?.price}
                  </span>{" "}
                </p>
                <hr className="my-4" />
                {Number(dataForStock?.changes) > 0 ?
                  <h5 className="text-sm text-center" style={{color:"green"}}>
                  % Change: {dataForStock?.changes}
                </h5> :
                <h5 className="text-sm text-center" style={{color:'red'}}>
                  % Change: {Number(dataForStock?.changes).toFixed(1)}%
                </h5>
                }
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  Beta: {Number(dataForStock?.beta).toFixed(2)}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  Market Cap: {Intl.NumberFormat().format(dataForStock?.mktCap)}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  Low - High Range: ${dataForStock?.range}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  Average Volume {Intl.NumberFormat().format(dataForStock?.volAvg)}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  Last Dividend Paid: {Number(dataForStock?.lastDiv).toFixed(2)}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  IPO Date: {adjustTimeStamp(dataForStock?.ipoDate)}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  ISIN: {dataForStock?.isin}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  CUSIP: {dataForStock?.cusip}
                </h5>
                <hr className="my-1" />
                <h5 className="text-sm text-center">
                  CIk: {dataForStock?.cik}
                </h5>
                
                <hr className="my-4" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* {roomData.similar && (
        <section className="py-6 bg-gray-100">
          <Container>
            <h5 className="mb-0">{roomData.similar.title}</h5>
            <p className="subtitle text-sm text-primary mb-4">
              {roomData.similar.subtitle}
            </p>
            <Swiper
              className="swiper-container-mx-negative items-slider pb-5"
              perView={1}
              spaceBetween={20}
              loop={true}
              roundLengths={true}
              md={2}
              lg={3}
              xl={4}
              data={roomData.similar.items}
              cards
              pagination
            />
          </Container>
        </section>
      )} */}
    </React.Fragment>
  )
}

export default StockDetail
