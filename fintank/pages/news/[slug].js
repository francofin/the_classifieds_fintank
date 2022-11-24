import React, {useEffect, useState} from "react"
import Link from "next/link"
import { Container, Row, Col, Button, Badge } from "react-bootstrap"
import Swiper from "@components/Swiper"
import SearchBar from "@components/SearchBar"
import PopularCities from "@components/PopularCities"
import Discover from "@components/Discover"
import Brands from "@components/Brands"
import data from "@data/news.json"
import geoJSON from "@data/restaurants-geojson.json"
import Image from "@components/CustomImage"
import axios from 'axios';
import { useRouter } from "next/router"

export async function getServerSideProps({query}) {

    const topic = query.slug

    console.log("Topic", topic)

    const res = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/newsarticles/${topic}`);
    const responseNews = res.data;
    
    return {
        props: {
        nav: {
            light: true,
            classes: "shadow",
            color: "white",
        },
        title: "News",
        responseNews,
        },
    }
}

const News = (props) => {

    const newsData = props.responseNews
    const  newsDataWithImages = newsData.data.filter((news, i) => news.image)
    const newsNoImages = newsData.data.filter((news, i) => !news.image)

    console.log("images", newsDataWithImages)
    console.log("Articles", newsData)

    const adjustTimeStamp = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric"}
        return new Date(date).toLocaleDateString(undefined, options)
      }


  return (
    <React.Fragment>
      {data.hero && (
        <section className="d-flex align-items-center dark-overlay">
          <Image
            src={`/images/homeImages/chess.jpg`}
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
                  {data.hero.title}
                </h1>
                <p className="text-lg text-shadow">{data.hero.subTitle}</p>
              </Col>
            </Row>
          </Container>
        </section>
      )}
      <Container>
        <SearchBar
          options={data.searchOptions}
          className="rounded p-3 p-lg-4 position-relative mt-n5 z-index-20"
          halfInputs
          id="index-2-searchbar"
          btnMb="0"
        />
      </Container>
      {data.popularCities && (
        <PopularCities
          title={data.popularCities.title}
          subTitle={newsData.tag}
          blockStories={newsData.data.splice(0,5)}
        />
      )}
      {data.popular && (
        <section className="py-3 bg-gray-100">
          <Container>
            <div className="text-center pb-lg-4">
              <p className="subtitle text-primary">{data.popular.subTitle}</p>
              <h2 className="mb-5">{data.popular.title}</h2>
            </div>
          </Container>
          <Container fluid>
            <Swiper
              className="swiper-container-mx-negative items-slider-full px-lg-5 pt-3 pb-5"
              perView={1}
              spaceBetween={20}
              loop
              roundLengths
              md={2}
              lg={3}
              xl={4}
              xxl={5}
              xxxl={6}
              data={newsDataWithImages}
              newsCards
              pagination
            />

          </Container>
        </section>
      )}

      {data.travel && (
        <section className="py-6 py-lg-7 position-relative dark-overlay">
          <Image
            src={`/images/markets/marketbanner.jpg`}
            layout="fill"
            className="bg-image"
            alt={data.travel.title}
          />
          <Container>
            <div className="overlay-content text-white py-lg-5 text-center">
              <p className="subtitle text-white letter-spacing-4 mb-4">
                {data.travel.subtitle}
              </p>
              <h3 className="display-3 fw-bold text-serif text-shadow mb-5">
                {data.travel.title}
              </h3>
              <p className="lead text-shadow mb-5">{data.travel.content}</p>
            </div>
          </Container>
        </section>
      )}

      

      {data.bottomBlock && (
        <div className="list-group shadow mb-5">
        {newsNoImages.map((message, index) => (
          // Map through messages from json file
          <div
            key={index}
            className="list-group-item list-group-item-action p-4"
          >
            <Row>
              <Col
                xs="2"
                lg="1"
                className="align-self-lg-center py-3 d-flex align-items-lg-center"
              >
              </Col>
              <Col xs="9" lg="4" className="align-self-center mb-3 mb-lg-0">
                <div className="d-flex align-items-center mb-1 mb-lg-3">
                  <h2 className="h5 mb-0" dangerouslySetInnerHTML={{__html: `${message.name}`}} />
                </div>
                <p className="text-sm text-muted">{message.category}</p>
                <Badge
                  pill
                  bg={"success-light"}
                  text={"success"}
                  className="p-2"
                >
                <p dangerouslySetInnerHTML ={{__html: `${message.provider[0].name}`}} />
                </Badge>
                <Link href={message.url}>
                  <a className="stretched-link"></a>
                </Link>
              </Col>
              <Col xs="10" lg="7" className="ms-auto">
                <Row>
                  <Col md="8" className="py-3">
                    <p className="text-sm mb-0" dangerouslySetInnerHTML ={{__html: `${message.description}`}} />
                  </Col>
                  <Col md="4" className="text-end py-3">
                    <p className="text-sm">{adjustTimeStamp(message.datePublished)}</p>
                  </Col>
                  <Link href={message.url}>
                    <a className="stretched-link"></a>
                  </Link>
                </Row>
              </Col>
            </Row>
          </div>
        ))}
      </div>
      )}


    </React.Fragment>
  )
}

export default News
