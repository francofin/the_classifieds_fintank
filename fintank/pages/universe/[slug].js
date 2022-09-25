import React, {useEffect, useState} from "react"
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
  Pagination
} from "react-bootstrap"
import Select from "react-select"
import data from "@data/user-list.json"
import Avatar from "@components/Avatar"
import sector from "@data/sectors-subsectors.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faTimes, faDownload, faSearch, faAngleLeft, faAngleRight  } from "@fortawesome/free-solid-svg-icons"
import universe from "@data/universe.json"
import axios from 'axios';
import { useRouter } from "next/router"

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



// export async function getStaticPaths() {
//     return {
//       paths: getAllPostIds(),
//       fallback: false,
//     }
//   }
  

export async function getServerSideProps({ params, query }) {
  const parameters= getAllPostIds()
  const postData =await getPostData(query.slug)
  const slug = params.slug

  // const res = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/universe/${postData.slug}`);
  // console.log(res)
  // const data = res.data;

  console.log("Logging", query)

  const page = query.page || 1;
  let queryStr;
  if(page){
    queryStr = `?page=${page}`;
  }
  else {
    queryStr = ''
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

  const univerData = props.data.items
  console.log(univerData)

  const [keyWord, setKeyWord] = useState('')
  const [ticker, setTicker] = useState('')
  const [searchParam, setSearchParam] = useState('')
  const [activePage, setActivePage] = useState(1)
  const [sectorFilter, setSectorFilter] = useState('')
  const [subSectorFilter, setSubSectorFilter] = useState('')
  const [stockData, setStockData] = useState(univerData)
  const [startIndex, setStartIndex] = useState(0)
  const [limitIndex, setLimitIndex] = useState(props.resultsPerPage)
  const [numberOfPages, setNumberOfPages] = useState(Math.round(props.totalStocks/props.resultsPerPage))
  const router = useRouter();

  const submitFilterHandler = (e) => {
    e.preventDefault()
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

  const handlePageClick = (currentPage) => {

    setActivePage(currentPage)
  
    if(router.query.page){
      router.query.page = activePage;
      setStartIndex(limitIndex+1)
      setLimitIndex(limitIndex+props.resultsPerPage)
      console.log("Page Exisit")
    }
    else {
      setStartIndex(limitIndex+1)
      setLimitIndex(limitIndex+props.resultsPerPage)
      router.query.page = currentPage;
      console.log("Page Added")
    }

    router.push(router)
  } 


  const getPages = (allPages) => {
    const items = []
    for(let i=1; i <= allPages; i++){
      items.push(
      <Pagination.Item key={i} active={i==activePage} onClick={handlePageClick.bind(null,i)}>{i}</Pagination.Item> 
      )
    }
    return items
  }


  const adjustTimeStamp = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric"}
    return new Date(date).toLocaleDateString(undefined, options)
  }

  const handleSelect = (e) => {
    console.log(e)
    
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
    setStockData(univerData)
    setNumberOfPages(Math.round(props.totalStocks/props.resultsPerPage))
  }, [univerData, props])


  console.log(stockData)
  
  

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
        <ListGroup className="shadow mb-5">
          {stockData.slice(startIndex, limitIndex).map((stock, index) => (
            <Link href="/stock-data/[ticker]" as={`/stock-data/${stock.symbol}`} passHref key={index}>
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

export default Universe
