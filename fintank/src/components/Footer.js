import React from "react"
import Link from "next/link"
import Image from "@components/CustomImage"
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Badge,
  InputGroup,
} from "react-bootstrap"

import footerContent from "@data/footer.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import {
  faFacebook,
  faInstagram,
  faPinterest,
  faTwitter,
  faVimeo,
} from "@fortawesome/free-brands-svg-icons"

const Footer = () => {
  return (
    <footer className="position-relative z-index-10 d-print-none">
      <div className="py-5 bg-gray-200 text-muted">
        <Container>
          <Row>
            {footerContent &&
              footerContent.map((item) => (
                <Col
                  key={item.title}
                  lg={item.lg && item.lg}
                  md={item.md && item.md}
                  className="mb-5 mb-lg-0"
                >
                  <div className="fw-bold text-uppercase text-dark mb-3">
                    {item.title}
                  </div>
                  {item.content && (
                    <p
                      className={
                        item.contentBottomMargin
                          ? `mb-${item.contentBottomMargin}`
                          : ""
                      }
                    >
                      {item.content}
                    </p>
                  )}
                  {item.social && (
                    <ul className="list-inline">
                      {item.social.map((socialIcon, index) => {
                        let socialIconFA
                        switch (socialIcon.title) {
                          case "facebook":
                            socialIconFA = faFacebook
                            break
                          case "instagram":
                            socialIconFA = faInstagram
                            break
                          case "pinterest":
                            socialIconFA = faPinterest
                            break
                          case "vimeo":
                            socialIconFA = faVimeo
                            break
                          default:
                            socialIconFA = faTwitter
                        }
                        return (
                          <li
                            key={index}
                            className="list-inline-item"
                          >
                            <FontAwesomeIcon icon={socialIconFA} />
                          </li>
                        )
                      })}
                      <li>
                        <Image
                            src={`/images/${item.lowerImage}`}
                            layout="intrinsic"
                            className="bg-image"
                            width={150}
                            height={90}
                            alt={`Fintank Technology Finance Research`}
                          />
                        </li>
                    </ul>
                  )}
                  {item.links && (
                    <ul className="list-unstyled">
                      {item.links.map((link) => (
                        <li key={link.title}>
                          <Link href={link.link} passHref>
                            <a className="text-muted">
                              {link.title}
                              {link.new && (
                                <Badge
                                  variant="info"
                                  bg="info-light"
                                  className="ms-1"
                                >
                                  New
                                </Badge>
                              )}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.form && (
                    <Form id="newsletter-form" action="#">
                      <InputGroup className="input-group mb-3">
                        <Form.Control
                          type="email"
                          placeholder={item.form.placeholder}
                          aria-label={item.form.placeholder}
                          className="bg-transparent border-dark border-end-0"
                        />
                        <Button
                          className="border-start-0"
                          variant="outline-dark"
                          type="submit"
                          aria-label="Search"
                        >
                          <FontAwesomeIcon
                            icon={faPaperPlane}
                            className="text-lg"
                          />
                        </Button>
                      </InputGroup>
                    </Form>
                  )}
                </Col>
              ))}
          </Row>
        </Container>
      </div>
      <div className="py-4 fw-light bg-gray-800 text-gray-300">
        <Container>
          <Row className="align-items-center">
            <Col md="6" className="text-center text-md-start">
              <p className="text-sm mb-md-0">
                © 2021, Your company. All rights reserved.
              </p>
            </Col>
            <Col md="6">
              <ul className="list-inline mb-0 mt-2 mt-md-0 text-center text-md-end">
                <li className="list-inline-item">
                <Image
                      src={"/content/svg/visa.svg"}
                      alt="..."
                      width={35}
                      height={35}
                      layout="intrinsic"
                      className="w-2rem"
                      // loading={props.eager ? "eager" : "lazy"}
                    />
                </li>
                <li className="list-inline-item">
                <Image
                      src={"/content/svg/mastercard.svg"}
                      alt="..."
                      width={35}
                      height={35}
                      layout="intrinsic"
                      className="w-2rem"
                      // loading={props.eager ? "eager" : "lazy"}
                    />
                </li>
                <li className="list-inline-item">
                <Image
                      src={"/content/svg/paypal.svg"}
                      alt="..."
                      width={35}
                      height={35}
                      layout="intrinsic"
                      className="w-2rem"
                      // loading={props.eager ? "eager" : "lazy"}
                    />
                </li>
                <li className="list-inline-item">
                <Image
                      src={"/content/svg/western-union.svg"}
                      alt="..."
                      width={35}
                      height={35}
                      layout="intrinsic"
                      className="w-2rem"
                      // loading={props.eager ? "eager" : "lazy"}
                    />
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  )
}

export default Footer
