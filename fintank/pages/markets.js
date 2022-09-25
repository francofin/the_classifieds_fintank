import React, { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  InputGroup,
  Breadcrumb,
  Form,
  Button,
} from "react-bootstrap"
import data from "@data/knowledge-base.json"
import Link from "next/link"
import Icon from "@components/Icon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDoubleRight, faSearch } from "@fortawesome/free-solid-svg-icons"
import { faArrowTrendDown, faArrowTrendUp } from "@fortawesome/free-solid-svg-icons"
import { useIndex } from "@hooks/UseIndex"
import axios from 'axios';

export async function getStaticProps() {

//     const res = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/market_indexes/`);
// //   console.log(res)
//   const data = res.data;

  return {
    props: {
      nav: {
        light: true,
        classes: "shadow",
        color: "white",
      },
      title: "Market Data",
    },
  }
}

const KnowledgeBase = (props) => {
    const {data: indexData} = useIndex();
    

    const [allIndexData, setAllIndexData] = useState([])

    useEffect(() => {
        setAllIndexData(indexData)
    }, [indexData])

    console.log("All Data", allIndexData)

  return (
    <React.Fragment>
      <section className="hero py-5 py-lg-7">
        <Container className="position-relative">
          <Breadcrumb
            listProps={{
              className: "ps-0 justify-content-center",
            }}
          >
            <Link href="/" passHref>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>{props.title}</Breadcrumb.Item>
          </Breadcrumb>

          <h1 className="hero-heading">Search a Specific Global Index</h1>
          <Row>
            <Col xl="8" className="mx-auto">
              <Form>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search Something ... "
                  />
                  <Button type="submit">
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row className="py-5 pt-lg-0 mt-lg-n5">
            {allIndexData?.map((block, index) => (
              <Col key={index} lg="4" className="mb-3 mb-lg-0 text-center">
                <Card className="border-0 shadow-sm hover-animate h-100">
                  <Card.Body className="p-4">
                    <div className="icon-rounded bg-primary-light mb-3">
                      {block.changesPercentage > 0 ?
                        <FontAwesomeIcon icon={faArrowTrendUp} size="6x" pull="left" style={{color:"green"}}/> :
                        <FontAwesomeIcon icon={faArrowTrendDown} size="6x" pull="left" style={{color:"red"}}/>
                        }
                    </div>
                    <h5 className="h5">{block.name}</h5>
                    <p className="text-muted text-sm mb-0">Price: ${block.price}</p>
                    {block.changesPercentage > 0 ?
                        <p className="flex-grow-1 mb-0 text-md" style={{color:"green"}}>
                        {(block.changesPercentage).toFixed(2)}% 
                    </p>:
                    <p className="flex-grow-1 mb-0 text-md" style={{color:"red"}}>
                    {(block.changesPercentage).toFixed(2)}% 
                    </p>
                    }
                    <p className="text-muted text-sm mb-0">50 Day Average: ${block.priceAvg50}</p>
                    <p className="text-muted text-sm mb-0">200 Day Average: ${block.priceAvg200}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default KnowledgeBase
