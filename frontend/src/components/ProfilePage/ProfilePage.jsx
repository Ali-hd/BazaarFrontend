import React, { Component } from 'react'
import jwt from 'jsonwebtoken'
import { Row, Col, Button, Container, Tabs, Tab, OverlayTrigger, Popover, Form, Modal, Card } from 'react-bootstrap'
import './ProfilePage.css'
import { Item, Rating, Icon, Image, Loader, Segment } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import Swal from 'sweetalert2'

const imageMaxSize = 1066300 // bytes = 1MB
const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() })

export default class ProfilePage extends Component {
    state = {
        token: "",
        setshow: false,
        profileimg: null,
        firstname: '',
        lastname: '',
        description: null,
        city: null,
        guest: false,
        data: '',
        followers: [],
        loading: true,
        maxRating: 5,
        inboxShow: false,
        msg:"",
    }
    componentDidMount = () => {

        let self = this;

        if (localStorage.usertoken) {
            jwt.verify(localStorage.usertoken, 'secret', function (err, decoded) {
                if (err) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'token expired',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    self.setState({ guest: true })
                } else {
                    var decoded = jwt.verify(localStorage.usertoken, 'secret')
                    console.log("decoded ==")
                    console.log(decoded);
                    self.setState({ token: decoded, })
                    axios.get(`https://sei-bazaar-backend.herokuapp.com/users/${self.props.match.params.id}`, { headers: { Authorization: `Bearer ${localStorage.usertoken}` } }).then(res => {
                        self.setState({
                            firstname: res.data.result.firstname, lastname: res.data.result.lastname, description: res.data.result.description, profileimg: res.data.result.profileimg, city: res.data.result.city, data: res.data.result, loading: false
                        })
                        console.log("shahsbahs")
                        console.log(res)
                    })
                        .catch(err => console.log(err))
                }
            });

        } else { this.setState({ guest: true }) }
    }
    componentDidUpdate = () => {
        console.log("state:=")
        console.log(this.state)
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        console.log(this.state)
    }
    submit = (e) => {
        e.preventDefault()
        axios.put(`https://sei-bazaar-backend.herokuapp.com/users/${this.state.token.id}`, this.state, { headers: { Authorization: `Bearer ${localStorage.usertoken}` } })
            .then(res => {
                window.location.reload();
                console.log(res)
            })

            .catch(err => console.log(err))
    }

    activeChat = (e) => {
        this.setState({
            msg: e.target.value
        })
        console.log(this.state)
    }
    chat = (e) => {
        e.preventDefault()
        axios.post(`https://sei-bazaar-backend.herokuapp.com/users/send/${this.props.match.params.id}`, this.state, { headers: { Authorization: `Bearer ${localStorage.usertoken}` } })
            .then(res => {
                
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'message sent',
                    showConfirmButton: false,
                    timer: 1500
                })
            })

            .catch(err => console.log(err))
    }
    verifyFile = (files) => {
        if (files && files.length > 0) {
            const currentFile = files[0]
            const currentFileType = currentFile.type
            const currentFileSize = currentFile.size
            if (currentFileSize > imageMaxSize) {
                alert("This file is not allowed. " + Math.ceil((currentFileSize / 1024) / 1024) + " MB is too large")
                return false
            }
            if (!acceptedFileTypesArray.includes(currentFileType)) {
                alert("This file is not allowed. Only images are allowed.")
                return false
            }
            return true
        }
    }
    handleOnDrop = (files, rejectedFiles) => {
        if (rejectedFiles && rejectedFiles.length > 0) {
            this.verifyFile(rejectedFiles)
        }
        if (files && files.length > 0) {
            const isVerified = this.verifyFile(files)
            if (isVerified) {
                // imageBase64Data 
                const currentFile = files[0]
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener("load", () => {
                    console.log(myFileItemReader.result)
                    const myResult = myFileItemReader.result
                    // const myResult2 = new Buffer(myResult,'base64').toString('binary')
                    this.setState({ profileimg: myResult })
                }, false)
                myFileItemReader.readAsDataURL(currentFile)
            }
        }
    }

    follow = (e) => {
        axios.post(`https://sei-bazaar-backend.herokuapp.com/users/${this.props.match.params.id}`, this.state, { headers: { Authorization: `Bearer ${localStorage.usertoken}` } })
            .then((res) => {
                if (res.data.msg == "follow Done") {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Follow Done',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }).catch(err => { console.log(err) })
    }

    rate = (e) => {
        e.preventDefault()
        console.log("rate sent")
        axios.post(`https://sei-bazaar-backend.herokuapp.com/users/${this.props.match.params.id}/rate`, this.state, { headers: { Authorization: `Bearer ${localStorage.usertoken}` } })
        .then(res=>{
            if(res.data.msg=="follow Done"){
                Swal.fire({
                    icon: 'success',
                    title: 'review submitted',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }).catch(err=>{

        })
    }

    handleRate = (e, { rating, maxRating }) => {
        this.setState({ star: rating })
    }
    rateOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        console.log(this.state)
    }

    render() {
        return (
            <div>
                <Modal
                    size="lg"
                    show={this.state.setshow}
                    onHide={() => this.setState({ setshow: false })}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    {this.state.token.id === this.props.match.params.id ? <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <Icon name="edit outline"></Icon>Edit Profile
          </Modal.Title>
                    </Modal.Header> : null}

                    <Modal.Body>
                        <Row>
                            <Col lg={4} md={12}>
                                <Card style={{ width: '18rem', margin: '0 auto' }}>
                                    <Card.Img variant="top" src={this.state.profileimg==""?"https://i.imgur.com/3KR0iMp.jpg":this.state.profileimg} />
                                    <Card.Body>
                                        <Card.Text>
                                            Want to change your profile picture?</Card.Text>
                                        <Dropzone onDrop={this.handleOnDrop} accept={acceptedFileTypesArray} multiple={false} maxSize={imageMaxSize}>
                                            {({ getRootProps, getInputProps }) => (
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    <Button variant="dark">Change</Button>
                                                </div>
                                            )}
                                        </Dropzone>

                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={8} md={12}>
                                <Form method="post" onSubmit={this.submit}>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control value={this.state.city} name="city" placeholder="Jeddah.." onChange={this.onChange} />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control value={this.state.description} name="description" as="textarea" rows="3" onChange={this.onChange} />
                                    </Form.Group>
                                    <br />
                                    <Button onClick={this.submit} variant="success" type="submit">
                                        Submit </Button>
                                </Form>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
                <br />
                <Container style={{ marginBottom: '-20px' }}>
                    <div style={{ marginLeft: '-15px' }}>
                        {this.state.token.id === this.props.match.params.id ? <Button onClick={() => this.setState({ setshow: true })} style={{ marginLeft: '0px', marginRight: '10px', width: '135px' }} inline-block variant="dark"><Icon name="edit outline"></Icon>Edit Profile</Button> : null}
                        {this.state.token.id !== this.props.match.params.id ?
                            <OverlayTrigger trigger="click" placement="bottom" overlay={<Popover id="popover-basic">
                                <Popover.Title as="h3">Give a Rating</Popover.Title>
                                <Popover.Content>
                                    <Form method="post" onSubmit={this.rate}>
                                        <Rating onRate={this.handleRate} icon='star' maxRating={5} clearable />
                                        <Form.Control onChange={this.rateOnChange} type="text" name="review" style={{ margin: '5px auto' }} placeholder="Say something?" />
                                        <Button onClick={this.rate} size="sm" variant="primary" type="submit">
                                            Submit </Button>
                                    </Form>
                                </Popover.Content>
                            </Popover>}>

                                <Button style={{ float: 'right', marginRight: '-15px'}} inline-block variant="success"><Icon name="plus circle"></Icon>Rate User</Button>

                            </OverlayTrigger> : null}

                    </div>
                </Container>
                <br />
                <Container style={{ border: 'solid 2px black', backgroundColor: 'white' }}>
                    <Row style={{ marginTop: '5%' }}>
                        <Col sm={4}><Image style={{ border: 'solid 1px gray', display: 'block', margin: 'auto' }} width="82%" height="auto" src={this.state.profileimg==""?"https://i.imgur.com/3KR0iMp.jpg":this.state.profileimg} thumbnail />
                            <h4 style={{ float: 'right', width: '90%', marginTop: '5px' }}>{this.state.data.username}</h4></Col>
                        <Col sm={1}></Col>
                        <Col sm={6}>
                            <Row>
                                <Container style={{ border: '1px gray solid', width: '100%', borderRadius: '5px', backgroundColor: '#f8f7f6' }}>
                                    <br />
                                    <h5>{this.state.firstname + " " + this.state.lastname}</h5>
                                    <h5>{this.state.city}</h5>

                                    {/* <h5 >Rating: {this.state.data.Rating}</h5> */}


                                    <h5>Member since: {this.state.data.createdAt !== undefined ? this.state.data.createdAt.slice(0, -14) : null}</h5>
                                    <h5>{this.state.data.email}</h5>
                                    <h5>{this.state.data.phonenumber}</h5>
                                    <h5>Followers: {this.state.data.followers !== undefined ? this.state.data.followers.length : null}</h5>
                                    <br />
                                </Container>
                            </Row>
                            <Row>

                                <Modal
                                    size="md"
                                    show={this.state.inboxShow}
                                    onHide={() => this.setState({ inboxShow: false })}
                                    dialogClassName="modal-90w"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                >
                                    {<Modal.Header closeButton>
                                        <Modal.Title style={{ textAlign: 'center', width: '100%' }} id="contained-modal-title-vcenter">
                                            <Icon name="paper plane outline"></Icon>Messages</Modal.Title>
                                    </Modal.Header>}

                                    <Modal.Body>
                                        <Row>
                                            {/* <Col lg={1}></Col> */}
                                            <Col lg={12} md={12}>
                                                <Form method="post" onSubmit={this.chat}>
                                                    <Segment>
                                                    <Segment>
                                                        hello
                                                    </Segment>
                                                    <Segment>
                                                        hi
                                                    </Segment>
                                                    <Segment>
                                                        haay
                                                    </Segment>
                                                    </Segment>
                                                   
                                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                                        <Form.Label>Description</Form.Label>
                                                        <Form.Control name="msg" as="textarea" rows="3" onChange={this.activeChat} />
                                                    </Form.Group>
                                                    <br />
                                                    <Button style={{margin:'0 auto', width:'35%', display:'block'}} onClick={this.chat} variant="success" type="submit">
                                                        Send </Button>
                                                </Form>
                                            </Col>
                                            {/* <Col lg={1}></Col> */}
                                        </Row>
                                    </Modal.Body>
                                </Modal>


                                <br />
                                {this.state.token.id === this.props.match.params.id ? <Button onClick={() => this.setState({ inboxShow: true })} style={{ margin: '15px auto', width: '150px' }} block variant="warning"><Icon name="envelope"></Icon>Inbox</Button> : this.state.token.id ? <div style={{ margin: '0 auto' }}><Button onClick={this.follow} style={{ margin: '15px auto', width: '150px' }} variant="primary"><Icon name="add user"></Icon> Follow</Button><div style={{ marginLeft: '50px', display: 'inline-block' }}></div>
                                    <Button onClick={() => this.setState({ inboxShow: true })} style={{ margin: '15px auto', width: '150px' }} variant="warning"><Icon name="envelope"></Icon>Message</Button></div>
                                    : null}
                            </Row>
                        </Col>
                        <Col sm={1}></Col>
                    </Row>
                    <br />
                    <Container>
                        <h4>Description:</h4>
                        {this.state.loading === true ? <div><Loader content='Loading' active inline='centered' /></div> : null}
                        <p>{this.state.data.description}</p>
                    </Container>
                    <br /><br />
                    <Tabs defaultActiveKey="posts" id="uncontrolled-tab-example">
                        <Tab eventKey="posts" title="Posts">
                            <br />

                            <Item.Group>
                                {this.state.data.posts !== undefined ? this.state.data.posts.map((post) => {
                                    return <Item>
                                        <Item.Image size='tiny' src={post.postimages[0]} />

                                        <Item.Content>
                                            <Item.Header href={"/post/" + post._id} as='a'>{post.title}</Item.Header>
                                            <Item.Meta>{post.description}</Item.Meta>
                                            <Item.Description>
                                                comments({post.comments.length})
                                        </Item.Description>
                                            <Item.Extra>{post.createdAt.slice(0, -14)}</Item.Extra>
                                        </Item.Content>
                                    </Item>
                                }) : null}
                            </Item.Group>
                        </Tab>
                        {this.state.token.id === this.props.match.params.id ?
                        <Tab eventKey="orders" title="Previous Orders">
                            <br />

                            
                        </Tab>:null}
                        <Tab eventKey="ratings" title="Reviews">
                            <br />
                            <h1>Ratings and comments</h1>
                        </Tab>
                        {this.state.token.id === this.props.match.params.id ?
                        <Tab eventKey="following" title="Following">
                            <br />
                            <h1>Followings:</h1>

                            <h1>Followers:</h1>
                        </Tab>:null}
                        {this.state.token.id === this.props.match.params.id ?
                        <Tab eventKey="watchlater" title="Watch list">
                            <br />

                            <Item.Group>
                                {this.state.data.watchlater !== undefined ? this.state.data.watchlater.map((post) => {
                                    return <Item>
                                        <Item.Image size='tiny' src={post.postimages[0]} />

                                        <Item.Content>
                                            <Item.Header href={"/post/" + post._id} as='a'>{post.title}</Item.Header>
                                            <Item.Meta>{post.description}</Item.Meta>
                                            <Item.Description>
                                                {/* comments({post.comments.length}) */}
            </Item.Description>
                                            {/* <Item.Extra>{post.createdAt.slice(0, -14)}</Item.Extra> */}
                                        </Item.Content>
                                    </Item>
                                }) : null}
                            </Item.Group>
                        </Tab>:null}
                    </Tabs>
                    <br /><br /><br /><br /><br /><br /><br /><br /><br />
                </Container>
                <br />

                <br />
                {this.state.token.isadmin === true ? <Container>
                    <Row>
                        <Col>
                            <Button style={{ float: 'left', width: '150px', marginLeft: '30%' }} inline-block variant="success">Verify User</Button>
                        </Col>
                        <Col><Button style={{ float: 'right', width: '150px', marginRight: '30%' }} inline-block variant="danger">Delete User</Button></Col>
                    </Row>
                </Container> : null}
                <br /><br />
                <br /><br /><br />
                <br />
            </div>
        )
    }
}
