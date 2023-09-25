import React, { useEffect, useState, useMemo, useContext } from "react";
import Link from "next/link";
import { idbPromise } from "@utils/helpers";
import "react-day-picker/dist/style.css";
import Select from "react-select"
import Swiper from "@components/Swiper"
import {Container,Row,Col,Form,Button, ToggleButton, Badge, Overlay} from "react-bootstrap";
import UseWindowSize from "@hooks/UseWindowSize";
import roomData from "@data/stock-research.json";
import blog from "@data/blog.json";
import indexMetaData from "@data/index-meta.json"
import SwiperGallery from "@components/SwiperGallery";
import Image from "@components/CustomImage";
import Gallery from "@components/Gallery";
import data from "@data/index.json"
import { useRouter } from "next/router";
import Map from "@components/Map";
import { DjangoAuthContext } from '@context/authContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons"
import axios from 'axios';
import { useIndexPerformance } from "@hooks/useIndexPerformance";
import swal from 'sweetalert';
import { isAuthenticatedUser } from '@utils/isAuthenticated';
import { useEquitySpreadCharter } from "@hooks/useEquitySpreadChart";
import { useCapitalMarketCharter } from "@hooks/useCapitalMarketsCharts";
import { useHomeIndex } from "@hooks/useHomeIndex"
import { useStockNames } from "@hooks/useStockNames"
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
import { Line, Bar, Scatter } from 'react-chartjs-2';
import { useIndexPagePrices } from "@hooks/useIndexPagePrices";

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

export const frequencies = [
  {
      "value":"Quarterly",
      "label":"Quarterly"
  },
  {
      "value":"Yearly",
      "label":"Yearly"
  },
  {
      "value":"Three Year",
      "label":"Three Year"
  }
]

export const indexLineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: false,
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

export async function getServerSideProps() {

  const URL = `${process.env.NEXT_PUBLIC_FINTANK_API_URL}/economic-data/`;
  const economicRequest = await fetcher(URL);
  const economicData = economicRequest.economic
  const equitySpreadData = economicRequest.equity_markets
  const tenYr = '10Y';
  const fiveYr = '5Y';
  const twoYr = '2Y';
  const thirtyYr = '30Y';
  const mlhy = 'MLHY';
  const twoVTen ='TWOVTEN';
  const fiveVTen = 'FIVEVTEN';
  const tenVThirty = 'TENVTHIRTY';
  const twoVFive = 'TWOVFIVE';
  const tenVMlhy = 'TENVMLHY';
  const cpi = 'CPI';
  const unemp = 'UNEMP';
  const nonFarm = 'NONFARM';
  const eafeVSC = 'EAFEVSC';
  const eafeVG = 'EAFEVG';
  const acwi = 'ACWI';
  const rOneVG = 'RONEVG';
  const russell2V1 = 'R2V1';
  const rmidVROne = 'RMIDV1';
  const russell2VMid = 'R2VMID';
  const russell2VG = 'R2VG';
  const spVNas = 'SPVNAS';
  const spVSPQ = 'SPVSPQ';
  const usFinVusTot = 'USFINVTOT';
  const usMatVusTot = 'USMATVTOT';
  const usHCVusTot = 'USHCVTOT';
  const usCSVusTot = 'USCSVTOT';
  const usCDVusTot = 'USCDVTOT';
  const usIndVusTot = 'USINDVTOT';
  const tsxVSci = 'TSXVSCI';
  const tsxVMin = 'TSXMINVCOMP';
  const tsxVBank = 'TSXBANKVCOMP';
  const spTsx = 'USCAN';


  
  return {
    props: {
      nav: {
        light: true,
        classes: "shadow",
        color: "white",
      },
      title: "Fintank",
      data,
      economicData,
      equitySpreadData,
      tenYr,fiveYr,twoYr,thirtyYr,mlhy,twoVTen,fiveVTen,tenVThirty,
      twoVFive,tenVMlhy,cpi,unemp,nonFarm,
      eafeVSC,eafeVG,acwi,spTsx,
      rOneVG,russell2V1,rmidVROne,russell2VMid,russell2VG,
      spVNas,spVSPQ,
      usFinVusTot,usMatVusTot,usHCVusTot,
      usCSVusTot,usCDVusTot,usIndVusTot,
      tsxVSci,
      tsxVMin, 
      tsxVBank
    },
  }
}

const CapitalMarketIndicators = (props) =>{
  const router = useRouter();
  const indexData = useHomeIndex();
  const economicData = props.economicData;
  const equitySpreadData = props.equitySpreadData;
  const [roneTwofrequency, setRoneTwoFrequency] = useState(frequencies[0].value)
  const [roneMidfrequency, setRoneMidFrequency] = useState(frequencies[0].value)
  const [rtwoMidfrequency, setRtwoMidFrequency] = useState(frequencies[0].value)
  const [roneVGfrequency, setRoneVGFrequency] = useState(frequencies[0].value)
  const [rtwoVGfrequency, setRtwoVGFrequency] = useState(frequencies[0].value)
  const [spNasfrequency, setSpNasFrequency] = useState(frequencies[0].value)
  const [spQfrequency, setSpQFrequency] = useState(frequencies[0].value)
  const [usTotVCDfrequency, setUsTotVCDFrequency] = useState(frequencies[0].value)
  const [usTotVCSfrequency, setUsTotVCSFrequency] = useState(frequencies[0].value)
  const [usTotVHCfrequency, setUsTotVHCFrequency] = useState(frequencies[0].value)
  const [usTotVFinfrequency, setUsTotVFinFrequency] = useState(frequencies[0].value)
  const [usTotVMatfrequency, setUsTotVMatFrequency] = useState(frequencies[0].value)
  const [usTotVIndfrequency, setUsTotVIndFrequency] = useState(frequencies[0].value)
  const [tsxVSCIfrequency, setTsxVSCIFrequency] = useState(frequencies[0].value)
  const [tsxVMinfrequency, setTsxVMinFrequency] = useState(frequencies[0].value)
  const [tsxVBankfrequency, setTsxVBankFrequency] = useState(frequencies[0].value)
  const [acwifrequency, setAcwiFrequency] = useState(frequencies[0].value)
  const [eafefrequency, setEafeFrequency] = useState(frequencies[0].value)
  const [eafeVGfrequency, setEafeVGFrequency] = useState(frequencies[0].value)
  const [spTSXfrequency, setSpTSXFrequency] = useState(frequencies[0].value)


  const {indexChartCreated:tenYrChartCreated, createIndexChart:tenYrChart, indexName:tenYearName} = useCapitalMarketCharter(props.tenYr, economicData?.ten?.dates, economicData?.ten?.value)
  const {indexChartCreated:fiveYrChartCreated, createIndexChart:fiveYrChart, indexName:fiveYearName} = useCapitalMarketCharter(props.fiveYr, economicData?.five?.dates, economicData?.five?.value)
  const {indexChartCreated:twoYrChartCreated, createIndexChart:twoYrChart, indexName:twoYearName} = useCapitalMarketCharter(props.twoYr, economicData?.two?.dates, economicData?.two?.value)
  const {indexChartCreated:thirtyYrChartCreated, createIndexChart:thirtyYrChart, indexName:thirtyYearName} = useCapitalMarketCharter(props.thirtyYr, economicData?.thirty?.dates, economicData?.thirty?.value)
  const {indexChartCreated:mlhyChartCreated, createIndexChart:mlhyChart, indexName:mlhyName} = useCapitalMarketCharter(props.mlhy, economicData?.high_yield?.dates, economicData?.high_yield?.value)
  const {indexChartCreated:tenVTwoChartCreated, createIndexChart:tenVTwoChart, indexName:tenVTwoName} = useCapitalMarketCharter(props.twoVTen, economicData?.tenvtwo?.dates, economicData?.tenvtwo?.value)
  const {indexChartCreated:tenVFiveChartCreated, createIndexChart:tenVFiveChart, indexName:tenVFiveName} = useCapitalMarketCharter(props.fiveVTen, economicData?.fivevten?.dates, economicData?.fivevten?.value)
  const {indexChartCreated:tenVThirtyChartCreated, createIndexChart:tenVThirtyChart, indexName:tenVThirtyName} = useCapitalMarketCharter(props.tenVThirty, economicData?.thirtyvten?.dates, economicData?.thirtyvten?.value)
  const {indexChartCreated:fiveVTwoChartCreated, createIndexChart:fiveVTwoChart, indexName:fiveVTwoName} = useCapitalMarketCharter(props.twoVFive, economicData?.fivevtwo?.dates, economicData?.fivevtwo?.value)
  const {indexChartCreated:highyieldSpreadChartCreated, createIndexChart:highyieldSpreadChart, indexName:highyieldSpreadName} = useCapitalMarketCharter(props.tenVMlhy, economicData?.highyield?.dates, economicData?.highyield?.value)
  const {indexChartCreated:cpiChartCreated, createIndexChart:cpiChart, indexName:cpiName} = useCapitalMarketCharter(props.cpi, economicData?.cpi?.dates, economicData?.cpi?.value)
  const {indexChartCreated:unempChartCreated, createIndexChart:unempChart, indexName:unempName} = useCapitalMarketCharter(props.unemp, economicData?.unemp?.dates, economicData?.unemp?.value)
  const {indexChartCreated:nonFarmChartCreated, createIndexChart:nonFarmChart, indexName:nonFarmName} = useCapitalMarketCharter(props.nonFarm, economicData?.nonfarm?.dates, economicData?.nonfarm?.value)
  const {indexChartCreated:roneVRTwoChartCreated, createIndexChart:roneVRTwoChart, indexName:roneVRTwoName} = useEquitySpreadCharter(props.russell2V1, equitySpreadData?.rone_v_rtwo_pack, roneTwofrequency)
  const {indexChartCreated:roneVRMidChartCreated, createIndexChart:roneVRMidChart, indexName:roneVRMidName} = useEquitySpreadCharter(props.rmidVROne, equitySpreadData?.rone_rmid_pack, roneMidfrequency)
  const {indexChartCreated:rtwoVRMidChartCreated, createIndexChart:rtwoVRMidChart, indexName:rtwoVRMidName} = useEquitySpreadCharter(props.russell2VMid, equitySpreadData?.rtwo_rmid_pack, rtwoMidfrequency)
  const {indexChartCreated:roneVGChartCreated, createIndexChart:roneVGChart, indexName:roneVGName} = useEquitySpreadCharter(props.rOneVG, equitySpreadData?.ronev_v_roneg_pack, roneVGfrequency)
  const {indexChartCreated:rtwoVGChartCreated, createIndexChart:rtwoVGChart, indexName:rtwoVGName} = useEquitySpreadCharter(props.russell2VG, equitySpreadData?.rtwov_v_rtwog_pack, rtwoVGfrequency)
  const {indexChartCreated:sp5VNasChartCreated, createIndexChart:sp5VNasChart, indexName:sp5VNasName} = useEquitySpreadCharter(props.spVNas, equitySpreadData?.sp500_v_nasd_pack, spNasfrequency)
  const {indexChartCreated:sp5VQChartCreated, createIndexChart:sp5VQChart, indexName:sp5VQName} = useEquitySpreadCharter(props.spVSPQ, equitySpreadData?.sp500_v_sp500q_pack, spQfrequency)
  const {indexChartCreated:usTotVCDChartCreated, createIndexChart:usTotVCDChart, indexName:usTotVCDName} = useEquitySpreadCharter(props.usCDVusTot, equitySpreadData?.ustot_v_uscd_pack, usTotVCDfrequency)
  const {indexChartCreated:usTotVCSChartCreated, createIndexChart:usTotVCSChart, indexName:usTotVCSName} = useEquitySpreadCharter(props.usCSVusTot, equitySpreadData?.ustot_v_uscs_pack, usTotVCSfrequency)
  const {indexChartCreated:usTotVHCChartCreated, createIndexChart:usTotVHCChart, indexName:usTotVHCName} = useEquitySpreadCharter(props.usHCVusTot, equitySpreadData?.ustot_v_ushc_pack, usTotVHCfrequency)
  const {indexChartCreated:usTotVFinChartCreated, createIndexChart:usTotVFinChart, indexName:usTotVFinName} = useEquitySpreadCharter(props.usFinVusTot, equitySpreadData?.ustot_v_usfin_pack, usTotVFinfrequency)
  const {indexChartCreated:usTotVMatChartCreated, createIndexChart:usTotVMatChart, indexName:usTotVMatName} = useEquitySpreadCharter(props.usMatVusTot, equitySpreadData?.ustot_v_usmat_pack, usTotVMatfrequency)
  const {indexChartCreated:usTotVIndChartCreated, createIndexChart:usTotVIndChart, indexName:usTotVIndName} = useEquitySpreadCharter(props.usIndVusTot, equitySpreadData?.ustot_v_usind_pack, usTotVIndfrequency)
  const {indexChartCreated:spTsxChartCreated, createIndexChart:spTsxChart, indexName:spTsxName} = useEquitySpreadCharter(props.spTsx, equitySpreadData?.sptsxpack, spTSXfrequency)
  const {indexChartCreated:tsxVSCIChartCreated, createIndexChart:tsxVSCIChart, indexName:tsxVSCIName} = useEquitySpreadCharter(props.tsxVSci, equitySpreadData?.tsx_v_tsxsci_pack, tsxVSCIfrequency)
  const {indexChartCreated:tsxVMinChartCreated, createIndexChart:tsxVMinChart, indexName:tsxVMinName} = useEquitySpreadCharter(props.tsxVMin, equitySpreadData?.tsx_v_tsxmin_pack, tsxVMinfrequency)
  const {indexChartCreated:tsxVBankChartCreated, createIndexChart:tsxVBankChart, indexName:tsxVBankName} = useEquitySpreadCharter(props.tsxVBank, equitySpreadData?.tsx_v_tsxbank_pack, tsxVBankfrequency)
  const {indexChartCreated:acwiVExUSChartCreated, createIndexChart:acwiVExUSChart, indexName:acwiVExUSName} = useEquitySpreadCharter(props.acwi, equitySpreadData?.acwi_v_acwiexus_pack, acwifrequency)
  const {indexChartCreated:eafeVEafeSCChartCreated, createIndexChart:eafeVEafeSCChart, indexName:eafeVEafeSCName} = useEquitySpreadCharter(props.eafeVSC, equitySpreadData?.eafe_v_eafesc_pack, eafefrequency)
  const {indexChartCreated:eafeVGChartCreated, createIndexChart:eafeVGChart, indexName:eafeVGName} = useEquitySpreadCharter(props.eafeVG, equitySpreadData?.eafev_v_eafeg_pack, eafeVGfrequency)



  const {data:stockNames} = useStockNames();
  const allStocks = stockNames?.stocks;

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
                    {`Capital Market Indicators`}
                  </h1>
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
                perView={1}
                md={2}
                lg={3}
                xl={4}
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
      <section className="py-0 bg-gray-100">
      <Container>
      <Row className="pt-3">
            <Col lg="12">
            <div className="text-block">
                <h3 className="mb-3">Treasury Yields and Yield Spreads</h3>
                <p className="text-muted fw-light">
                  {`Treasury yields of various maturities serve as indicators of market sentiment, inflation expectations, and economic outlooks. Investors, policymakers, 
                  and economists closely monitor these yields to gauge the health and direction of 
                  the economy and to make informed decisions about investments, lending rates, and monetary policy.`}
                </p>
            </div>
            </Col>
          </Row>
        {(tenYrChartCreated && twoYrChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
                <div>
                  <h3 className="mb-3">10 Year Trasury Yield</h3>
                  <p className="text-muted fw-light">
                      {`The ten-year Treasury yield represents the interest rate on the U.S. government's ten-year debt obligations.
                      It is often used as a benchmark for long-term interest rates in the broader economy.
                      A rising ten-year yield can indicate expectations of higher inflation or stronger economic growth, potentially impacting mortgage rates and borrowing costs.
                      Conversely, a falling ten-year yield may suggest economic concerns or expectations of lower inflation.`}
                    {" "}
                  </p>
                </div>
                <Line options={indexLineOptions} data={tenYrChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">2 Year Trasury Yield</h3>
                  <p className="text-muted fw-light">
                      {`The two-year Treasury yield represents the interest rate on two-year government bonds.
                        It is closely watched by investors and economists for its sensitivity to short-term monetary policy changes made by central banks, 
                        such as the Federal Reserve in the U.S. A rising two-year yield may suggest expectations of tightening monetary policy 
                        (higher interest rates), while a falling yield may indicate expectations of policy easing (lower interest rates).`}
                    {" "}
                  </p>
                </div>
                <Line options={indexLineOptions} data={twoYrChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(thirtyYrChartCreated && fiveYrChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">30 Year Trasury Yield</h3>
                  <p className="text-muted fw-light">
                      {`The thirty-year Treasury yield reflects the interest rate on U.S. government bonds with a thirty-year maturity.
                        It is a long-term benchmark that can provide insights into long-term inflation and growth expectations.
                        Typically, a rising thirty-year yield may indicate concerns about future inflation, while a falling yield may reflect 
                        expectations of subdued inflation or economic uncertainty.`}
                    {" "}
                  </p>
                </div>
                <Line options={indexLineOptions} data={thirtyYrChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">5 Year Trasury Yield</h3>
                  <p className="text-muted fw-light">
                      {`The five-year Treasury yield reflects the interest rate on government bonds with a five-year maturity.
                        It is considered an intermediate-term interest rate and can offer insights into market sentiment about the medium-term economic outlook.
                        Changes in the five-year yield can signal shifts in market expectations for economic growth and inflation over the next few years.`}
                    {" "}
                  </p>
                </div>
                <Line options={indexLineOptions} data={fiveYrChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(mlhyChartCreated && tenVTwoChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">High Yield Bond Index</h3>
                  <p className="text-muted fw-light">
                      {`The high yield bond index is a composite index that measures the performance of bonds issued by companies with lower credit ratings, 
                        typically below investment-grade (BBB- or lower). These bonds are considered riskier than investment-grade bonds because they have a higher likelihood of default, 
                        which is why they are often referred to as "junk" bonds. The index provides insights into the performance of the high-yield bond market, including changes in the yields and prices of these bonds.
                        Investors use the high yield bond index as a gauge of risk appetite in the financial markets. When investors are more willing to take on risk, they may invest in high-yield bonds, pushing up their prices and lowering their yields.
                        Conversely, when economic or financial uncertainty increases, investors may sell high-yield bonds, causing their prices to fall and their yields to rise, reflecting a flight to safer assets.
                        Changes in the high yield bond index can also provide insights into broader economic conditions. When the index shows improving performance, it may suggest 
                        optimism about economic growth, while deteriorating performance may indicate concerns about economic stability.`}
                    {" "}
                  </p>
                </div>
                <Line options={indexLineOptions} data={mlhyChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">10-2 Yield Spread</h3>
                  <p className="text-muted fw-light">
                      {`The 10-2 yield spread represents the difference in interest rates between the ten-year U.S. Treasury bond yield and the two-year U.S. Treasury bond yield.
                          It is closely monitored by investors, economists, and policymakers as a measure of the yield curve's slope, which is the term structure of interest rates.
                          A positive 10-2 yield spread occurs when the ten-year yield is higher than the two-year yield. 
                          This is typically the normal state of the yield curve and reflects the expectation of a healthy, growing economy with inflation expectations.
                          A narrowing or flattening 10-2 yield spread can signal concerns about economic growth and potential future economic slowdown. 
                          It may also indicate expectations of a shift in monetary policy towards lower interest rates.
                          Conversely, an inverted 10-2 yield spread, where the two-year yield is higher than the ten-year yield, 
                          is seen as a strong warning signal. Historically, yield curve inversions have often preceded economic recessions, making it a closely watched indicator for predicting economic downturns.
                          The 10-2 yield spread is seen as a barometer of market sentiment and expectations for the future. 
                          A steepening yield spread can suggest optimism about the economy, while a flattening or inverted spread can raise concerns about economic stability.`}
                    {" "}
                  </p>
                </div>
                <Line options={indexLineOptions} data={tenVTwoChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(tenVFiveChartCreated && tenVThirtyChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">10-5 Yield Spread</h3>
                  <p className="text-muted fw-light">
                      {`Economic Growth Expectations: The 5-10 yield spread reflects market expectations for economic growth, with a wider spread indicating 
                      optimism about the long-term economic outlook. Yield Curve Shape: It contributes to the shape of the yield curve, typically resulting in a positively sloped curve in healthy economic conditions.
                        Inversion Warning: A significant narrowing or inversion of the spread can be a precursor to economic recessions, as it suggests concerns about 
                        the immediate economic future. Monetary Policy Influence: Central banks use the yield spread to gauge market sentiment and adjust their monetary policies accordingly.
                        Market Sentiment: The spread reflects investor sentiment and risk appetite, with a widening spread signaling confidence and a 
                        narrowing spread indicating uncertainty or risk aversion.`}
                    {" "}
                  </p>
                </div>
                <Line options={indexLineOptions} data={tenVFiveChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">10-30 Yield Spread</h3>
                  <p className="text-muted fw-light">
                      {`Interest Rate Differential: The spread between the ten-year and thirty-year yield represents the difference in interest rates between 
                      relatively short-term and long-term government bonds or Treasury securities.
                        Economic Growth and Inflation: A widening spread often indicates expectations of robust economic growth and potential inflation, 
                        as long-term rates (thirty-year) tend to be higher when investors anticipate higher future inflation and stronger economic conditions.
                        Yield Curve's Long End: This spread helps shape the long end of the yield curve. A steepening yield curve, with the thirty-year yield 
                        significantly higher than the ten-year yield, can signal economic optimism and investment in longer-term assets.
                        Monetary Policy Implications: Central banks closely watch the spread to understand market sentiment and tailor their
                         monetary policies accordingly, especially when considering long-term economic stability.
                        Mortgage Rates: Changes in this spread can also influence long-term borrowing costs, particularly for mortgages, impacting the housing market and consumer spending.
                        Risk and Market Sentiment: A narrowing spread may suggest investors' concerns about the long-term economic outlook, while a widening spread may indicate
                        confidence in future economic prospects and willingness to invest in longer-duration assets.`}
                    {" "}
                  </p>
                </div>
                <Line options={indexLineOptions} data={tenVThirtyChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(fiveVTwoChartCreated && highyieldSpreadChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">5-2 Yield Spread</h3>
                  <p className="text-muted fw-light">
                      {`Economic Outlook: The spread between the five-year and two-year yield reflects the difference in interest rates between short-term and 
                      intermediate-term government bonds or Treasury securities.
                      Growth Expectations: A widening spread often indicates optimism about the economy's future performance, as investors demand higher yields for 
                      longer-term investments, expecting improved economic conditions and potential inflation.
                      Yield Curve Segment: It contributes to shaping the yield curve's shorter end, influencing short- to medium-term borrowing and lending rates in the economy.
                      Monetary Policy Insight: Central banks monitor this spread to assess market sentiment and 
                      potential implications for monetary policy decisions, especially regarding interest rate adjustments.
                      Borrowing Costs: Changes in this spread can affect borrowing costs for consumers and businesses, impacting spending and investment decisions.
                      Risk Indicator: A narrowing spread may signal caution among investors about the near-term economic outlook, while a widening spread may signify 
                      confidence in the medium-term economic prospects and willingness to invest in slightly longer-duration assets.`}
                    {" "}
                  </p>
                </div>
                <Line options={indexLineOptions} data={fiveVTwoChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">10-High Yield Yield Spread</h3>
                  <p className="text-muted fw-light">
                      {`Spread Significance: The spread represents the difference in yields between relatively safer ten-year U.S. Treasury bonds 
                      and riskier high-yield corporate bonds. A wider spread indicates a greater compensation investors 
                      require for holding higher-risk assets, reflecting their concerns about default risk and economic uncertainty.
                      Risk Sentiment: When the spread widens, it often signals a risk-off sentiment in the market, 
                      suggesting that investors are demanding a higher premium for taking on the added risk associated with high-yield bonds. 
                      This can occur during periods of economic instability, market volatility, or credit concerns.
                      Economic Outlook: A narrowing spread can be interpreted as a signal of improving economic 
                      conditions and reduced credit risk. It indicates that investors are more confident about the outlook for corporate bonds, 
                      potentially signaling stronger economic growth and lower default expectations.
                      Policy Implications: Central banks, like the Federal Reserve, may monitor this spread as it can influence their monetary policy decisions. 
                      A widening spread may prompt central banks to consider measures to stimulate economic activity, while a narrowing spread may suggest less need for such measures.
                      Investor Behavior: Investors often use the spread between 
                      Treasury yields and high yield bond yields as a gauge for their asset allocation decisions.
                      A wider spread may make high yield bonds more attractive for those seeking higher yields but willing to accept higher risk, 
                      while a narrower spread may prompt some investors to shift toward safer assets.`}
                    {" "}
                  </p>
                </div>
                <Line options={indexLineOptions} data={highyieldSpreadChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(cpiChartCreated && unempChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">CPI Year over Year</h3>
                  <p className="text-muted fw-light">
                      {`The Consumer Price Index (CPI) holds immense significance as a key economic indicator, serving as a 
                      barometer of inflationary trends in an economy. It measures the average change over time in the prices 
                      paid by urban consumers for a market basket of goods and services, offering critical insights into the purchasing power of consumers, 
                      cost of living adjustments, and the broader health of the economy. Policymakers, businesses, 
                      and investors rely on CPI data to make informed decisions, formulate monetary and fiscal policies, and assess the potential 
                      impact on financial markets, interest rates, and consumer behavior, making it a vital tool for economic analysis and policy planning.`}
                    {" "}
                  </p>
                </div>
                <Line options={indexLineOptions} data={cpiChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">Unemployment Change</h3>
                  <p className="text-muted fw-light">
                      {`Unemployment readings are of paramount importance in assessing the overall health and resilience of an economy. 
                      These readings, typically represented by the unemployment rate, reveal the percentage of the labor force actively seeking 
                      employment but unable to find jobs. They offer crucial insights into the labor market's strength, job availability, and economic stability. 
                      Economists, policymakers, and businesses closely monitor unemployment data to gauge the level of economic activity, 
                      anticipate shifts in consumer spending, and plan workforce strategies. High unemployment rates may indicate economic distress 
                      and reduced consumer spending, while low rates can signify a robust job market and potential inflationary pressures. 
                      Consequently, unemployment readings are a vital tool for understanding the economic landscape and formulating targeted policies to address labor market challenges.`}
                    {" "}
                  </p>
                </div>
                <Line options={indexLineOptions} data={unempChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(nonFarmChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">Non Farm Payroll</h3>
                  <p className="text-muted fw-light">
                      {`Nonfarm payroll data is a pivotal economic indicator that provides a snapshot of job growth or loss in the U.S. economy, 
                      excluding employment in the agricultural sector. It encompasses a wide range of industries, such as manufacturing, construction, 
                      healthcare, and services, making it a comprehensive gauge of employment trends. Nonfarm payroll figures, typically released monthly, 
                      are closely watched by economists, investors, and policymakers for their ability to reveal the state of the labor market. 
                      Significant deviations from expectations can influence financial markets, interest rates, and economic forecasts, 
                      as they shed light on economic conditions and may impact consumer spending, business investment, and government policies. 
                      Consequently, nonfarm payroll data serves as a critical tool for assessing economic vitality and making informed decisions across various sectors of the economy.`}
                    {" "}
                  </p>
                </div>
                <Line options={indexLineOptions} data={nonFarmChart} height={100} width={200}/>
              </Col>
            </Row>
          }
        </Container>
      </section>
      <section className="py-0 bg-gray-100">
      <Container>
      <Row className="pt-3">
            <Col lg="12">
            <div className="text-block">
                <h3 className="mb-3">Index Cap and Style Spread Charts</h3>
                <p className="text-muted fw-light">
                  {`Spread between Large, Small and Mid Cap as well as Style Spreads including Value and Growth.`}
                </p>
            </div>
            </Col>
          </Row>
        {(roneVRTwoChartCreated && roneVRMidChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
                <div>
                  <h3 className="mb-3">Russell 1000 Versus Russell 2000 (R2000-R1000)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the Russell 1000 and the Russell 2000 serves as a valuable indicator of relative performance between large-cap and 
                      small-cap stocks in the U.S. equity market. A widening spread, with the Russell 1000 outpacing the Russell 2000, 
                      can signal investor preference for larger, more established companies, often associated with a risk-averse sentiment or 
                      expectations of slower economic growth. Conversely, a narrowing spread, with the Russell 2000 outperforming, may reflect 
                      a risk-on sentiment, suggesting investors are more willing to embrace smaller companies 
                      and potentially anticipate stronger economic growth. This spread helps gauge market sentiment and sector rotation dynamics.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={roneTwofrequency}
                    placeholder = {roneTwofrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setRoneTwoFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={roneVRTwoChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">Russell 1000 Versus Russell Mid Cap (R1000-RMID)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the Russell 1000 and the Russell Mid Cap provides insights into the performance of large-cap stocks 
                      versus mid-cap stocks in the U.S. equity market. A widening spread, with the Russell 1000 outperforming the Russell Mid Cap, 
                      may indicate investor preference for larger, more established companies, potentially reflecting risk-averse sentiment or economic 
                      uncertainty. Conversely, a narrowing spread, with the Russell Mid Cap outperforming, may signal a risk-on sentiment, 
                      suggesting investors are favoring mid-sized companies and potentially anticipating stronger economic growth. 
                      This spread offers a glimpse into market sentiment and sector rotation dynamics within the mid to large-cap range.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={roneMidfrequency}
                    placeholder = {roneMidfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setRoneMidFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={roneVRMidChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(rtwoVRMidChartCreated && roneVGChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">Russell 2000 Versus Russell Mid Cap (R2000-RMID)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the Russell 2000 and the Russell Mid Cap provides valuable insights into the performance of small-cap 
                      stocks versus mid-cap stocks in the U.S. equity market. A widening spread, with the Russell 2000 outperforming the Russell Mid Cap, 
                      often indicates investor preference for smaller, more agile companies, potentially reflecting an appetite for higher risk 
                      and a belief in robust economic growth. Conversely, a narrowing spread, with the Russell Mid Cap outperforming, 
                      may suggest a more cautious market sentiment, where investors are favoring mid-sized companies perceived as relatively stable. 
                      This spread helps assess market sentiment and sector rotation dynamics within the mid to small-cap range and can offer clues about risk appetite and economic outlook.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={rtwoMidfrequency}
                    placeholder = {rtwoMidfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setRtwoMidFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={rtwoVRMidChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">Russell 1000 Value Versus Russell 1000 Growth (R1VAL-R1GRO)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the Russell 1000 Value Index and the Russell 1000 Growth Index provides insights into the performance of 
                      value-oriented versus growth-oriented stocks in the U.S. equity market. A widening spread, with the Russell 1000 Value Index 
                      outperforming the Growth Index, often indicates investor preference for mature, dividend-paying companies with attractive valuations. 
                      This can be seen as a sign of value-seeking behavior and a more conservative approach. Conversely, a narrowing spread, with the 
                      Russell 1000 Growth Index outperforming, may suggest investors are leaning towards companies with higher growth potential, 
                      even if they carry higher valuations. This spread helps gauge market sentiment 
                      and sector rotation dynamics within the large-cap segment, offering insights into investors' risk preferences and views on the economy.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={roneVGfrequency}
                    placeholder = {roneVGfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setRoneVGFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={roneVGChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(rtwoVGChartCreated && sp5VNasChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">Russell 2000 Value Versus Russell 2000 Growth (R2VAL-R2GRO)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the Russell 2000 Value Index and the Russell 2000 Growth Index offers insights into the performance of 
                      value-oriented small-cap stocks versus growth-oriented small-cap stocks in the U.S. equity market. A widening spread, with the 
                      Russell 2000 Value Index outperforming the Growth Index, often indicates investor preference for smaller companies with solid
                       fundamentals and lower valuations, reflecting a value-oriented strategy. Conversely, a narrowing spread, with the 
                       Russell 2000 Growth Index outperforming, may suggest a market sentiment favoring smaller companies with higher growth potential, 
                       even if they come with higher valuations. This spread helps assess investor sentiment 
                      and sector rotation dynamics within the small-cap segment, shedding light on risk preferences and economic outlook among investors. 
                      Indices represented by the ETF's that track their performance.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={rtwoVGfrequency}
                    placeholder = {rtwoVGfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setRtwoVGFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={rtwoVGChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">S&P 500 Versus the NASDAQ Composite (NASD-SP500)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the S&P 500 Index and the Nasdaq Composite Index provides valuable insights into the performance of 
                      two prominent U.S. equity benchmarks. A widening spread, with the S&P 500 outperforming the Nasdaq, often signifies 
                      investor preference for a more diversified mix of large-cap companies across various sectors, reflecting a balanced approach 
                      to equity investments. Conversely, a narrowing spread, with the Nasdaq outperforming, may indicate investor appetite for 
                      technology-focused and high-growth companies, potentially signaling a risk-on sentiment and optimism about the tech sector. 
                      This spread helps gauge market sentiment and sector rotation dynamics 
                      within the U.S. equity market, offering insights into investor preferences, risk appetite, and economic outlook.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={spNasfrequency}
                    placeholder = {spNasfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setSpNasFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={sp5VNasChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(sp5VQChartCreated && usTotVCDChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">S&P 500 Versus S&P 500 Quality (SPQUAL-SP500)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the S&P 500 Index and the S&P 500 Quality Index offers insights into the performance of the broader 
                      market compared to a subset of high-quality companies within the S&P 500. A widening spread, with the S&P 500 outperforming 
                      the Quality Index, often suggests that investors are favoring a more diversified approach, which may include companies of 
                      varying quality levels. Conversely, a narrowing spread, with the Quality Index outperforming, may indicate that investors 
                      are seeking out higher-quality, more stable companies within the S&P 500, potentially reflecting a risk-averse sentiment 
                      or concerns about economic stability. This spread helps assess market sentiment and sector rotation dynamics, revealing investor 
                      preferences for quality versus broader market exposure and offering insights into risk appetite and economic outlook.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={spQfrequency}
                    placeholder = {spQfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setSpQFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={sp5VQChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">US Total Market Versus US Consumer Discretionary (USCD-USTOT)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the US Total Market Index and the US Consumer Discretionary Index provides insights into 
                        the performance of the entire U.S. stock market compared to a specific sector focused on consumer discretionary goods and services. 
                        A widening spread, with the US Total Market outperforming the Consumer Discretionary Index, typically indicates that investors are 
                        favoring a more diversified approach, including sectors beyond consumer discretionary. Conversely, a narrowing spread, with the 
                        Consumer Discretionary Index outperforming, may signal that investors are increasingly interested in consumer-oriented companies, 
                        suggesting optimism about consumer spending and economic growth. This spread helps gauge market sentiment 
                        and sector-specific dynamics, offering insights into investor preferences, economic outlook, and consumer-related trends.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={usTotVCDfrequency}
                    placeholder = {usTotVCDfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setUsTotVCDFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={usTotVCDChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(usTotVCSChartCreated && usTotVHCChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">US Total Market Versus US Consumer Staples (USCS-USTOT)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the US Total Market Index and the US Consumer Staples Index provides insights into the performance of the entire 
                      U.S. stock market compared to a specific sector focused on consumer staples, which includes essential, non-cyclical goods like food, 
                      beverages, and household products. A widening spread, with the US Total Market outperforming the Consumer Staples Index, 
                      often indicates that investors are favoring a broader market exposure, potentially signaling confidence in economic growth 
                      and a willingness to take on more risk. Conversely, a narrowing spread, with the Consumer Staples Index outperforming, 
                      may suggest that investors are seeking defensive, recession-resistant assets, reflecting a more risk-averse sentiment 
                      or concerns about economic stability. This spread helps assess market sentiment, sector rotation dynamics, and investor preferences regarding risk and economic conditions.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={usTotVCSfrequency}
                    placeholder = {usTotVCSfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setUsTotVCSFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={usTotVCSChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">US Total Market Versus US Health Care (USHC-USTOT)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the US Total Market Index and the US Health Care Index offers insights into the performance of the overall 
                      U.S. stock market in comparison to a specific sector focused on healthcare-related companies. A widening spread, 
                      with the US Total Market outperforming the Health Care Index, often suggests that investors are favoring a more diversified approach, 
                      potentially indicating confidence in various sectors beyond healthcare. Conversely, a narrowing spread, 
                      with the Health Care Index outperforming, may indicate a preference for healthcare stocks, 
                      reflecting investor confidence in the resilience of the healthcare sector, regardless of broader market conditions. This spread 
                      helps assess market sentiment and sector-specific dynamics, offering insights into investor preferences, healthcare trends, and risk appetite.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={usTotVHCfrequency}
                    placeholder = {usTotVHCfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setUsTotVHCFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={usTotVHCChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(usTotVFinChartCreated && usTotVMatChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">US Total Market Versus US Financials (USFIN-USTOT)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the US Total Market Index and the US Financials Index provides insights into the performance of the overall 
                      U.S. stock market compared to a specific sector focused on financial companies. A widening spread, with the 
                      US Total Market outperforming the Financials Index, often indicates that investors are favoring a more diversified approach, 
                      potentially signaling confidence in various sectors beyond financials. Conversely, a narrowing spread, with the Financials Index 
                      outperforming, may suggest a preference for financial companies, reflecting investor optimism about the health of the financial sector, 
                      interest rate trends, and economic conditions. This spread helps assess market sentiment and sector-specific dynamics, offering insights 
                      into investor preferences, financial sector trends, and expectations for economic factors like interest rates and banking activities.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={usTotVFinfrequency}
                    placeholder = {usTotVFinfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setUsTotVFinFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={usTotVFinChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">US Total Market Versus US Basic Materials (USMAT-USTOT)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the US Total Market Index and the US Basic Materials Index provides insights into the performance of the overall 
                      U.S. stock market compared to a specific sector focused on basic materials companies. A widening spread, 
                      with the US Total Market outperforming the Basic Materials Index, often indicates that investors are favoring a more diversified approach, 
                      potentially signaling confidence in various sectors beyond basic materials. Conversely, a narrowing spread, 
                      with the Basic Materials Index outperforming, may suggest a preference for companies in the basic materials sector, 
                      reflecting investor optimism about economic growth and infrastructure development. 
                      This spread helps assess market sentiment and sector-specific dynamics, 
                      offering insights into investor preferences, trends in the basic materials sector, and economic outlook.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={usTotVMatfrequency}
                    placeholder = {usTotVMatfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setUsTotVMatFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={usTotVMatChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(usTotVIndChartCreated && spTsxChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">US Total Market Versus US Industrials (USIND-USTOT)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the US Total Market Index and the US Industrials Index provides insights into the performance of the overall 
                      U.S. stock market compared to a specific sector focused on industrial companies. A widening spread, with the US Total Market 
                      outperforming the Industrials Index, often indicates that investors are favoring a more diversified approach, potentially 
                      signaling confidence in various sectors beyond industrials. Conversely, a narrowing spread, with the Industrials Index outperforming, 
                      may suggest a preference for companies in the industrial sector, reflecting investor optimism about economic growth, manufacturing, 
                      and infrastructure development. This spread helps assess market sentiment and sector-specific dynamics, 
                      offering insights into investor preferences, trends in the industrial sector, and economic outlook, particularly in terms of manufacturing and infrastructure investment.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={usTotVIndfrequency}
                    placeholder = {usTotVIndfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setUsTotVIndFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={usTotVIndChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">S&P 500 Versus the S&P/TSX Composite (TSX-SP500)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the S&P 500 Index and the S&P/TSX Index provides insights into the relative performance of the 
                      U.S. and Canadian equity markets. A widening spread, with the S&P 500 outperforming the S&P/TSX, 
                      often suggests that investors are favoring U.S. equities, potentially reflecting confidence in the U.S. economy, 
                      a stronger U.S. dollar, or sector-specific dynamics within the S&P 500. Conversely, a narrowing spread, 
                      with the S&P/TSX outperforming, may indicate a preference for Canadian equities, 
                      reflecting investor optimism about the Canadian economy, commodity prices, or other factors specific to the Canadian market. 
                      This spread helps assess investor sentiment and potential shifts in allocation between U.S. and 
                      Canadian assets, offering insights into market preferences, currency movements, and economic outlooks for both countries.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={spTSXfrequency}
                    placeholder = {spTSXfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setSpTSXFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={spTsxChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(tsxVSCIChartCreated && tsxVMinChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">S&P/TSX Composite Versus the S&P/TSX Small Cap Index (TSXSCI-TSX)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the S&P/TSX Index and the S&P/TSX Small Cap Index offers insights into the performance of 
                      larger Canadian companies versus smaller-cap Canadian companies. A widening spread, with the S&P/TSX outperforming 
                      the Small Cap Index, often suggests that investors are favoring larger, more established companies, 
                      potentially reflecting a risk-averse sentiment or confidence in well-established businesses. Conversely, a narrowing spread, with the Small Cap Index outperforming, may indicate a preference for smaller-cap companies, reflecting optimism about their growth potential, economic conditions, or sector-specific trends within the small-cap segment. 
                      This spread helps assess investor sentiment and sector-specific dynamics, offering insights into preferences for 
                      larger versus smaller Canadian companies and potential shifts in risk appetite or economic outlook.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={tsxVSCIfrequency}
                    placeholder = {tsxVSCIfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setTsxVSCIFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={tsxVSCIChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">S&P/TSX Composite Versus the S&P/TSX Mining Index (TSXMIN-TSX)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the S&P/TSX Index and the S&P/TSX Mining Index provides insights into the relative performance of 
                      the broader Canadian equity market and the mining sector. A widening spread, with the S&P/TSX outperforming the Mining Index, 
                      often suggests that investors are favoring a more diversified approach, potentially reflecting confidence in various sectors 
                      beyond mining or commodity markets. Conversely, a narrowing spread, with the Mining Index outperforming, may indicate a 
                      preference for mining-related companies, reflecting optimism about commodity prices, resource sector trends, 
                      or economic conditions related to mining activities. This spread helps assess investor sentiment and sector-specific dynamics, 
                      offering insights into preferences for broader market exposure versus a focus on the mining sector, and potential shifts in commodity market conditions.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={tsxVMinfrequency}
                    placeholder = {tsxVMinfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setTsxVMinFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={tsxVMinChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(tsxVBankChartCreated && acwiVExUSChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">S&P/TSX Composite Versus the S&P/TSX Banking Index (TSXBANKS-TSX)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the S&P/TSX Index and the S&P/TSX Banking Index provides insights into the relative performance of 
                      the broader Canadian equity market and the banking sector within Canada. A widening spread, with the S&P/TSX outperforming the 
                      Banking Index, often suggests that investors are favoring a more diversified approach, potentially reflecting confidence in v
                      arious sectors beyond banking or specific dynamics within the broader market. Conversely, a narrowing spread, with the 
                      Banking Index outperforming, may indicate a preference for banking-related companies, 
                      reflecting investor optimism about the financial sector, interest rate trends, or economic conditions linked to the banking industry. 
                      This spread helps assess investor sentiment and sector-specific dynamics, offering insights into preferences for broader market 
                      exposure versus a focus on the banking sector, and potential shifts in financial market conditions or economic outlook.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={tsxVBankfrequency}
                    placeholder = {tsxVBankfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setTsxVBankFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={tsxVBankChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">MSCI ACWI Versus MSCI ACWI Ex US Stocks (ACWIEXUS-ACWI)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the MSCI ACWI (All Country World Index) and the MSCI ACWI Ex US Index provides insights into the 
                      relative performance of global equities inclusive of the United States versus the performance of global equities 
                      excluding U.S. stocks. A widening spread, with the MSCI ACWI outperforming the Ex US Index, often suggests that 
                      investors are favoring U.S. equities over international markets, potentially reflecting confidence in the U.S. economy, 
                      currency trends, or specific dynamics within U.S. stock markets. Conversely, a narrowing spread, 
                      with the Ex US Index outperforming, may indicate a preference for international stocks, 
                      reflecting optimism about global economic conditions, emerging markets, or currency factors. 
                      This spread helps assess investor sentiment and sector-specific dynamics on a global scale, 
                      offering insights into preferences for U.S. versus international market exposure and potential shifts in 
                      global economic conditions or currency trends.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={acwifrequency}
                    placeholder = {acwifrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setAcwiFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={acwiVExUSChart} height={100} width={200}/>
              </Col>
            </Row>
          }
          {(eafeVEafeSCChartCreated && eafeVGChartCreated) && 
            <Row className="pt-3">
              <Col lg="6">
              <div>
                  <h3 className="mb-3">MSCI EAFE Versus the MSCI EAFE Small Cap Index (EAFESC-EAFE)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the MSCI EAFE (Europe, Australasia, and the Far East) Index and the MSCI EAFE Small Cap Index 
                      provides insights into the relative performance of larger-cap international equities within developed markets 
                      compared to smaller-cap international stocks. A widening spread, with the MSCI EAFE outperforming the Small Cap Index, 
                      often suggests that investors are favoring larger, more established companies in international markets, 
                      potentially reflecting a risk-averse sentiment or confidence in well-established businesses overseas. Conversely, 
                      a narrowing spread, with the Small Cap Index outperforming, may indicate a preference for smaller-cap international companies, 
                      reflecting optimism about their growth potential, economic conditions, or sector-specific trends within the small-cap segment. 
                      This spread helps assess investor sentiment and sector-specific dynamics within developed international markets, offering insights 
                      into preferences for larger versus smaller international equities and potential shifts in risk appetite or economic outlook abroad.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={eafefrequency}
                    placeholder = {eafefrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setEafeFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={eafeVEafeSCChart} height={100} width={200}/>
              </Col>
              <Col lg="6">
              <div>
                  <h3 className="mb-3">MSCI EAFE Value Versus the MSCI EAFE Growth Index (EAFEV-EAFEG)</h3>
                  <p className="text-muted fw-light">
                      {`The spread between the MSCI EAFE Value Index and the MSCI EAFE Growth Index offers insights into the relative performance of 
                      value-oriented versus growth-oriented stocks within developed international markets. A widening spread, with the 
                      EAFE Value Index outperforming the Growth Index, often indicates that investors are favoring value stocks, 
                      which are typically characterized by lower valuations and dividends, potentially reflecting a cautious or defensive market sentiment. 
                      Conversely, a narrowing spread, with the Growth Index outperforming, may suggest that investors are leaning towards 
                      growth-oriented stocks, which are often associated with higher valuations and potential for higher earnings growth, 
                      reflecting a risk-on sentiment or confidence in economic growth. This spread helps assess investor sentiment and 
                      sector-specific dynamics within developed international markets, 
                      offering insights into preferences for value versus growth stocks and potential shifts in market conditions or economic outlook abroad.`}
                    {" "}
                  </p>
                </div>
                <div className="text-center">
                  <label className="form-label me-2">Frequency</label>
                  <Select
                    id="frequency"
                    options={frequencies}
                    value={eafeVGfrequency}
                    placeholder = {eafeVGfrequency}
                    className="dropdown bootstrap-select me-3 mb-3 mb-lg-0"
                    onChange = {(e) => setEafeVGFrequency(e.value)}
                    classNamePrefix="selectpicker"
                  />
                </div>
                <Line options={indexLineOptions} data={eafeVGChart} height={100} width={200}/>
              </Col>
            </Row>
          }
        </Container>
      </section>
    </React.Fragment>
  )

}


export default CapitalMarketIndicators