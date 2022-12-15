import React, {useEffect, useState, useContext} from "react"
import Link from "next/link"
import {
  Container,
  Button,
  ListGroup,
  Form,
  InputGroup,
  Row,
  Col,
  Badge,
  Breadcrumb,
  Pagination,
  Modal
} from "react-bootstrap"
import Select from "react-select"
import sector from "@data/sectors-subsectors.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faTimes, faDownload, faSearch, faAngleLeft, faAngleRight  } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/router"
import {connect} from 'react-redux'



export async function getStaticProps() {
  return {
    props: {
      nav: {
        light: true,
        classes: "shadow",
        color: "white",
      }
    },
  }
}

const Screener = (props) => {

  console.log(props.screenerResults)

//   const [keyWord, setKeyWord] = useState('')
//   const [ticker, setTicker] = useState('')
//   const [searchParam, setSearchParam] = useState('')
//   const [activePage, setActivePage] = useState(1)
  const [sectorFilter, setSectorFilter] = useState('')
  const [subSectorFilter, setSubSectorFilter] = useState('')
  const [stockData, setStockData] = useState([])
//   const [startIndex, setStartIndex] = useState(0)
//   const [limitIndex, setLimitIndex] = useState(props.resultsPerPage)
//   const [numberOfPages, setNumberOfPages] = useState(Math.round(props.totalStocks/props.resultsPerPage))
  const router = useRouter();

//   const submitFilterHandler = (e) => {
//     e.preventDefault();
//     console.log(searchParam)
//     let searchQuery;
//     if (searchParam === 'keyword'){
//       if(keyWord){
//             console.log(keyWord);
//             searchQuery = `/?keyword=${keyWord}`
//           } else{
//             router.reload();
//           }
//     } else if (searchParam === 'ticker'){
//       if(ticker){
//         console.log(ticker);
//         searchQuery = `/?ticker=${ticker}`
//       } else{
//         router.reload();
//       }
//     }
//   }

//   const handlePageClick = (currentPage) => {

//     setActivePage(currentPage)
  
//     if(router.query.page){
//       router.query.page = activePage;
//       setStartIndex(limitIndex+1)
//       setLimitIndex(limitIndex+props.resultsPerPage)
//       console.log("Page Exisit")
//     }
//     else {
//       setStartIndex(limitIndex+1)
//       setLimitIndex(limitIndex+props.resultsPerPage)
//       router.query.page = currentPage;
//       console.log("Page Added")
//     }

//     router.push(router)
//   } 


//   const getPages = (allPages) => {
//     const items = []
//     for(let i=1; i <= allPages; i++){
//       items.push(
//       <Pagination.Item key={i} active={i==activePage} onClick={handlePageClick.bind(null,i)}>{i}</Pagination.Item> 
//       )
//     }
//     return items
//   }


  const adjustTimeStamp = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric"}
    return new Date(date).toLocaleDateString(undefined, options)
  }

  const handleSelect = (e) => {
    console.log(e)
    
    if(e.type === "sector"){
      if (e.value !== "All"){
        const sectorFilter = screenData.filter((p) => p.sector===e.value)
        setStockData(sectorFilter)
      } else {
        setStockData(screenData)
      }
      
    } else if(e.type === "subsector"){
      if (e.value !== "All"){
        const subSectorFilter = screenData.filter((p) => p.sub_sector===e.value)
        setStockData(subSectorFilter)
      } else {
        setStockData(screenData)
      }
      
    }
  }

  return (
    <section className="py-5">
      <Container>
        <Breadcrumb listProps={{ className: "ps-0 justify-content-center" }}>
          <Link href="/" passHref>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item active>Screen view</Breadcrumb.Item>
        </Breadcrumb>
        <div className="d-flex justify-content-between align-items-end mb-5">
          <h1 className="hero-heading mb-0">Screen Results</h1>
        </div>


        <div className="d-flex justify-content-between align-items-center flex-column flex-lg-row mb-5 mt-5">
          <div className="me-3">
            <p className="mb-3 mb-lg-0">
              There are <strong>{props.screenerResults.length}</strong> Equities in your screen
            </p>
          </div>
          <div className="text-center">
            <label className="form-label me-2">Sectors</label>
            <Select
              id="sector"
              options={sector.sectors}
              defaultValue={sectorFilter}
              onChange = {handleSelect}
              className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
              classNamePrefix="selectpicker"
            />
            <label className="form-label me-2">Sub Sectors</label>
            <Select
              id="subsector"
              options={sector.subSectors}
              defaultValue={subSectorFilter}
              className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
              onChange = {(e) => handleSelect(e)}
              classNamePrefix="selectpicker"
            />
            <label className="form-label me-2">Currency</label>
            <Select
              id="currency"
              // options={data.sortby}
              // defaultValue={data.sortby[0]}
              className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
              classNamePrefix="selectpicker"
            />
          </div>
        </div>

        <ListGroup className="shadow mb-5">
          {props.screenerResults.splice(0,50)?.map((stock, index) => (
            <Link href="/stock-data/[ticker]" as={`/stock-data/${stock.symbol}`} passHref key={index}>
              <ListGroup.Item action className="p4" as="a">
                <Row>
                  <Col lg="4" className="align-self-center mb-4 mb-lg-0">
                    <div className="d-flex align-items-center mb-3">
                      <h2 className="h5 mb-0">{stock.companyName}</h2>
                      {/* <Avatar
                        image={`/content/img/avatar/${booking.avatar}`}
                        size="sm"
                        className="ms-3  avatar-border-white"
                        cover
                        alt=""
                      /> */}
                    </div>
                    <Badge
                      bg={
                        stock.founded
                          && "success-light"
                      }
                      text={
                        stock.founded && "success"
                      }
                      className="p-2"
                      pill
                    >
                      Price: {(stock.price).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </Badge>
                  </Col>
                  <Col lg="8">
                    <Row>
                      <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                        <h6 className="label-heading">Ticker</h6>
                        <p className="text-sm fw-bold">{stock.symbol}</p>
                        <h6 className="label-heading">Exchange</h6>
                        <p className="text-sm fw-bold">{stock.exchange}</p>
                      </Col>
                      <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                        <h6 className="label-heading">Sector</h6>
                        <p className="text-sm fw-bold">{stock.sector}</p>
                      </Col>
                      <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                        <h6 className="label-heading">Sub-Sector</h6>
                        <p className="text-sm fw-bold">{stock.industry}</p>
                      </Col>
                      <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                        <h6 className="label-heading">Beta</h6>
                        <p className="text-sm fw-bold">{stock.beta}</p>
                      </Col>
                      <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                        <h6 className="label-heading">Market Cap</h6>
                        <p className="text-sm fw-bold">{(stock.marketCap).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                      </Col>
                      <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                        <h6 className="label-heading">County</h6>
                        <p className="text-sm fw-bold">{stock.country}</p>
                      </Col>

                    </Row>
                  </Col>
                </Row>
              </ListGroup.Item>
            </Link>
          ))}
        </ListGroup>        
      </Container>
    </section>
  )
}

function mapStateToProps(state){
  return{
    screenerResults:state.screener
  }
}

export default connect(mapStateToProps)(Screener);
