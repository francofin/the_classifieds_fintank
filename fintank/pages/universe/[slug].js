import React, {useEffect, useState} from "react"
import Link from "next/link"
import Select from "react-select"
import sector from "@data/sectors-subsectors.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faTimes, faDownload, faSearch, faAngleLeft, faAngleRight  } from "@fortawesome/free-solid-svg-icons"
import {Container, Button, ListGroup, Form, InputGroup, Row, Col, Badge, Breadcrumb, Pagination, Modal} from "react-bootstrap"
import universe from "@data/universe.json"
import axios from 'axios';
import { useRouter } from "next/router"
import {connect} from 'react-redux';
import screenerAction from '@src/actions/screenerAction'
import { bindActionCreators } from "redux"

export function getAllPostIds() {
  return universe.posts.map((post) => ({
    params: {
      slug: post.slug,
    },
  }))
}
  
export async function getPostData(slug) {
  for (var i = 0; i < universe.posts.length; i++) {
    if (universe.posts[i].slug == slug) {
      return {
        stockItem: universe.posts[i],
        slug
      }
    }
  }
}

export async function getServerSideProps({ params, query }) {
  // const parameters= getAllPostIds()
  const postData =await getPostData(query.slug)
  let slug = params.slug
  

  let page = query.page || 1;
  let queryStr;
  if(page){
    queryStr =`?page=${page}`;
  }
  else {
    queryStr ='';
}

const res = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/universe/${postData.slug}${queryStr}`);
const data = res.data;

const totalStocks = data.count
const resultsPerPage = 20


const numberOfPages = data.count/data.results_per_page

return {
  props: {
    nav: {
      light: true,
      classes: "shadow",
      color: "white",
    },
    loggedUser: false,
    title: "Fintank Stock Screener",
    data,
    postData,
    numberOfPages,
    totalStocks,
    resultsPerPage,
    slug
  },
}
}

const Universe = (props) => {

  const [modal, setModal] = useState(false)

    const onClickModal = () => {
        setModal(!modal)
    }

  const univerData = props.data.items


  const [keyWord, setKeyWord] = useState('');
  const [ticker, setTicker] = useState('');
  const [minMarketCap, setMinMarketCap] = useState(0);
  const [maxMarketCap, setMaxMarketCap] = useState();
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [showPriceFilter, setShowPriceFilter] = useState(true);
  const [maxBeta, setMaxBeta] = useState(0);
  const [minBeta, setMinBeta] = useState(0);
  const [showBetaFilter, setShowBetaFilter] = useState(true);
  const [maxVolume, setMaxVolume] = useState();
  const [minVolume, setMinVolume] = useState();
  const [minDividend, setMinDividend] = useState();
  const [country, setCountry] = useState('');
  const [sectorScreener, setSectorScreener] = useState('');
  const [subSectorScreener, setSubSectorScreener] = useState('');
  const [searchParam, setSearchParam] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [sectorFilter, setSectorFilter] = useState('');
  const [subSectorFilter, setSubSectorFilter] = useState('');
  const [stockData, setStockData] = useState(univerData);
  const [startIndex, setStartIndex] = useState(0);
  const [limitIndex, setLimitIndex] = useState(props.resultsPerPage);
  const [numberOfPages, setNumberOfPages] = useState(Math.round(props.totalStocks/props.resultsPerPage));
  const [createLink, setCreateLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEquityRelated, setIsEquityRelated] = useState(true);
  const [analysisLink, setAnalysisLink] = useState("/stock-data/[ticker]");
  const [linkAs, setLinkAs] = useState(`/stock-data/`)

  const router = useRouter();
  console.log(router)


  const submitFilterHandler = (e) => {
    e.preventDefault();
    console.log(searchParam)
    let searchQuery;
    if (searchParam === 'keyword'){
      if(keyWord){
            console.log(keyWord);
            searchQuery = `/?keyword=${keyWord}`
          } else{
            router.reload();
          }
    } else if (searchParam === 'ticker'){
      if(ticker){
        console.log(ticker);
        searchQuery = `/?ticker=${ticker}`
      } else{
        router.reload();
      }
    }
  }

  let queryParams;
  if(typeof window !== 'undefined'){
    queryParams = new URLSearchParams(window.location.search)
  }

  const handlePageRoute = (currentPage) => {
    setActivePage(currentPage)
    if(queryParams.has('page')){
      queryParams.set('page', currentPage)
    } else {
      queryParams.append('page', currentPage)
    }

    router.push({
      pathname:props.slug,
      search:queryParams.toString()
    });
  }

  const handleScreenSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();      
    formData.append("market_cap_max", maxMarketCap ? maxMarketCap : undefined);
    formData.append("market_cap_min", minMarketCap? minMarketCap : 0);
    formData.append("beta_max", maxBeta ? maxBeta : undefined);
    formData.append("beta_min", minBeta ? minBeta : undefined);
    formData.append("dividend_min", minDividend ? minDividend : undefined);
    formData.append("sector", sectorScreener ? sectorScreener : undefined);
    formData.append("sub_industry", subSectorScreener ? subSectorScreener : undefined);
    formData.append("country", country ? country : undefined);
    formData.append("price_max", maxPrice ? maxPrice : undefined);
    formData.append("price_min", minPrice ? minPrice : undefined);
    const screenedItems = await props.screenerActionRun(formData);
    setLoading(false)
    !loading && window.open("/screener","_blank")
  }


  const getPages = (allPages) => {
    const items = []
    if(allPages <= 11){
      for(let i=1; i <= allPages; i++){
        items.push(
        <Pagination.Item key={i} active={i===activePage} onClick={()=>handlePageRoute(i)}>{i}</Pagination.Item> 
        )
      }
    }
    else{
      for(let i=1; i <= 11; i++){
        items.push(
        <Pagination.Item key={i} active={i==activePage} onClick={()=>handlePageRoute(i)}>{i}</Pagination.Item> 
        )
      }
      items.push(<Pagination.Ellipsis />)
      items.push(<Pagination.Item key={allPages} active={allPages===activePage} onClick={() => handlePageRoute(allPages)}>{allPages}</Pagination.Item> )
    }
    return items
  }


  const adjustTimeStamp = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric"}
    return new Date(date).toLocaleDateString(undefined, options)
  }

  const handleSelect = (e) => {
    if(e.type === "sector"){
      if (e.value !== "All"){
        const sectorFilter = univerData.filter((p) => p.sector===e.value)
        setStockData(sectorFilter)
      } else {
        setStockData(univerData)
      }
      
    } else if(e.type === "subsector"){
      if (e.value !== "All"){
        const subSectorFilter = univerData.filter((p) => p.sub_sector===e.value)
        setStockData(subSectorFilter)
      } else {
        setStockData(univerData)
      }
      
    }
  }


  useEffect(() => {
    if((maxBeta === "") || (minBeta === "")) {
      setShowBetaFilter(false)
      setMaxBeta(undefined)
      setMinBeta(undefined)
    }
  }, [showBetaFilter, minBeta, maxBeta])

  useEffect(() => {
    if(minDividend === "") {
      setMinDividend(undefined)
    }
  }, [minDividend])

  useEffect(() => {
    setStockData(univerData)
    setNumberOfPages(Math.round(props.totalStocks/props.resultsPerPage))
  }, [univerData, props])


  useEffect(() => {
    if (['commodities', 'cryptos', 'etfs', ].indexOf(router.query.slug) >=0){
      setIsEquityRelated(false)
    }
  }, [router])


  useEffect(() => {
      switch(router.query.slug){
        case "commodities":
          setAnalysisLink("/comm-data/[ticker]")
          setLinkAs(`/comm-data/`)
          break;
        case "cryptos":
          setAnalysisLink("/crypto-data/[ticker]")
          setLinkAs(`/crypto-data/`)
          break;
        case "etfs":
          setAnalysisLink("/etf-data/[ticker]")
          setLinkAs(`/etf-data/`)
          break;
        default:
          break;
      }

  }, [router.query.slug])
  

  return (
    <section className="py-5">
      <Container>
        <Breadcrumb listProps={{ className: "ps-0 justify-content-center" }}>
          <Link href="/" passHref>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item active>Host view</Breadcrumb.Item>
        </Breadcrumb>
        <div className="d-flex justify-content-between align-items-end mb-5">
          <h1 className="hero-heading mb-0">{props.postData.stockItem.title}</h1>
        </div>
        <Row>
            <Col xl="5" className="mx-auto">
              <Form onSubmit={submitFilterHandler}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search By Stock Name "
                    value={keyWord}
                    name={"keyword"}
                    onFocus = {(e) => setSearchParam(e.target.name)}
                    onChange = {(e) => setKeyWord(e.target.value)}
                  />
                  <Button type="submit">
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            OR
            <Col xl="5" className="mx-auto">
              <Form onSubmit={submitFilterHandler}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search By Stock Ticker "
                    value={ticker}
                    name="ticker"
                    onFocus = {(e) => setSearchParam(e.target.name)}
                    onChange = {(e) => setTicker(e.target.value)}
                  />
                  <Button type="submit">
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>

        <div className="d-flex justify-content-between align-items-center flex-column flex-lg-row mb-5 mt-5">
          <div className="me-3">
            <p className="mb-3 mb-lg-0">
              There are <strong>{props.data.count}</strong> Equities
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

        {isEquityRelated && <section className="pb-3">
        <Button onClick={onClickModal}>Launch Stock Screener</Button>
            <Modal show={modal} onHide={onClickModal}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-uppercase" as="h6">
                    Stock Screener
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted">
                    <strong>Fintank Stock Screener</strong> All Fields are not required.
                    We have crafted the ability to screen our universe based on
                    Market Cap of Stocks,Stock Dividend Yield, Beta, Price, Sector, Sub Industry
                    and Country. Screen excludes ETFs.{" "}
                    <a href="#">More Info on our Screener</a>
                    </p>

                    
                      <div className="w-100 py-2 px-md-2 px-xxl-2 position-relative">
                     
                        <Form className="form-validate" onSubmit={handleScreenSubmit}>
                        <Row className="min-vh-20">
                          <Col md="8" lg="6" xl="6" className="d-flex align-items-center">
                            <div className="mb-4">
                              <Form.Label htmlFor="loginUsername">Maximum Market Cap</Form.Label>
                              <Form.Select aria-label="Default select example" onChange={(e)=>setMaxMarketCap(e.target.value)}>
                              <option>Select Max Market Cap</option>
                              {sector.marketCapRanges.map((sub, i) => {
                                return(
                                  <option key={i} value={sub.value}>{sub.label}</option>
                                )
                              })}
                            </Form.Select>
                            </div>
                          </Col>
                          <Col md="8" lg="6" xl="6" className="d-flex align-items-center">
                          <div className="mb-4">
                            <Form.Label htmlFor="loginUsername">Minimum Market Cap</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={(e)=>setMinMarketCap(e.target.value)}>
                              <option>Select Min Market Cap</option>
                              {sector.marketCapRanges.map((sub, i) => {
                                return(
                                  <option key={i} value={sub.value}>{sub.label}</option>
                                )
                              })}
                            </Form.Select>
                          </div>
                          </Col>
                          <Col md="8" lg="6" xl="6" className="d-flex align-items-center">
                            <div className="mb-4">
                              <Form.Label htmlFor="loginUsername">Maximum Price</Form.Label>
                              <Form.Select aria-label="Default select example" onChange={(e)=>setMaxPrice(e.target.value)}>
                              <option>Select Maximum Price</option>
                              {sector.priceRanges.map((sub, i) => {
                                return(
                                  <option key={i} value={sub.value}>{sub.label}</option>
                                )
                              })}
                            </Form.Select>
                            </div>
                          </Col>
                          <Col md="8" lg="6" xl="6" className="d-flex align-items-center">
                          <div className="mb-4">
                            <Form.Label htmlFor="loginUsername">Minimum Price</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={(e)=>setMinPrice(e.target.value)}>
                              <option>Select Minimum Price</option>
                              {sector.priceRanges.map((sub, i) => {
                                return(
                                  <option key={i} value={sub.value}>{sub.label}</option>
                                )
                              })}
                            </Form.Select>
                          </div>
                          </Col>
                          {showBetaFilter ?
                          <>
                          <Col md="8" lg="6" xl="6" className="d-flex align-items-center">
                            <div className="mb-4">
                              <Form.Label htmlFor="loginUsername">Maximum Beta</Form.Label>
                              <Form.Select aria-label="Default select example" onChange={(e)=>setMaxBeta(e.target.value)}>
                              <option>Select Max Beta</option>
                              {sector.betaRanges.map((sub, i) => {
                                return(
                                  <option key={i} value={sub.value}>{sub.label}</option>
                                )
                              })}
                            </Form.Select>
                            </div>
                          </Col>  
                          <Col md="8" lg="6" xl="6" className="d-flex align-items-center">
                          <div className="mb-4">
                            <Form.Label htmlFor="loginUsername">Minimum Beta</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={(e)=>setMinBeta(e.target.value)}>
                              <option>Select Min Beta</option>
                              {sector.betaRanges.map((sub, i) => {
                                return(
                                  <option key={i} value={sub.value}>{sub.label}</option>
                                )
                              })}
                            </Form.Select>
                          </div>
                          </Col>
                          </> :
                           <Col md="8" lg="6" xl="6" className="d-flex align-items-center">
                            <div className="mb-4">
                              <Form.Label htmlFor="loginUsername">Beta</Form.Label>
                              <Form.Select aria-label="Default select example" onChange={(e)=>setShowBetaFilter(e.target.value)}>
                              <option>No Screen Chosen</option>
                              <option value={true}>Select Beta Screen</option>
                            </Form.Select>
                            </div>
                           </Col> }
                          <Col md="8" lg="6" xl="6" className="d-flex align-items-center">
                          <div className="mb-4">
                            <Form.Label htmlFor="loginUsername">Dividend Yield</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={(e)=>setMinDividend(e.target.value)}>
                              <option>Select Dividend Treatment</option>
                              {sector.dividendFilter.map((sub, i) => {
                                return(
                                  <option key={i} value={sub.value}>{sub.label}</option>
                                )
                              })}
                            </Form.Select>
                          </div>
                          </Col>
                          </Row>

                          <div className="mb-4">
                            <Form.Label htmlFor="loginUsername">Sector</Form.Label>
                            {/* <Form.Control
                              type="text"
                              value={sectorScreener}
                              autoComplete="off"
                              onChange={(e) => setSectorScreener(e.target.value)}
                            /> */}
                            <Form.Select aria-label="Default select example" onChange={(e)=>setSectorScreener(e.target.value)}>
                              <option>Select Sector</option>
                              <option value="Technology">Information Technology</option>
                              <option value="Consumer Cyclical">Consumer Cyclical</option>
                              <option value="Consumer Defensive">Consumer Defensive</option>
                              <option value="Industrials">Industrials </option>
                              <option value="Financial Services">Financial Services</option>
                              <option value="Basic Materials">Materials</option>
                              <option value="Energy">Energy</option>
                              <option value="Healthcare">Healthcare</option>
                              <option value="Utilities">Utilities</option>
                              <option value="Real Estate">Real Estate</option>
                              <option value="Communication Services">Communication Services</option>
                              <option value="Financial">Financial</option>
                            </Form.Select>
                          </div>
                          <div className="mb-4">
                            <Form.Label htmlFor="loginUsername">SubSector</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={(e)=>setSubSectorScreener(e.target.value)}>
                              <option>Select Sector</option>
                              {sector.subSectors.map((sub, i) => {
                                return(
                                  <option key={i} value={sub.label}>{sub.label}</option>
                                )
                              })}
                            </Form.Select>
                          </div>
                          <Row className="min-vh-20">
                            <Col md="8" lg="6" xl="6" className="d-flex align-items-center">
                            <div className="mb-4">
                              <Form.Label htmlFor="loginUsername">Country</Form.Label>
                              <Form.Select aria-label="Default select example" onChange={(e)=>setCountry(e.target.value)}>
                              <option>Select Country</option>
                              {sector.country.map((sub, i) => {
                                return(
                                  <option key={i} value={sub.value}>{sub.label}</option>
                                )
                              })}
                            </Form.Select>
                            </div>
                            </Col>
                          </Row>

                          
                          <div className="d-grid">
                            <Button type="submit">Run Screen</Button>
                          </div>
                        </Form>
                        
                        <hr data-content="Get More Information" className="my-3 hr-text letter-spacing-2" />
                        <hr className="my-4" />
                        <p className="text-sm text-muted">
                          {`See our Disclosures For more information on the Stock Screener.`}{" "}
                          <a href="#">Terms and Conditions</a> and{" "}
                          <a href="#">Privacy Policy</a>.
                        </p>
                      </div>
                    
                </Modal.Body>
                <Modal.Footer className="justify-content-end">
                  {createLink &&
                    <Link variant="success" href="/screener" passHref>
                      View Results
                    </Link>
                  }
                  
                    <Button variant="outline-muted" onClick={onClickModal}>
                    Close Screener
                    </Button>
                </Modal.Footer>
            </Modal>
        </section> 
        }
        

        <ListGroup className="shadow mb-5">
          {stockData.slice(startIndex, limitIndex).map((stock, index) => (
            <Link href={analysisLink} as={`${linkAs}/${stock.symbol}`} passHref key={index}>
              <ListGroup.Item action className="p4" as="a">
                <Row>
                  <Col lg="4" className="align-self-center mb-4 mb-lg-0">
                    <div className="d-flex align-items-center mb-3">
                      <h2 className="h5 mb-0">{stock.name}</h2>
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
                      Founded: {stock.founded}
                    </Badge>
                  </Col>
                  <Col lg="8">
                    <Row>
                      <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                        <h6 className="label-heading">Ticker</h6>
                        <p className="text-sm fw-bold">{stock.symbol}</p>
                        <h6 className="label-heading">CIK</h6>
                        <p className="text-sm fw-bold">{stock.cik}</p>
                      </Col>
                      <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                        <h6 className="label-heading">Sector</h6>
                        <p className="text-sm fw-bold">{stock.sector}</p>
                      </Col>
                      <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                        <h6 className="label-heading">Sub-Sector</h6>
                        <p className="text-sm fw-bold">{stock.sub_sector}</p>
                      </Col>
                      <Col xs="12" lg="3" className="align-self-center">
                        {stock.date_first_added && 
                          <span
                          className={`${
                            stock.date_first_added ? "text-primary" : "text-muted"
                          } text-sm text-uppercase me-4 me-lg-0`}
                        >
                          <h6 className="label-heading">Date first Added</h6>
                          <FontAwesomeIcon
                            icon={stock.date_first_added ? faCheck : faTimes}
                            className="me-2"
                          />
                          {adjustTimeStamp(stock.date_first_added)}
                        </span>
                        }
                        <br className="d-none d-lg-block" />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </ListGroup.Item>
            </Link>
          ))}
        </ListGroup>
        {props.data.results_per_page < props.data.count && 
          <Pagination
              aria-label="Page navigation example"
              className="d-flex justify-content-center"
            >
              <Pagination.First href="#">
                <FontAwesomeIcon icon={faAngleLeft} />
              </Pagination.First>
              {/* {getPages(Math.round(props.numberOfPages))} */}
              {getPages(numberOfPages)}
              <Pagination.Last href="#">
                <FontAwesomeIcon icon={faAngleRight} />
              </Pagination.Last>
            </Pagination>
        }
        
      </Container>
    </section>
  )
}

function mapStateToProps(state){
  return {
    screenerAction:state.screener
  }
}

function mapDispatchToProps(dispatch){

  return bindActionCreators({
    screenerActionRun:screenerAction
  }, dispatch)

}

export default connect(mapStateToProps, mapDispatchToProps)(Universe);
