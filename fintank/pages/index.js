import React from "react"
import Link from "next/link"
import Image from "@components/CustomImage"
import axios from 'axios'
import { Container, Row, Col, Button } from "react-bootstrap"
import Swiper from "@components/Swiper"
import {SwiperSlide } from "swiper/react"
import SearchBar from "@components/SearchBar"
import LastMinute from "@components/LastMinute"
import Guides from "@components/Guides"
import Instagram from "@components/Instagram"
import CardPost from "@components/CardPost"
import SwiperTestimonial from "@components/SwiperTestimonial"
import data from "@data/index.json"
import blog from "@data/blog.json"
import Icon from "@components/Icon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons"
import { useHomeIndex } from "@hooks/useHomeIndex"

export async function getStaticProps() {

  // const res = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/homepage_indexes/`);
  // // console.log(res)
  // const data = res.data;
  

  return {
    props: {
      nav: {
        light: true,
        classes: "shadow",
        color: "white",
      },
      title: "Fintank",
      data
    },
  }
}

const Index = (props) => {

  const indexData = useHomeIndex()

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
                    {data.hero.title}
                  </h1>
                  <p className="subtitle letter-spacing-4 mb-2 text-secondary text-shadow">
                    {data.hero.subtitle2}
                  </p>
                </div>
              )}
              <Button
                  type="submit"
                >
                  Random Ticker Search
                </Button>
            </Col>
          </Row>
        </Container>
      </section>
      {data.topBlocks && (
        <section className="py-6 bg-gray-100">
          <Container>
            <div className="text-center pb-lg-4">
              <p className="subtitle text-secondary">
                {data.topBlocks.subTitle}
              </p>
              <h2 className="mb-5">{data.topBlocks.title}</h2>
            </div>
            <Swiper
                className="swiper-container-mx-negative pt-3 pb-5"
                wrapperClasses="dark-overlay"
                indexReturns
                perView={4}
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
      {data.jumbotron && (
        <section className="py-7 position-relative dark-overlay">
          <Image
            src={`/images/${data.jumbotron.img}`}
            alt=""
            className="bg-image"
            layout="fill"
          />
          <Container>
            <div className="overlay-content text-white py-lg-5">
              <h4 className="display-4 fw-bold text-serif text-shadow mb-5">
                {data.jumbotron.title}
              </h4>
              <Link href={data.jumbotron.link} passHref>
                <Button variant="light">{data.jumbotron.button}</Button>
              </Link>
            </div>
          </Container>
        </section>
      )}
      <Guides />
      <LastMinute greyBackground />
      {data.testimonials && (
        <section className="py-7">
          <Container>
            <div className="text-center">
              <p className="subtitle text-primary">
                {data.testimonials.subTitle}
              </p>
              <h2 className="mb-5">{data.testimonials.title}</h2>
            </div>
            <SwiperTestimonial data={data.testimonials.swiperItems} />
          </Container>
        </section>
      )}
      {blog.posts && (
        <section className="py-6 bg-gray-100">
          <Container>
            <Row className="mb-5">
              <Col md="8">
                <p className="subtitle text-secondary">
                  {data.blogPosts.subTitle}
                </p>
                <h2>{data.blogPosts.title}</h2>
              </Col>
              <Col
                md="4"
                className="d-md-flex align-items-center justify-content-end"
              >
                <Link href={data.blogPosts.buttonLink}>
                  <a className="text-muted text-sm">
                    {data.blogPosts.button}
                    <FontAwesomeIcon
                      icon={faAngleDoubleRight}
                      className="ms-2"
                    />
                  </a>
                </Link>
              </Col>
            </Row>
            <Row>
              {blog.posts.map((post, index) => {
                if (index <= 2)
                  return (
                    <Col
                      key={post.title}
                      lg="4"
                      sm="6"
                      className="mb-4 hover-animate"
                    >
                      <CardPost data={post} />
                    </Col>
                  )
              })}
            </Row>
          </Container>
        </section>
      )}

      <Instagram />
    </React.Fragment>
  )
}

export default Index



// export async function getServerSideProps(){
//   const res = await axios.get(`${process.env.API_URL}/all_indexes/`);
//   console.log(res)
//   const data = res.data;

//   return {
//     props:{
//       data,
//     }
//   }
// }