import React from "react"
import Link from "next/link"
import Image from "./CustomImage"
import { Card, Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons"

const CardPost = (props) => {
  const post = props.data
  return (
    <Card className="border-0 h-100 shadow">
      <Link href={`/blog/${post.slug}`}>
        <a className="">
          <Image
            src={`/content/${post.img}`}
            alt="..."
            width={1080}
            height={720}
            layout="intrinsic"
            className="img-fluid card-img-top"
            loading={props.eager ? "eager" : "lazy"}
          />
        </a>
      </Link>
      <Card.Body>
        <a
          href="#"
          className="text-uppercase text-muted text-sm letter-spacing-2"
        >
          {post.category}
        </a>
        <h5 className="my-2">
          <Link href={`/blog/${post.slug}`}>
            <a className="text-dark">{post.title}</a>
          </Link>
        </h5>
        <p className="text-gray-500 text-sm my-3">
          <FontAwesomeIcon icon={faClock} className="me-2" />
          {post.date}
        </p>
        <p className="my-2 text-muted text-sm">{post.content}</p>
        <Link href={`/blog/${post.slug}`} passHref>
          <Button className="ps-0" variant="link">
            Read more <FontAwesomeIcon icon={faLongArrowAltRight} />
          </Button>
        </Link>
      </Card.Body>
    </Card>
  )
}

export default CardPost
