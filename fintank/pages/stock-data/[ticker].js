import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import {Container,Row,Col,Form,Button, Badge, Overlay} from "react-bootstrap"
import UseWindowSize from "@hooks/UseWindowSize"
import Swiper from "@components/Swiper"
import Reviews from "@components/Reviews"
import ReviewForm from "@components/ReviewForm"
import roomData from "@data/stock-research.json"
import blog from "@data/blog.json"
import SwiperGallery from "@components/SwiperGallery"
import Gallery from "@components/Gallery"
import Map from "@components/Map"
import { useStockData } from "@hooks/useStockData"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRight,
  faBath,
  faBed,
  faDoorOpen,
  faHeart,
  faLaptop,
  faLongArrowAltRight,
  faMapMarkerAlt,
  faSnowflake,
  faThermometerThreeQuarters,
  faTshirt,
  faTv,
  faUsers,
  faUtensils,
  faWifi,
} from "@fortawesome/free-solid-svg-icons"
import Avatar from "@components/Avatar"
import axios from 'axios';
import { useLocationService } from "@hooks/useLocationService"

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



// export async function getStaticPaths() {
//   return {
//     paths: getAllPostIds(),
//     fallback: false,
//   }
// }

export async function getServerSideProps({query }) {

    const ticker = query.ticker
    console.log(ticker)
    const stockRequested = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/stock-data/${ticker}`);
    const data = stockRequested.data

    

    console.log(data)
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
        data
        },
    }
}
const StockDetail = (props) => {
  const stockData = props.data.stock[0]
  const requestedData = useStockData(stockData.symbol)



  const [dataForStock, setDataForStock] = useState(null)
  const [position, setPosition] = useState(null)

  useEffect(() => {
    
    console.log(requestedData)
    setDataForStock(requestedData ? requestedData[0] : "")
  }, [requestedData])

  


  useEffect(() => {

    const fetcher = async (url) => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/getgeocode/${dataForStock?.city}${" "}${dataForStock?.state}`)
      const resData = res.data
      console.log(resData)
      setPosition(resData)
      return resData
    }

    fetcher()

  }, [dataForStock])

  console.log(position)

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
              {roomData.amenities && (
                <React.Fragment>
                  <div className="text-block">
                    <h4 className="mb-4">Amenities</h4>
                    <Row>
                    </Row>
                  </div>
                  <div className="text-block">
                    <h4 className="mb-0">Amenities alternative</h4>
                    <p className="subtitle text-sm text-primary mb-4">
                      Alternative amenities display
                    </p>
                    <ul className="list-inline">
                      {roomData.amenities.map((amenity) => (
                        <li
                          key={amenity.value}
                          className="list-inline-item mb-2"
                        >
                          <Badge
                            pill
                            bg="light"
                            className="p-3 text-muted fw-normal"
                          >
                            {amenity.value}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                </React.Fragment>
              )}
              {roomData.author && (
                <div className="text-block">
                  <div className="d-flex">
                    <div className={`avatar avatar-lg "me-4"`}>
                      <div className="position-relative overflow-hidden rounded-circle h-100 d-flex align-items-center justify-content-center">
                        <img
                            src={dataForStock?.image}
                            alt={stockData.name}
                            width="72px"
                            height="72px"
                            className={`rounded-circle`}
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
