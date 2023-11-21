import React, {useEffect, useMemo, useState, useContext, useRef} from "react"
import Link from "next/link"
import Image from "@components/CustomImage"
import axios from 'axios'
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { Container, Row, Col, Button, Dropdown, Form, Overlay, Collapse, Pagination, InputGroup, ListGroup, Modal } from "react-bootstrap"
import UseWindowSize from "@hooks/UseWindowSize"
import Select from "react-select"
import { useChartResource } from "@hooks/useChartResources"
import Nouislider from "nouislider-react"
import data from "@data/chartsettings.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faSearch } from "@fortawesome/free-solid-svg-icons"
import { useNewCandleStick } from "@hooks/useNewCandleSticks";
import { useStockNames } from "@hooks/useStockNames"
import { useRouter } from "next/router"
import Icon from "@components/Icon"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  LineController,
  BarController,
  Legend,
} from 'chart.js';

import swal from 'sweetalert';
import { Line, Chart } from 'react-chartjs-2';
import { factorCharter } from "@utils/plotFactorChart"
import dynamic from 'next/dynamic'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
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



const StockPerformances = (props) => {
  const [index, setIndex] = useState('')
  const [indexLabel, setIndexLabel] = useState('Select Index')
  const [frequency, setFrequency] = useState('')
  const [frequencyLabel, setFrequencyLabel] = useState('Select Periodicity')
  const [queryData, setQueryData] = useState(null)
  const [peChart, setPeChart] = useState(false)
  const [peData, setPeData] = useState(null)
  const [betaChart, setBetaChart] = useState(false)
  const [betaData, setBetaData] = useState(null)
  const [cfdChart, setCfdChart] = useState(false)
  const [cfdData, setCfdData] = useState(null)
  const [psChart, setPSChart] = useState(false)
  const [psData, setPSData] = useState(null)
  const [pbChart, setPbChart] = useState(false)
  const [pbData, setPbData] = useState(null)
  const [pcfChart, setPcfChart] = useState(false)
  const [pcfData, setPcfData] = useState(null)
  const [roeChart, setRoeChart] = useState(false)
  const [roeData, setRoeData] = useState(null)
  const [deChart, setDeChart] = useState(false)
  const [deData, setDeData] = useState(null)
  const [intCovChart, setIntCovChart] = useState(false)
  const [intCovData, setIntCovData] = useState(null)
  const [fcfChart, setFcfChart] = useState(false)
  const [fcfData, setFcfData] = useState(null)
  const [divChart, setDivChart] = useState(false)
  const [divData, setDivData] = useState(null)
  const [stdevOneChart, setStdevOneChart] = useState(false)
  const [stdevOneData, setStdevOneData] = useState(null)
  const [stdevThreeChart, setStdevThreeChart] = useState(false)
  const [stdevThreeData, setStdevThreeData] = useState(null)
  const [stdevSixChart, setStdevSixChart] = useState(false)
  const [stdevSixData, setStdevSixData] = useState(null)
  const [stdevYtdChart, setStdevYtdChart] = useState(false)
  const [stdevYtdData, setStdevYtdData] = useState(null)
  const [sectorChart, setSectorChart] = useState(false)
  const [sectorData, setSectorData] = useState(null)


  const handleIndexSelection = (e) => {
    console.log(e)
    setIndexLabel(e.label);
    setIndex(e.value);
  }

  const handleFrequencySelection = (e) => {
    console.log(e)
    setFrequencyLabel(e.label);
    setFrequency(e.value);
  }

  const submitDecilePerformance = async(e) => {
    e.preventDefault();
    if(index === '' || frequency === ''){
      swal({
        title: `You Must Select an Index and a Time Period first.`,
        icon: "warning",
    });
    return
    }
      let periodicityData;
      let periodicityResults= null;
      if (index && frequency){
        periodicityData = axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/getstockquintiles/${frequency}/${index}`)
        periodicityResults = (await periodicityData).data;

        console.log(periodicityResults);
        const peCharter = factorCharter(periodicityResults?.data?.pe?.values, periodicityResults?.data?.pe?.buckets, 'Price/Earnings', 'Stock Returns Ranked by Price to Earnings Ratio')
        setPeChart(true)
        setPeData(peCharter)

        const psCharter = factorCharter(periodicityResults?.data?.ps?.values, periodicityResults?.data?.ps?.buckets, 'Price/Sales', 'Stock Returns Ranked by Price to Sales Ratio')
        setPSChart(true)
        setPSData(psCharter)

        const pbCharter = factorCharter(periodicityResults?.data?.pb?.values, periodicityResults?.data?.pb?.buckets, 'Price/Book', 'Stock Returns Ranked by Price to Book Ratio')
        setPbChart(true)
        setPbData(pbCharter)

        const pcfCharter = factorCharter(periodicityResults?.data?.pcf?.values, periodicityResults?.data?.pcf?.buckets, 'Price/Cash Flow', 'Stock Returns Ranked by Price to Cash Flow Ratio')
        setPcfChart(true)
        setPcfData(pcfCharter)

        const divCharter = factorCharter(periodicityResults?.data?.div?.values, periodicityResults?.data?.div?.buckets, 'Dividend Yield', 'Stock Returns Ranked by Dividend Yield')
        setDivChart(true)
        setDivData(divCharter)

        const fcfCharter = factorCharter(periodicityResults?.data?.fcf?.values, periodicityResults?.data?.fcf?.buckets, 'Free Cash Flow', 'Stock Returns Ranked by Free Cash Flow')
        setFcfChart(true)
        setFcfData(fcfCharter)

        const roeCharter = factorCharter(periodicityResults?.data?.roe?.values, periodicityResults?.data?.roe?.buckets, 'Return On Equity', 'Stock Returns Ranked by Return On Equity')
        setRoeChart(true)
        setRoeData(roeCharter)

        const deCharter = factorCharter(periodicityResults?.data?.de?.values, periodicityResults?.data?.de?.buckets, 'Debt to Equity', 'Stock Returns Ranked by Debt To Equity Ratio')
        setDeChart(true)
        setDeData(deCharter)

        const cfdCharter = factorCharter(periodicityResults?.data?.cfd?.values, periodicityResults?.data?.cfd?.buckets, 'Cash Flow to Debt', 'Stock Returns Ranked by Cash Flow to Debt Ratio')
        setCfdChart(true)
        setCfdData(cfdCharter)

        const intcovCharter = factorCharter(periodicityResults?.data?.int_cov?.values, periodicityResults?.data?.int_cov?.buckets, 'Interest Coverage', 'Stock Returns Ranked by Interest Coverage')
        setIntCovChart(true)
        setIntCovData(intcovCharter)

        const betaCharter = factorCharter(periodicityResults?.data?.beta?.values, periodicityResults?.data?.beta?.buckets, 'Beta', 'Stock Returns Ranked by Beta')
        setBetaChart(true)
        setBetaData(betaCharter)
        

        const stdevoneCharter = factorCharter(periodicityResults?.data?.stdevone?.values, periodicityResults?.data?.stdevone?.buckets, 'Standard Deviation One Month', 'Stock Returns Ranked by Standard Deviation One Month')
        setStdevOneChart(true)
        setStdevOneData(stdevoneCharter)

        const stdevthreeCharter = factorCharter(periodicityResults?.data?.stdevthree?.values, periodicityResults?.data?.stdevthree?.buckets, 'Standard Deviation Three Month', 'Stock Returns Ranked by Standard Deviation Three Month')
        setStdevThreeChart(true)
        setStdevThreeData(stdevthreeCharter)

        const stdevsixCharter = factorCharter(periodicityResults?.data?.stdevsix?.values, periodicityResults?.data?.stdevsix?.buckets, 'Standard Deviation Six Month', 'Stock Returns Ranked by Standard Deviation Six Month')
        setStdevSixChart(true)
        setStdevSixData(stdevsixCharter)

        const stdevytdCharter = factorCharter(periodicityResults?.data?.stdevytd?.values, periodicityResults?.data?.stdevytd?.buckets, 'Standard Deviation YTD', 'Stock Returns Ranked by Standard Deviation YTD')
        setStdevYtdChart(true)
        setStdevYtdData(stdevytdCharter)

        const sectorsCharter = factorCharter(periodicityResults?.data?.sectors?.values, periodicityResults?.data?.sectors?.buckets, 'Sectors', 'Stock Returns Ranked by Sector')
        setSectorChart(true)
        setSectorData(sectorsCharter)
      } 
      
      
      
    }

    return (
        <React.Fragment>
            <section className="d-flex align-items-center dark-overlay">
            <Image
                src={`/images/homeImages/world.jpg`}
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
                    {`Fintank Factor Researh`}
                    </h1>
                    <p className="text-lg text-shadow mt-3">{`Stock And Factor Research Performance`}</p>
                </Col>
                </Row>
            </Container>
            </section>
            <section className="py-1 bg-gray-100">
              <Container>
                <div className="text-center pb-lg-4">
                  <p className="subtitle text-secondary">
                    {`Chart Equities With Ease Using our Technical Overlays`}
                  </p>
                  <h2 className="mb-3">{`The Fintank's Charting Platform`}</h2>
                </div>
                <Row>
                <Col
                    lg="3"
                    className="mb-1 mb-lg-0 text-center"
                  >
                    <div className="px-0 px-lg-3">
                      <div className="icon-rounded bg-primary-light mb-3">
                        <Icon
                          icon='earth-globe-1'
                          className="text-primary w-2rem h-2rem"
                        />
                      </div>
                      <h3 className="h5">Select Index</h3>
                      <p className="text-muted">The selected index will be divided into deciles or quartiles based on the number of stocks in the Index.</p>
                    </div>
                  </Col>
                  <Col
                    lg="6"
                    className="mb-1 mb-lg-0 text-center"
                  >
                    <div className="px-0 px-lg-3">
                      <div className="icon-rounded bg-primary-light mb-3">
                        <Icon
                          icon='time-1'
                          className="text-primary w-2rem h-2rem"
                        />
                      </div>
                      <h3 className="h5">Select A Frequency to Show for the Factors</h3>      
                      <p className="text-muted">The available frequencies include 1 Month, 3 Month, 6 Month and Year to Date returns. The performance of the stocks in the Index is divided based on select fundamental attributes. 
                      Stocks are sorted from highest to lowest based on the fundamental attributes presented, and the performance for a specific decile or quartile is computed. The stocks in each bucket are equal weighted.
                      The factor performance can help determine what stocks performed well over the selected frequency and what type of factor has been driving the markets.</p>
                    </div>
                  </Col>
                  <Col
                    lg="3"
                    className="mb-1 mb-lg-0 text-center"
                  >
                    <div className="px-0 px-lg-3">
                      <div className="icon-rounded bg-primary-light mb-3">
                        <Icon
                          icon='compass-1'
                          className="text-primary w-2rem h-2rem"
                        />
                      </div>
                      <h3 className="h5">Stocks Per Bucket</h3>
                      <p className="text-muted">Click on a specific factor to see the stocks in the buckets displayed. This is not advice about which stocks would outperform as the analysis is historical, but can help guide decisions as to what 
                      the market has been rewarding.</p>
                    </div>
                  </Col>
                </Row>
              </Container>
            </section>
            <Container fluid className="py-5 px-lg-5">
              <Row>
                <Col lg="2" className="pt-3">
                  <div className="mb-4">
                    <div className="filter-block">
                      <h6 className="mb-3">Select Index and Periodicity</h6>
                      <div className="mb-4">
                      <Form onSubmit={submitDecilePerformance}>
                        <Form.Label htmlFor="index">
                            Select Index
                        </Form.Label>
                        <div className="mb-4">
                        <Row>
                          <Col lg="12" className="pt-3">
                              <Select
                                name="index"
                                options={data.markets && data.markets}
                                value={indexLabel}
                                placeholder = {indexLabel}
                                onChange = {handleIndexSelection}
                                isSearchable
                                className="form-control dropdown bootstrap-select"
                                classNamePrefix="selectpicker"
                              />
                          </Col>
                        </Row>
                        </div>
                        <Form.Label htmlFor="index">
                            Select Periodicity
                        </Form.Label>
                        <div className="mb-4">
                        <Row>
                          <Col lg="12" className="pt-3">
                              <Select
                                name="periodicity"
                                options={data.factorPeriods && data.factorPeriods}
                                value={frequencyLabel}
                                placeholder = {frequencyLabel}
                                onChange = {handleFrequencySelection}
                                isSearchable
                                className="form-control dropdown bootstrap-select"
                                classNamePrefix="selectpicker"
                              />
                          </Col>
                        </Row>
                        </div>
                        <Row>
                          <Col lg="12" className="pt-3">
                          <Button
                              type="submit"
                              className={`h-100 ${
                                props.btnClassName ? props.btnClassName : ""
                              }`}
                            >
                              Show Performance
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg="9">
                  <Row>
                    {peChart &&
                    <Col lg='6'>
                      <ReactApexChart options={peData?.options} series={peData?.series} type="bar" height={450} />
                    </Col>
                    }
                    {psChart &&
                    <Col lg='6'>
                      <ReactApexChart options={psData?.options} series={psData?.series} type="bar" height={450} />
                    </Col>
                    }
                  </Row>
                  <Row>
                    {pbChart &&
                    <Col lg='6'>
                      <ReactApexChart options={pbData?.options} series={pbData?.series} type="bar" height={325} />
                    </Col>
                    }
                    {pcfChart &&
                    <Col lg='6'>
                      <ReactApexChart options={pcfData?.options} series={pcfData?.series} type="bar" height={325} />
                    </Col>
                    }
                  </Row>
                  <Row>
                    {divChart &&
                    <Col lg='6'>
                      <ReactApexChart options={divData?.options} series={divData?.series} type="bar" height={325} />
                    </Col>
                    }
                    {fcfChart &&
                    <Col lg='6'>
                      <ReactApexChart options={fcfData?.options} series={fcfData?.series} type="bar" height={325} />
                    </Col>
                    }
                  </Row>
                  <Row>
                    {deChart &&
                    <Col lg='6'>
                      <ReactApexChart options={deData?.options} series={deData?.series} type="bar" height={325} />
                    </Col>
                    }
                    {roeChart &&
                    <Col lg='6'>
                      <ReactApexChart options={roeData?.options} series={roeData?.series} type="bar" height={325} />
                    </Col>
                    }
                  </Row>
                  <Row>
                  {intCovChart &&
                    <Col lg='6'>
                      <ReactApexChart options={intCovData?.options} series={intCovData?.series} type="bar" height={325} />
                    </Col>
                    }
                    {cfdChart &&
                    <Col lg='6'>
                      <ReactApexChart options={cfdData?.options} series={cfdData?.series} type="bar" height={325} />
                    </Col>
                    }
                  </Row>
                  <Row>
                  {stdevOneChart &&
                    <Col lg='6'>
                      <ReactApexChart options={stdevOneData?.options} series={stdevOneData?.series} type="bar" height={325} />
                    </Col>
                    }
                    {stdevThreeChart &&
                    <Col lg='6'>
                      <ReactApexChart options={stdevThreeData?.options} series={stdevThreeData?.series} type="bar" height={325} />
                    </Col>
                    }
                  </Row>
                  <Row>
                  {stdevSixChart &&
                    <Col lg='6'>
                      <ReactApexChart options={stdevSixData?.options} series={stdevSixData?.series} type="bar" height={325} />
                    </Col>
                    }
                    {stdevYtdChart &&
                    <Col lg='6'>
                      <ReactApexChart options={stdevYtdData?.options} series={stdevYtdData?.series} type="bar" height={325} />
                    </Col>
                    }
                  </Row>
                  <Row>
                    {sectorChart &&
                    <Col lg='12'>
                      <ReactApexChart options={sectorData?.options} series={sectorData?.series} type="bar" height={400} />
                    </Col>
                    }
                  </Row>
                </Col>
              </Row>
            </Container>
        </React.Fragment>
    )
}


export default StockPerformances