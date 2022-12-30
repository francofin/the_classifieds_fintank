import React, {useState, useEffect} from "react"
import { Container, Row, Col, Card, Badge } from "react-bootstrap"
import data from "@data/user-profile.json"
import geoJSON from "@data/rooms-geojson.json"
import CardRoom from "@components/CardRoom"
import Reviews from "@components/Reviews"
import ReviewForm from "@components/ReviewForm"
import Icon from "@components/Icon"
import Image from "@components/CustomImage"

export async function getStaticProps() {
  return {
    props: {
      nav: {
        light: true,
        classes: "shadow",
        color: "white",
      },
      loggedUser: true,
      title: "User Profile",
    },
  }
}

const UserProfile = () => {
  return (
    <section className="py-5">
      <Container>
        <Row>
          <Col lg="3" className="me-lg-auto">
            <Card className="border-0 shadow mb-6 mb-lg-0">
              <Card.Header className="bg-gray-100 py-4 border-0 text-center">
                <div className="avatar avatar-xxl p-2 mb-2">
                <div className="position-relative h-100 overflow-hidden rounded-circle">
                    <Image
                    src={`/content/img/avatar/${data.avatar}`}
                    alt=""
                    width={144}
                    height={144}
                    layout="fixed"
                    />
                </div>
                </div>
                <h5>
                  {data.firstname} {data.lastname}
                </h5>
                <p className="text-muted text-sm mb-0">{data.location}</p>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-rounded icon-rounded-sm bg-primary-light me-2">
                    <Icon
                      icon="diploma-1"
                      className="text-primary svg-icon-md "
                    />
                  </div>
                  <div>
                    <p className="mb-0">{data.reviewsnumber} reviews</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div
                    className={`icon-rounded icon-rounded-sm ${
                      data.verified ? "bg-primary-light" : "bg-gray-200"
                    } me-2`}
                  >
                    <Icon
                      icon={data.verified ? "checkmark-1" : "close-1"}
                      className={`${
                        data.verified ? "text-primary" : "text-muted"
                      } svg-icon-md`}
                    />
                  </div>
                  <div>
                    <p className="mb-0">
                      {data.verified ? "Verified" : "Unverified"}
                    </p>
                  </div>
                </div>
                <hr />
                <h6>{data.firstname} Stocks on WatchList</h6>
                <Card.Text className="text-muted" as="ul">
                  {data.provided.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="9" className="ps-lg-5">
            <h1 className="hero-heading mb-0">{`Hello, I'm ${data.firstname}!`}</h1>
            <div className="text-block">
              <p>
                <Badge bg="secondary-light" text="secondary">
                  Joined in {data.date}
                </Badge>
              </p>
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
            </div>
            <div className="text-block">
              <h4 className="mb-5">{`${data.firstname}'s Listings`}</h4>
              <Row>
                {geoJSON.features.map((listing) => (
                  <Col
                    sm="6"
                    lg="4"
                    className="mb-30px hover-animate"
                    key={listing.properties.name}
                  >
                    <CardRoom data={listing.properties} />
                  </Col>
                ))}
              </Row>
            </div>
            {/* <div className="text-block">
              <Reviews data={data.reviews} />
              <ReviewForm />
            </div> */}
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default UserProfile
