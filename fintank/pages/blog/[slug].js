import React from "react"

import Link from "next/link"

import blog from "../../data/blog.json"
import postDummyData from "../../data/post.json"

import { Container, Row, Col, Button, Collapse, Form } from "react-bootstrap"
import Image from "../../components/CustomImage"
import Avatar from "../../components/Avatar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faReply } from "@fortawesome/free-solid-svg-icons"
import { faClock, faComment } from "@fortawesome/free-regular-svg-icons"

export function getAllPostIds() {
  return blog.posts.map((post) => ({
    params: {
      slug: post.slug,
    },
  }))
}

export function getPostData(slug) {
  for (var i = 0; i < blog.posts.length; i++) {
    if (blog.posts[i].slug == slug) {
      return blog.posts[i]
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: getAllPostIds(),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const postData = getPostData(params.slug)
  return {
    props: {
      nav: {
        light: true,
        classes: "shadow",
        color: "white",
      },
      title: postData.title,
      postData,
    },
  }
}
const Product = ({ postData }) => {
  const [formCollapse, setFormCollapse] = React.useState(false)

  return (
    <React.Fragment>
      <section className="hero-home dark-overlay mb-5">
        {postData.img && (
          <Image
            src={`/content/${postData.img}`}
            alt={postData.title}
            className="bg-image"
            loading="eager"
            layout="fill"
            priority={true}
          />
        )}
        <Container className="py-7">
          <div className="overlay-content text-center text-white">
            <h1 className="display-3 text-serif fw-bold text-shadow mb-0">
              {postData.title && postData.title}
            </h1>
          </div>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col lg="10" xl="8" className="mx-auto">
              <p className="py-3 mb-5 text-muted text-center fw-light d-flex align-items-center justify-content-center flex-wrap">
                {postDummyData.authorLink && (
                  <Link href={postDummyData.authorLink}>
                    <a>
                      <Avatar
                        image={`/content/img/avatar/${postDummyData.authorAvatar}`}
                        alt=""
                        className="me-2"
                        border
                      />
                    </a>
                  </Link>
                )}
                Written by&nbsp;
                {postDummyData.authorLink && (
                  <Link href={postDummyData.authorLink}>
                    <a className="fw-bold">{postDummyData.author}</a>
                  </Link>
                )}
                <span className="mx-1">|</span>{" "}
                {postDummyData.date && postDummyData.date} in&nbsp;
                {postDummyData.categoryLink && (
                  <Link href={postDummyData.categoryLink}>
                    <a className="fw-bold">{postDummyData.category}</a>
                  </Link>
                )}
                <span className="mx-1">|</span>
                <a href="#" className="text-muted">
                  {postDummyData.comments && postDummyData.comments.length}{" "}
                  comments{" "}
                </a>
              </p>
              <p
                className="lead mb-5"
                dangerouslySetInnerHTML={{ __html: postDummyData.excerpt }}
              />
            </Col>
          </Row>
          <Row>
            <Col xl="10" className="mx-auto mb-5">
              <Image
                src="/content/img/photo/photo-1471189641895-16c58a695bcb.jpg"
                alt=""
                width={1501}
                height={834}
                className="img-fluid"
                layout="responsive"
                sizes="(max-width: 1199px) 100vw, 920px"
              />
            </Col>
          </Row>
          <Row>
            <Col xl="8" lg="10" className="mx-auto">
              <div className="text-content">
                <div
                  dangerouslySetInnerHTML={{ __html: postDummyData.content }}
                />
                <hr />
              </div>
              {postDummyData.comments && (
                <div className="mt-5">
                  <h6 className="text-uppercase text-muted mb-4">
                    {postDummyData.comments.length} comments
                  </h6>
                  {postDummyData.comments.map((comment, index) => (
                    <div key={index} className="d-flex mb-4">
                      <Avatar
                        image={`/content/img/avatar/${comment.avatar}`}
                        alt={comment.title}
                        size="lg"
                        className="me-4 flex-shrink-0"
                        border
                      />

                      <div>
                        <h5>{comment.title}</h5>
                        <p className="text-uppercase text-sm text-muted">
                          <FontAwesomeIcon icon={faClock} /> {comment.date}
                        </p>
                        <p className="text-muted">{comment.content}</p>
                        <p>
                          <Button
                            variant="link"
                            href="#"
                            className="text-primary"
                          >
                            <FontAwesomeIcon icon={faReply} /> Reply
                          </Button>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mb-5">
                <Button
                  type="button"
                  aria-expanded={formCollapse}
                  aria-controls="leaveComment"
                  variant="outline-primary"
                  onClick={() => setFormCollapse(!formCollapse)}
                >
                  Leave a comment
                </Button>
                <Collapse id="leaveComment" in={formCollapse} className="mt-4">
                  <div>
                    <h5 className="mb-4">Leave a comment</h5>
                    <Form method="post">
                      <Row>
                        <Col md="6">
                          <div>
                            <Form.Label htmlFor="name">
                              Name <span className="required">*</span>
                            </Form.Label>
                            <Form.Control id="name" type="text" />
                          </div>
                        </Col>
                        <Col md="6">
                          <div>
                            <Form.Label htmlFor="email">
                              Email <span className="required">*</span>
                            </Form.Label>
                            <Form.Control id="email" type="text" />
                          </div>
                        </Col>
                      </Row>
                      <div className="mb-4">
                        <Form.Label htmlFor="comment">
                          Comment <span className="required">*</span>
                        </Form.Label>
                        <Form.Control
                          id="comment"
                          type="textarea"
                          className="form-control"
                          rows="4"
                        />
                      </div>
                      <Button type="submit" variant="primary">
                        <FontAwesomeIcon icon={faComment} /> Comment
                      </Button>
                    </Form>
                  </div>
                </Collapse>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default Product
