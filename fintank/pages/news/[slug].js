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
import topics from "@data/topic.json"
import axios from 'axios';
import { useRouter } from "next/router"
import bannerImages from "@data/banner.json"
import { useImagesSelector } from "@hooks/UseImageSelect"
import { useNewsGenerator } from "@hooks/useNewsGenerator"


export function getAllTopicIds() {
  return topics.posts.map((post) => ({
    params: {
      slug: post.slug,
    },
  }))
}

export async function getTopicData(slug) {
  for (var i = 0; i < topics.posts.length; i++) {
    if (topics.posts[i].slug == slug) {
      return {
        stockItem: topics.posts[i],
        slug
      }
    }
  }
}

export async function getServerSideProps({query}) {
    const postData =await getTopicData(query.slug) 
    let topic = query.slug

    const res = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/newsarticles/${postData.slug}`);
    // const res = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/newsarticles/${topic}`);
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
        topic
        },
    }
}

const News = (props) => {

   


  return (
    <React.Fragment>
      Sanity

    </React.Fragment>
  )
}

export default News
