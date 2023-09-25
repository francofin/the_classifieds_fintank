import React, {useEffect, useMemo, useState, useContext, useRef} from "react"
import Link from "next/link"
import Image from "@components/CustomImage"
import axios from 'axios'
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { Container, Row, Col, Button, Dropdown, Form, Overlay, Collapse, Pagination, InputGroup, ListGroup } from "react-bootstrap"
import UseWindowSize from "@hooks/UseWindowSize"
import Swiper from "@components/Swiper"
import {SwiperSlide } from "swiper/react"
import Select from "react-select"
import { useChartUpdater } from "@hooks/useChartUpdater";
import SearchBar from "@components/SearchBar";
import LastMinute from "@components/LastMinute";
import { useChartResource } from "@hooks/useChartResources"
import Nouislider from "nouislider-react"
import data from "@data/chartsettings.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faSearch } from "@fortawesome/free-solid-svg-icons"
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons"
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
import swal from 'sweetalert';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export async function getStaticProps() {

  return {
    props: {
      nav: {
        light: true,
        classes: "shadow",
        color: "white",
      },
      title: "Charting Area",
    },
  }
}


const ChartArea = (props) => {
    const size = UseWindowSize()
    const [range, setRange] = useState({
      from: false,
      to: false,
    })
    const {data:stockNames} = useStockNames();
    const [filterCollapse, setFilterCollapse] = useState(false)
    const [filterLineCollapse, setLineFilterCollapse] = useState(false)
    const [fundamentalData, setFundamentalData] = useState([]);
    const [selectedEquities, setSelectedEquities] = useState([]);
    const [indexChosen, setIndexChosen] = useState(null)
    const [priceMin, setPriceMin] = useState(40)
    const [priceMax, setPriceMax] = useState(110)
    const [loadedIndexes, setLoadedIndexes] = useState([data.indexes[Math.floor(Math.random()*data.indexes.length)], data.indexes[Math.floor(Math.random()*data.indexes.length)]])
    const [equity, setEquity] = useState('')
    const [searchFocus, setSearchFocus] = useState(false)
    const [activeSuggestion, setActiveSuggestion] = useState(0)
    const [filteredSuggestions, setFilteredSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [ticker, setTicker] = useState('')
    const [searchTicker, setSearchTicker] = useState('')
    const dataOne = useChartResource(loadedIndexes[0]);
    const dataTwo = useChartResource(loadedIndexes[1]);
    const onFocus = () => setSearchFocus(!searchFocus);
    const router = useRouter();
    
    

    const {indexChartCreated:defaultChartUp, createIndexChart:defaultChart, chartOptions:defaultOptions} = useChartUpdater(loadedIndexes,dataOne?.data?.prices,dataOne?.data?.dates, dataTwo?.data?.prices,dataTwo?.data?.dates);


    
    const returnQuery = (e) => {
        e.preventDefault();

        router.push(`/stock-data/${searchTicker}`)
    }


  
    const allStocks = stockNames?.stocks


    const onSearchChange = (e) => {
        // const { suggestions  = allStocks;
        const userInput = e.target.value;

        // Filter our suggestions that don't contain the user's input
        const suggestionFilter = allStocks?.filter(
        suggestion =>
            (suggestion['symbol'].toLowerCase().indexOf(userInput.toLowerCase()) > -1) || (suggestion['name'].toLowerCase().indexOf(userInput.toLowerCase()) > -1)
        );
        // setActiveSuggestion(0)
        setFilteredSuggestions(suggestionFilter)
        setShowSuggestions(true)
        setTicker(userInput)
        
        
    };


    const onKeySuggestDown = (e) => {
        // const { activeSuggestion, filteredSuggestions } = this.state;

        // User pressed the enter key
        if (e.keyCode === 13) {
        setActiveSuggestion(0)
        setShowSuggestions(false)
        setTicker(filteredSuggestions[activeSuggestion])
        }
        // User pressed the up arrow
        else if (e.keyCode === 38) {
        if (activeSuggestion === 0) {
            return;
        }

        setActiveSuggestion(activeSuggestion - 1);
        }
        // User pressed the down arrow
        else if (e.keyCode === 40) {
        if (activeSuggestion - 1 === filteredSuggestions.length) {
            return;
        }

        setActiveSuggestion(activeSuggestion + 1);
        }
    };

    const onSuggestionClick = (item) => {

        setActiveSuggestion(0)
        setShowSuggestions(false)
        setFilteredSuggestions([])
        setSearchTicker(item)
        setTicker(item)

    };

    const handleIndexSelect = (e) => {
      if(loadedIndexes.length === 2){
        swal({
          title: `Max 2 assests are allowed, Please delete one to continue!`,
          icon: "error",
      });
      } else{
        setIndexChosen(e)
        console.log(e);
        setLoadedIndexes([...loadedIndexes, e]);
      }
    }

    const removeIndex = (stock) => {
      const updatedIndexes = loadedIndexes.filter((item) => item != stock);
      setLoadedIndexes(updatedIndexes);
    }

    const renderSuggestedList = () => {
        return(
        <ListGroup variant="flush" className="d-inline-block" style={{position:'absolute'}}>
        {filteredSuggestions?.map((suggestion, i) => {
            return(
            <ListGroup.Item key={i} as="li" onClick={() => onSuggestionClick(suggestion['symbol'])}>
                    {suggestion['symbol']} - {suggestion['name']} - {suggestion['exchange']}
                </ListGroup.Item>
            )
        })}
        </ListGroup>
        )
    }
  
    
  
    const priceSlider = (render, handle, value, un, percent) => {
      setPriceMin(value[0].toFixed(0))
      setPriceMax(value[1].toFixed(0))
    }



    const submitFilterHandler = (e) => {
        e.preventDefault();
        const allEquities = [...selectedEquities];
        allEquities.push(ticker)
        setSelectedEquities(allEquities);
        setTicker('')   
    }

  
    return (
        
      <React.Fragment>
        <section className="d-flex align-items-center dark-overlay">
          <Image
            src={`/images/homepageImages/chart.jpg`}
            layout="fill"
            className="bg-image"
            alt="Hero image"
            loading="eager"
            priority={true}
          />
          <Container className="py-6 py-lg-7 text-white overlay-content text-center">
            <Row>
              <Col xl="10" className="mx-auto">
                <h1 className="display-3 fw-bold text-shadow">
                  {`Fintank Charting Platform`}
                </h1>
                <p className="text-lg text-shadow mt-3">Build Comparison Data Sets based on equities, commodities, crypto-currencies and other asset Types available.</p>
              </Col>
            </Row>
          </Container>
        </section>
        <Container fluid className="py-5 px-lg-5">
          <Row>
            <Col lg="3" className="pt-3">
                <div className="mb-4">
                    <Collapse in={filterCollapse}>
                        <div>
                        <div className="filter-block">
                      <h6 className="mb-3">Fundamental Attributes (Max 2 Assets)</h6>
                      <div className="mb-4">
                        <Form onSubmit={submitFilterHandler}>
                            <Form.Label htmlFor="stock">
                            Add Stock
                            </Form.Label>
                            <InputGroup>
                            <Form.Control
                                name="stock"
                                id="stock"
                                type="text"
                                placeholder="Add Stock"
                                autoComplete="off"
                                required
                                value={equity} 
                                onChange={(e) => setEquity(e.target.value)} 
                                />
                            <Button type="submit">
                                <FontAwesomeIcon icon={faSearch} />
                            </Button>
                            </InputGroup>
                        </Form>
                      </div>
                      {selectedEquities && (
                        <div className="mb-0">
                          <Form.Label className="form-label">
                            Assets Selected
                          </Form.Label>
                          <ul className="list-inline mt-xl-1 mb-0">
                            {selectedEquities.map((stock, i) => (
                              <li key={i} className="list-inline-item">
                                <Form.Text>
                                    {stock}
                                </Form.Text>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                        </div>
                    </Collapse>
                  <Button
                    aria-expanded={filterCollapse}
                    onClick={() => setFilterCollapse(!filterCollapse)}
                    variant="link"
                    className="btn-collapse ps-0 text-primary"
                  >
                    {filterCollapse ? "Close Fundamental Attrributes" : "Fundamental Attrributes"}
                  </Button>
                  <Collapse in={filterLineCollapse}>
                        <div>
                        <div className="filter-block">
                      <h6 className="mb-3">Line Charts</h6>
                      <div className="mb-4">
                        <Form onSubmit={submitFilterHandler}>
                            <Form.Label htmlFor="stock">
                            Add Stock
                            </Form.Label>
                            <div className="mb-4">
                            <Form.Label htmlFor="form_guests">Select Region</Form.Label>
                                <Select
                                    name="guests"
                                    inputId="form_guests"
                                    options={data.regions && data.regions}
                                    isMulti
                                    isSearchable
                                    className="form-control dropdown bootstrap-select"
                                    classNamePrefix="selectpicker"
                                />
                            </div>
                            <div className="mb-4">
                            <Form.Label htmlFor="form_guests">Add Index</Form.Label>
                                <Select
                                    name="guests"
                                    inputId="form_guests"
                                    options={data.indexes && data.indexes}
                                    value={indexChosen}
                                    isSearchable
                                    onChange = {handleIndexSelect}
                                    className="form-control dropdown bootstrap-select"
                                    classNamePrefix="selectpicker"
                                />
                            </div>
                            <div className="mb-4">
                            <Form.Label htmlFor="form_guests">Add Economic DataSet</Form.Label>
                                <Select
                                    name="guests"
                                    inputId="form_guests"
                                    options={data.economicdata && data.economicdata}
                                    isMulti
                                    isSearchable
                                    className="form-control dropdown bootstrap-select"
                                    classNamePrefix="selectpicker"
                                />
                            </div>
                            <InputGroup>
                            <Form.Control
                                id={"equity_search"}
                                placeholder="Search Ticker"
                                aria-label="Search"
                                size="sm"
                                type="text"
                                autoComplete="off"
                                required
                                value={ticker} 
                                onFocus={onFocus}
                                onChange={(e) => onSearchChange(e)}
                                onBlur={() => setTimeout(() => onFocus(), 333)} 
                                />
                                
                            <Button type="submit">
                                <FontAwesomeIcon icon={faSearch} />
                            </Button>
                            </InputGroup>
                        </Form>
                        {(showSuggestions && filteredSuggestions?.length < 40) ?
                                <div onKeyDown = {(e) => onKeySuggestDown(e)}s>
                                    {renderSuggestedList()}
                                </div>:
                                ""
                                }
                      </div>
                      {loadedIndexes && (
                        <div className="mb-0">
                          <Form.Label className="form-label">
                            Assets Selected
                          </Form.Label>
                          <ul className="list-inline mt-xl-1 mb-0">
                            {loadedIndexes.map((stock, i) => (
                              <li key={i} className="list-inline-item">
                                <Form.Text>
                                  <Button 
                                  onClick={() => removeIndex(stock)}
                                  variant="link">
                                    {stock.label}
                                  </Button>  
                                </Form.Text>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                        </div>
                    </Collapse>
                  <Button
                    aria-expanded={filterLineCollapse}
                    onClick={() => setLineFilterCollapse(!filterLineCollapse)}
                    variant="link"
                    className="btn-collapse ps-0 text-primary"
                  >
                    
                    {filterLineCollapse ? "Close Line Chart" : "Add Line Chart"}
                  </Button>
                </div>
            </Col>
            <Col lg="9">
              {defaultChartUp &&
              <Row>
                <Line options={defaultOptions} data={defaultChart} height={100} width={200}/>
              </Row>
              }

            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
}



export default ChartArea