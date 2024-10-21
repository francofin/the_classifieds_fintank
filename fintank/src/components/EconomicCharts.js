import React, { useEffect, useState, useMemo, useContext } from "react";
import Link from "next/link";
import { idbPromise } from "@utils/helpers";
import "react-day-picker/dist/style.css";
import Select from "react-select"
import Swiper from "@components/Swiper"
import {Container,Row,Col,Form,Button, ToggleButton, Badge, Overlay} from "react-bootstrap";
import data from "@data/index.json"
import axios from 'axios';
import { useIndexPerformance } from "@hooks/useIndexPerformance";
import swal from 'sweetalert';

import { useCapitalMarketCharter } from "@hooks/useCapitalMarketsCharts";

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
  


const EconomicCharts = ({data}) => {
    const economicData = data.economicData;

    const {indexChartCreated:tenYrChartCreated, createIndexChart:tenYrChart, indexName:tenYearName} = useCapitalMarketCharter(data.tenYr, economicData?.ten?.dates, economicData?.ten?.value)
    const {indexChartCreated:fiveYrChartCreated, createIndexChart:fiveYrChart, indexName:fiveYearName} = useCapitalMarketCharter(data.fiveYr, economicData?.five?.dates, economicData?.five?.value)
    const {indexChartCreated:twoYrChartCreated, createIndexChart:twoYrChart, indexName:twoYearName} = useCapitalMarketCharter(data.twoYr, economicData?.two?.dates, economicData?.two?.value)
    const {indexChartCreated:thirtyYrChartCreated, createIndexChart:thirtyYrChart, indexName:thirtyYearName} = useCapitalMarketCharter(data.thirtyYr, economicData?.thirty?.dates, economicData?.thirty?.value)
    const {indexChartCreated:mlhyChartCreated, createIndexChart:mlhyChart, indexName:mlhyName} = useCapitalMarketCharter(data.mlhy, economicData?.high_yield?.dates, economicData?.high_yield?.value)
    const {indexChartCreated:tenVTwoChartCreated, createIndexChart:tenVTwoChart, indexName:tenVTwoName} = useCapitalMarketCharter(data.twoVTen, economicData?.tenvtwo?.dates, economicData?.tenvtwo?.value)
    const {indexChartCreated:tenVFiveChartCreated, createIndexChart:tenVFiveChart, indexName:tenVFiveName} = useCapitalMarketCharter(data.fiveVTen, economicData?.fivevten?.dates, economicData?.fivevten?.value)
    const {indexChartCreated:tenVThirtyChartCreated, createIndexChart:tenVThirtyChart, indexName:tenVThirtyName} = useCapitalMarketCharter(data.tenVThirty, economicData?.thirtyvten?.dates, economicData?.thirtyvten?.value)
    const {indexChartCreated:fiveVTwoChartCreated, createIndexChart:fiveVTwoChart, indexName:fiveVTwoName} = useCapitalMarketCharter(data.twoVFive, economicData?.fivevtwo?.dates, economicData?.fivevtwo?.value)
    const {indexChartCreated:highyieldSpreadChartCreated, createIndexChart:highyieldSpreadChart, indexName:highyieldSpreadName} = useCapitalMarketCharter(data.tenVMlhy, economicData?.highyield?.dates, economicData?.highyield?.value)
    const {indexChartCreated:cpiChartCreated, createIndexChart:cpiChart, indexName:cpiName} = useCapitalMarketCharter(data.cpi, economicData?.cpi?.dates, economicData?.cpi?.value)
    const {indexChartCreated:unempChartCreated, createIndexChart:unempChart, indexName:unempName} = useCapitalMarketCharter(data.unemp, economicData?.unemp?.dates, economicData?.unemp?.value)
    const {indexChartCreated:nonFarmChartCreated, createIndexChart:nonFarmChart, indexName:nonFarmName} = useCapitalMarketCharter(data.nonFarm, economicData?.nonfarm?.dates, economicData?.nonfarm?.value)


    return(
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
    )
}

export default EconomicCharts;
  