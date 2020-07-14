import React, { Component } from 'react'
import { Menu, Icon, Button, Dropdown } from 'semantic-ui-react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { connect } from "react-redux";
import { loadUser } from "../../actions";
import { Link } from "react-router-dom";

class NavBar extends Component {
    state = {
        session: false,
        token: '',
        user:'',
        loading:true,
        userdata:[]
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    logout = () => {
        localStorage.removeItem("usertoken");
        window.location.replace("/home");
    }

    componentDidMount = () => {
        if(this.props.user.tokenuser==""){
            this.props.loadUser()
        }
         

        let self = this;

        jwt.verify(localStorage.usertoken, 'secret', function (err, decoded) {
            if (err) {
                self.setState({ session: false })
            } else {
                var decoded = jwt.verify(localStorage.usertoken, 'secret')
                self.setState({ session: true,token: decoded })
            }
        });
    }
    
    render() {
       if(this.props.user.firstname && this.state.loading){
           this.setState({userdata:this.props.user, loading:false})
           
       }else if(this.props.error=='session expired'){
        //    alert("session expired please login again")
        //    this.setState({session:false})
       }
        const { activeItem } = this.state

        return (
            <div style={{ backgroundColor: '#1B1C1D' }}>
                <Navbar collapseOnSelect expand="lg">
                    <Navbar.Brand id="nav-brandd" style={{ color: 'white', fontWeight: '600' }}><Link style={{textDecoration:'none', color: 'inherit'}} to="/home" title="Home"><Icon name='handshake outline' /> OPEN BAZAAR </Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav style={{ marginTop: '5px', marginBottom: '5px', width: '100%' }} className="mr-auto">
                            <Menu inverted pointing secondary id='menuu-navv'>

                            <Link style={{textDecoration:'none', color: 'inherit'}} to="/home" title="Go to Home">
                                <Menu.Item style={{ marginTop: '4px' }}
                                    link
                                    name='home'
                                    active={activeItem === 'home'}
                                    onClick={this.handleItemClick}
                                />
                                </Link>
                                <Link style={{textDecoration:'none', color: 'inherit'}} to="/create" title="Create a Post">
                                 <Menu.Item style={{ marginTop: '4px' }}
                                    name='Sell'
                                    active={activeItem === 'create'}
                                    onClick={this.handleItemClick}
                                />
                                </Link>
                                <Menu.Item
                                    name='About Us'
                                    style={{ marginBottom: '2px' }}
                                >
                                    <Dropdown id="dropdown-categ"
                                        onClick={this.handleItemClick}
                                        active={activeItem === 'categories'}
                                        text='About Us'
                                        floating
                                        labeled
                                        search
                                    >
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="/terms">Terms and Conditions</Dropdown.Item>
                                            <Dropdown.Item>Contact information</Dropdown.Item>
                                            <Dropdown.Item>How to use</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Menu.Item>
                                <Menu.Menu position='right'>
                                    {this.state.session ?
                                        <Menu.Item>
                                            <Dropdown
                                                text='My Account'
                                                icon='user circle'
                                                floating
                                                labeled
                                                button
                                                className='icon'
                                            >
                                                {this.props.isLoading===false?
                                                <Dropdown.Menu>
                                                    <Dropdown.Header icon='user' content={this.props.user.tokenuser} />
                                                    <Dropdown.Item as={Link} to={"/profile/" + `${this.props.user.id}`}>Profile</Dropdown.Item>
                                                    <Dropdown.Item as={Link} to={"/profile/" + `${this.props.user.id}`}>Inbox</Dropdown.Item>
                                                    {this.props.user.admin === true ?
                                                    <Dropdown.Item as={Link} to="/approve"><strong>Approve posts</strong></Dropdown.Item>:null}
                                                    <Dropdown.Item>Request verification</Dropdown.Item>
                                                    <Dropdown.Item onClick={this.logout}>Log-out</Dropdown.Item>
                                                </Dropdown.Menu>:<Dropdown.Menu>
                                                <Dropdown.Header icon='user' content=' Loading...' />
                                                    </Dropdown.Menu>}
                                            </Dropdown>
                                        </Menu.Item> : <Menu.Item style={{ marginRight: '-15px' }}>
                                            <Button style={{ marginRight: '5px' }} id="nav-signupp" primary><Link style={{textDecoration:'none', color: 'inherit'}} to="/register">Sign-up</Link></Button>
                                            <Button id="nav-signinn"><Link style={{textDecoration:'none', color: 'inherit'}} to="/login" >Log-in</Link></Button>
                                        </Menu.Item>
                                    }
                                </Menu.Menu>
                            </Menu>

                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}
const mapStateToProps = ({ isLoading, user, error }) => ({
    isLoading,
    user,
    error, 
 });

 const mapDispatchToProps = dispatch => ({
    loadUser: (pageid) => dispatch(loadUser(pageid)),
  })

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
