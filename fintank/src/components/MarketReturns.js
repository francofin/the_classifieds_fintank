import React from "react"
import Link from "next/link"
import { Card } from "react-bootstrap"
import Icon from "./Icon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartLine } from "@fortawesome/free-solid-svg-icons"

const MarketReturns = (props) => {
  const data = props.data
  console.log(data)
  return (
    <Card className="h-100 border-0 shadow">
      <div className="card-img-top overflow-hidden my-2 px-3" >
      <FontAwesomeIcon icon={faChartLine} size="6x" pull="left"/>
        <Link href="/detail-rooms">
          <a
            className="tile-link"
            // aria-label={`Read more about ${data.title}`}
          />
        </Link>
        <div className="card-img-overlay-top text-end">
          <a
            className="card-fav-icon position-relative z-index-40"
            href="#"
            // aria-label={`Add ${data.title} to wishlist`}
          >
            <Icon icon="heart-1" className="text-white" />
          </a>
        </div>
      </div>
      <hr />
      <Card.Body className="d-flex align-items-center">
        <div className="w-100">
          <Card.Title as="h6">
            <Link href="/detail-rooms">
              <a className="text-decoration-none text-dark">Some Index</a>
            </Link>
          </Card.Title>
          <Card.Subtitle className="d-flex mb-3" as="div">
            <p className="flex-grow-1 mb-0 text-muted text-sm">
              Returns and Price
            </p>
            <p className="flex-shrink-1 mb-0 card-stars text-xs text-end">
              {/* <Stars stars={data.stars} /> */}
            </p>
          </Card.Subtitle>
          <Card.Text className="text-muted">
            <span className="h4 text-primary">$Date</span>
            &nbsp;per night
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  )
}

export default MarketReturns
