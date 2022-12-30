import React, {useContext, useState, useEffect} from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useDropzone } from "react-dropzone";
import { DjangoAuthContext } from '@context/authContext';
import { Container, Row, Col, Card, Badge, Modal, Button, Form, ListGroup } from "react-bootstrap"
import { faCheck, faTimes, faDownload, faSearch, faAngleLeft, faAngleRight  } from "@fortawesome/free-solid-svg-icons"
import data from "@data/user-profile.json"
import CardRoom from "@components/CardRoom"
import Icon from "@components/Icon"
import Image from "@components/CustomImage"
import { isAuthenticatedUser } from '@utils/isAuthenticated';
import axios from 'axios';
import { useUserWatchList } from "@hooks/useWatchList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


export async function getServerSideProps({req}){
  const access_token = req.cookies.access;
  const user = await isAuthenticatedUser(access_token);

  if (!user){
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_FINTANK_API_URL}/get_portfolio/`,{
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        });
    
  const watchList = res.data;

    return {
      props: {
        access_token,
        watchList,
        nav: {
          light: true,
          classes: "shadow",
          color: "white",
        },
        loggedUser: true,
        title: "User Portfolio",
      }
    }
}

const UserProfile = ({access_token, watchList}) => {
  const {user, loading, logout, updated, imageData,
    clearErrors, updateUser, setUpdated, avatar,
    error, handleImageUpload, handleImageRemove, getUserWatchlist} = useContext(DjangoAuthContext);

  
  const [preview, setPreview] = useState('/images/homeImages/simpleonthesurface.jpg');
  const [userImage, setUserImage] = useState([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null)
  const [userInfo, setUserInfo] = useState(null);
  const [updateInfo, setUpdateInfo] = useState(false);
  const [firstName, setFirstName] = useState("")
  const [password, setPassword] = useState("")
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("")
  const [userWatchList, setuserWatchList] = useState([]);
  const [analysisLink, setAnalysisLink] = useState("/stock-data/[ticker]");
  const [linkAs, setLinkAs] = useState(`/stock-data/`)
  const router = useRouter();
  console.log(user)

  const [modal, setModal] = useState(false)

  const onClickModal = () => {
      setModal(!modal)
  }

  useEffect(() => {
      setUserInfo(user);
      setFirstName(user?.first_name);
      setLastName(user?.last_name);
      setPassword(user?.password);
      setEmail(user?.email)
      
  }, [user]);


  const watchListCalls = useUserWatchList(watchList);

  console.log(watchListCalls);



  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
        setUserImage(acceptedFiles.map((file) => {
            // fileResizerAndUpload(file);
            
            setProfilePictureUrl(file);
            handleImageUpload(file);
            Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
              setPreview(file["preview"]);
              
            } 
        ),
      )
    },
  })


  const handleSubmit = (e) => {
    e.preventDefault();
 
    const formData = new FormData();
    
    formData.append("profile_picture_cs", avatar);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("password", password);
    console.log("Avatar", avatar)
    updateUser(formData, access_token)
}




const removeImage = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    
    formData.append("profile_picture_cs", "");
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("password", password);
    console.log("Avatar", avatar)
    updateUser(formData, access_token)

    handleImageRemove()
}

const adjustTimeStamp = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric"}
  return new Date(date).toLocaleDateString(undefined, options)
}



  return (
    <React.Fragment>
      <section className="d-flex align-items-center hero py-3 py-lg-7">
          <Image
            src={user?.profile_picture_cs ? user?.profile_picture_cs :preview}
            layout="fill"
            className="bg-image"
            alt="Stock Research"
            loading="eager"
            priority={true}
          />
          <Container className="py-6 py-lg-7 text-white overlay-content text-center">
            <Row>
              <Col xl="10" className="mx-auto">
   
                <h1 className="text-lg text-shadow mt-3"></h1>
              </Col>
            </Row>
          </Container>
        </section>
    
    <section className="py-5">
      <Container>
        <Row>
          <Col lg="3" className="me-lg-auto">
            <Card className="border-0 shadow mb-6 mb-lg-0">
              <Card.Header className="bg-gray-100 py-4 border-0 text-center">
                <div className="avatar avatar-xxl p-2 mb-2">
                <div className="position-relative h-100 overflow-hidden rounded-circle">
                    <Image
                    src={`/images/homeImages/fintank3.png`}
                    alt=""
                    width={144}
                    height={144}
                    layout="fixed"
                    />
                </div>
                </div>
                <h5>
                  {user?.first_name} {user?.last_name}
                </h5>
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
                    <p className="mb-0">{watchListCalls?.length} Stocks on WatchList</p>
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
                <h6>How To Add Stocks To Your WatchList</h6>
                <Card.Text className="text-muted" as="ul">
                  {data.provided.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="9" className="ps-lg-5">
            <h1 className="hero-heading mb-0">{`Welcome Back @${user?.first_name}!`}</h1>
            <div className="text-block">
              <p>
                <Badge bg="primary" text="secondary">
                  Joined in {adjustTimeStamp(user?.created_at)}
                </Badge>
              </p>
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
              <Button onClick={onClickModal}>Customize Profile</Button>
              <Modal show={modal} onHide={onClickModal}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-uppercase" as="h6">
                    {`@${user?.first_name}'s Banner`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted">
                    <strong>Customize your Banner and Avatar. Set your banner to a goal you wish to achieve.</strong>
                    </p>
                    <div className="w-100 py-2 px-md-2 px-xxl-2 position-relative">
                    <Form className="form-validate" onSubmit={handleSubmit}>
                      <div {...getRootProps({ className: "dropzone dz-clickable" })}>
                          <input {...getInputProps()}/>
                  
                          <div className="dz-message text-muted">
                          <p>What are you investing towards?</p>
                          <p>
                              <span className="note">
                              (Click to Upload{" "}
                              <strong>Your Aspirational Goal</strong>.)
                              </span>
                          </p>
                          </div>
                      </div>
                    {user?.profile_picture_cs ?
                      <div className="position-relative h-100">
                      <p>Current Banner</p>
                      <Row>
                          <Col lg="9">
                            <Image
                            src={user?.profile_picture_cs}
                            alt=""
                            width={154}
                            height={154}
                            layout="fixed"
                            />
                            </Col>
                            <Col lg="3">
                              <Button onClick={removeImage} >Remove Image</Button>
                            </Col>
                        </Row>
                    </div> : 
                    ''
                    }
                      
                      <div className="justify-content-end py-3">
                        <Button type='submit'>Save changes</Button>
                      </div>
                      
                    </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-end">
                    <Button variant="outline-muted" onClick={onClickModal}>
                    Close
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>
            <div className="text-block">
              <h4 className="mb-5">{`@${user?.first_name}'s WatchList`}</h4>
              <Row>
              {watchListCalls ?
              <ListGroup className="shadow mb-5">
              {watchListCalls?.map((stock, index) => (
                <Link href={analysisLink} as={`${linkAs}${stock.symbol}`} passHref key={index}>
                  <ListGroup.Item action className="p4" as="a">
                    <Row>
                      <Col lg="4" className="align-self-center mb-4 mb-lg-0">
                        <div className="d-flex align-items-center mb-3">
                          <h2 className="h5 mb-0">{stock.name}</h2>
                          {/* <Avatar
                            image={`/content/img/avatar/${booking.avatar}`}
                            size="sm"
                            className="ms-3  avatar-border-white"
                            cover
                            alt=""
                          /> */}
                        </div>
                        <Badge
                          bg={
                            stock.change > 0
                              ? "success" : "danger"
                          }
                          text={
                            stock.founded && "success"
                          }
                          className="p-2"
                          pill
                        >
                          Price: {stock.price}
                        </Badge>
                      </Col>
                      <Col lg="8">
                        <Row>
                          <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                            <h6 className="label-heading">Ticker</h6>
                            <p className="text-sm fw-bold">{stock.symbol}</p>
                            <h6 className="label-heading">Name</h6>
                            <p className="text-sm fw-bold">{stock.name}</p>
                          </Col>
                          <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                            <h6 className="label-heading">Change</h6>
                            <p className="text-sm fw-bold">%{stock.changesPercentage}</p>
                            <h6 className="label-heading">Trading Range</h6>
                            <p className="text-sm fw-bold">${stock.range}</p>
                          </Col>
                          <Col xs="6" md="4" lg="3" className="py-3 mb-3 mb-lg-0">
                            <h6 className="label-heading">Day High</h6>
                            <p className="text-sm fw-bold">{stock.dayHigh}</p>
                            <h6 className="label-heading">Day Low</h6>
                            <p className="text-sm fw-bold">{stock.dayLow}</p>
                          </Col>
                          <Col xs="12" lg="3" className="align-self-center">
                            {stock.earningsAnnouncement && 
                              <span
                              className={`${
                                stock.date_first_added ? "text-primary" : "text-muted"
                              } text-sm text-uppercase me-4 me-lg-0`}
                            >
                              <h6 className="label-heading">Earnings Announcement</h6>
                              <FontAwesomeIcon
                                icon={stock.earningsAnnouncement ? faCheck : faTimes}
                                className="me-2"
                              />
                              {adjustTimeStamp(stock.earningsAnnouncement)}
                            </span>
                            }
                            <br className="d-none d-lg-block" />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </Link>
              ))}
              </ListGroup>
              : ''}
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
    </React.Fragment>
  )
}

export default UserProfile
