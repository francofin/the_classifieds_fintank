import React, {useEffect, useMemo, useState, useContext} from "react"
import Link from "next/link"
import Image from "@components/CustomImage"
import axios from 'axios'
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap"
import Swiper from "@components/Swiper"
import {SwiperSlide } from "swiper/react"
import SearchBar from "@components/SearchBar"
import LastMinute from "@components/LastMinute"
import Guides from "@components/Guides"
import Instagram from "@components/Instagram"
import CardPost from "@components/CardPost"
import NewsPost from "@components/NewsPost"
import SwiperTestimonial from "@components/SwiperTestimonial"
import data from "@data/index.json"
import blog from "@data/blog.json"
import Icon from "@components/Icon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons"
import { useHomeIndex } from "@hooks/useHomeIndex"
import { useSectorReturnTS } from "@hooks/UseSectorTS"
import { useSectorData } from "@hooks/UseSectorData"
import { connect } from "react-redux"
import { useStockNames } from "@hooks/useStockNames"
import { useRouter } from "next/router"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const fetcher = async (url) => {
  const res = await axios.get(url)
  
  const resData = res.data
  return resData
}

export async function getStaticProps() {

  const URL = `${process.env.NEXT_PUBLIC_FINTANK_API_URL}/movers/`;
  const moverData = await fetcher(URL);
  const fmpRes = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/newsarticles/fmp`);
  const responseNews = fmpRes.data;

  
  return {
    props: {
      nav: {
        light: true,
        classes: "shadow",
        color: "white",
      },
      title: "Fintank",
      data,
      moverData,
      responseNews
    },
  }
}

const Index = (props) => {

  const indexData = useHomeIndex()
  const [frequency, setFrequency] = useState('fifteen')
  const [newFreq, setNewFreq] = useState('')
  const [sectorReturnTS, setSectorReturnTs] = useState({})
  const [sectorReturnOptions, setSectorReturnOptions] = useState({})
  const [sectorVolTS, setSectorVolTs] = useState({})
  const [loading, setLoading] = useState(false)
  const [fmpData, setFmpData] = useState([])
  const [cleanFrequencyName, setCleanFrequencyName] = useState('')
  const {data:sectorData} = useSectorData()
  const router = useRouter();

  let fmpNewsArticles = props.responseNews.data
  const noNewsLanesArticles = fmpNewsArticles.filter((article, i) => (article.site!=="newslanes") && (article.image!==null) )
  const {exportedData, options, exportedVolData} = useSectorReturnTS(frequency)

  const {data:stockNames} = useStockNames();
  const allStocks = stockNames?.stocks

  const adjustFrequencyName = (frequency) => {
    switch(frequency){
      case 'fifteen':
        setCleanFrequencyName('15')
        break;
      case 'thirty':
        setCleanFrequencyName('30')
        break;
      case 'sixty':
        setCleanFrequencyName('60')
        break;
      case 'ninety':
        setCleanFrequencyName('90')
        break;

    }
  }


  useEffect(() => {
    setSectorReturnTs(exportedData)
    setSectorReturnOptions(options)
    setLoading(true)
    adjustFrequencyName(frequency)

  }, [frequency])


  const handleFrequencyChange = (e) => {
    setFrequency(e)
  }

  const randomTickerSearch = () => {
    let randomIndex = Math.floor(Math.random()*allStocks?.length)
    let randomSymbol = allStocks[randomIndex].symbol
    console.log(randomSymbol);
    router.push(`/stock-data/${randomSymbol}`)
  }



  return (
    <React.Fragment>
      <section className="hero-home">
        <Swiper
          className="hero-slider"
          wrapperClasses="dark-overlay"
          data={data.swiperImages}
          simple
          effect="fade"
          speed={2000}
          autoplay={{
            delay: 10000,
          }}
        />
        <Container className="py-6 py-md-7 text-white z-index-20">
          <Row>
            <Col xl="10">
              {data.hero && (
                <div className="text-center text-lg-start">
                  <p className="subtitle letter-spacing-4 mb-2 text-secondary text-shadow">
                    {data.hero.subTitle}
                  </p>
                  <h1 className="display-3 fw-bold text-shadow">
                    {data.hero.title}
                  </h1>
                  <p className="subtitle letter-spacing-4 mb-2 text-secondary text-shadow">
                    {data.hero.subtitle2}
                  </p>
                </div>
              )}
              {allStocks ?
                <Button onClick={randomTickerSearch}>
                  Random Ticker Search
                </Button> :
                <Button onClick={randomTickerSearch} disabled={true}>
                Random Ticker Search
              </Button>
              }
              
            </Col>
          </Row>
        </Container>
      </section>
      {data.topBlocks && (
        <section className="py-6 bg-gray-100">
          <Container>
            <div className="text-center pb-lg-4">
              <p className="subtitle text-primary">
                {data.topBlocks.subTitle}
              </p>
              <h2 className="mb-5">{data.topBlocks.title}</h2>
            </div>
            <Swiper
                className="swiper-container-mx-negative pt-3 pb-5"
                wrapperClasses="dark-overlay"
                indexReturns
                perView={4}
                data={indexData.data}
                loop
                speed={1000}
                pagination
                autoplay={{
                  delay: 5000,
                }}
              />
          </Container>
        </section>
      )}
      
      <section className="pt-6 pb-6">
        {sectorData &&
          <Container fluid>
            <div className="text-center pb-lg-4">
              <p className="h2">
                Sector Performance: {sectorData.sector_message}
              </p>
            </div>
            <Row>
              {sectorData.sector_data.map((sector, index) => (
                <Col
                  xs="6"
                  lg="4"
                  xl="2"
                  className={`px-0 ${
                    index === sectorData.sector_data.length - 1
                      ? "d-none d-lg-block d-xl-none"
                      : ""
                  }`}
                  key={index}
                >
                  <div
                    style={{ minHeight: "400px" }}
                    className="d-flex align-items-center dark-overlay hover-scale-bg-image"
                  >
                    {parseFloat(sector.changesPercentage) > 0 ?
                      <Image
                        src={`/images/stockPerformance/stock-up.jpg`}
                        alt={sector.sector}
                        layout="fill"
                        className="bg-image"
                        // alt="Hero image"
                      /> : 
                      <Image
                        src={`/images/stockPerformance/stock-down-3.jpg`}
                        alt={sector.sector}
                        layout="fill"
                        className="bg-image"
                        // alt="Hero image"
                      /> 
                    }
                    <div className="p-3 p-sm-5 text-white z-index-20">
                      <h4 className="h4 text-center">{sector.sector}</h4>
                      <p className="mb-4"><strong>{parseFloat(sector.changesPercentage).toFixed(2)}%</strong></p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        }   
      </section>
      {loading && sectorReturnTS ? 
        <section className="pt-3 pb-6">
          <div className="text-center pb-lg-4">
              <p className="h2">
                {`Sector Performance Over Time: ${cleanFrequencyName} Day Rolling Returns and Volatility`}
              </p>
              <Dropdown drop="down" className="d-inline-block" variant="light" onSelect={(e) => {handleFrequencyChange(e)}}>
                <Dropdown.Toggle variant="outline-primary">Adjust Frequency</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Header className="fw-normal">
                      Frequency
                    </Dropdown.Header>
                      <Dropdown.Item eventKey='fifteen'>15 Day</Dropdown.Item>
                      <Dropdown.Item eventKey='thirty'>30 Day</Dropdown.Item>
                      <Dropdown.Item eventKey='sixty'>60 Day</Dropdown.Item>
                      <Dropdown.Item eventKey='ninety'>90 Day</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown >
            </div>
            <Row>
              <Col lg="6">
                <Line options={options} data={exportedData} />
              </Col>
              <Col lg="6">
                <Line options={options} data={exportedVolData} />
              </Col>
            </Row>
      </section> : ""
      }
      
      {props.moverData && (
        <section className="py-6 bg-gray-100">
          <Container>
            <div className="text-center pb-lg-4">
              <p className="subtitle text-primary">
                {data.movers.subTitle}
              </p>
              <h2 className="mb-5">{data.movers.gainers}</h2>
            </div>
            <Swiper
                className="swiper-container-mx-negative pt-1 pb-5"
                wrapperClasses="dark-overlay"
                moverReturns
                perView={6}
                data={props.moverData?.most_gainer}
                loop
                speed={1000}
                pagination
                autoplay={{
                  delay: 5000,
                }}
              />
          </Container>
          <Container>
            <div className="text-center pb-lg-4">
              <h2 className="mb-5">{data.movers.losers}</h2>
            </div>
            <Swiper
                className="swiper-container-mx-negative pt-1 pb-5"
                wrapperClasses="dark-overlay"
                moverReturns
                perView={6}
                data={props.moverData?.most_loser}
                loop
                speed={1000}
                pagination
                autoplay={{
                  delay: 5000,
                }}
              />
          </Container>
          <Container>
            <div className="text-center pb-lg-4">
              <h2 className="mb-5">{data.movers.active}</h2>
            </div>
            <Swiper
                className="swiper-container-mx-negative pt-1 pb-5"
                wrapperClasses="dark-overlay"
                moverReturns
                perView={6}
                data={props.moverData?.most_active}
                loop
                speed={1000}
                pagination
                autoplay={{
                  delay: 5000,
                }}
              />
          </Container>
        </section>
      )}
      {blog.posts && (
        <section className="py-6 bg-gray-100">
          <Container>
            <Row className="mb-5">
              <Col md="8">
                <p className="subtitle text-primary">
                  {data.blogPosts.subTitle}
                </p>
                <h2>{data.blogPosts.title}</h2>
              </Col>
              <Col
                md="4"
                className="d-md-flex align-items-center justify-content-end"
              >
                <Link href={data.blogPosts.buttonLink}>
                  <a className="text-muted text-sm" target="_blank">
                    {data.blogPosts.button}
                    <FontAwesomeIcon
                      icon={faAngleDoubleRight}
                      className="ms-2"
                    />
                  </a>
                </Link>
              </Col>
            </Row>
            <Row>
              {noNewsLanesArticles.map((post, index) => {
                if (index <= 63)
                  return (
                    <Col
                      key={index}
                      lg="3"
                      sm="6"
                      className="mb-4 hover-animate"
                    >
                      <NewsPost data={post} />
                    </Col>
                  )
              })}
            </Row>
          </Container>
        </section>
      )}

      {data.jumbotron && (
        <section className="py-7 position-relative dark-overlay">
          <Image
            src={`/images/${data.jumbotron.img}`}
            alt=""
            className="bg-image"
            layout="fill"
          />
          <Container>
            <div className="overlay-content text-white py-lg-5">
              <h4 className="display-4 fw-bold text-serif text-shadow mb-5">
                {data.jumbotron.title}
              </h4>
              {allStocks ?
                <Button onClick={randomTickerSearch} variant="light">
                  Discover A Company
                </Button> :
                <Button onClick={randomTickerSearch} disabled={true}>
                Discover A Company
              </Button>
              }
            </div>
          </Container>
        </section>
      )}
      {/* <Guides /> */}
      {/* <LastMinute greyBackground /> */}
      

    </React.Fragment>
  )
}

function mapStateToProps(state){
  return{
    screenerData: state.screener
  }
}


// export default Index

export default connect(mapStateToProps)(Index);


// export async function getServerSideProps(){
//   const res = await axios.get(`${process.env.API_URL}/all_indexes/`);
//   console.log(res)
//   const data = res.data;

//   return {
//     props:{
//       data,
//     }
//   }
// }