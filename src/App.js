import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css'
import Testing from './components/Testing/Testing'
import ProfilePage from './components/ProfilePage/ProfilePage'
import PostReady from './components/PostPage/PostReady'
import CreatePost from './components/PostPage/CreatePost'
import HomePage from './components/HomePage/HomePage'
import SignIn from './components/SignIn/SignIn'
import SignUp from './components/SignUp/SignUp'
import NavBar from './components/NavBar/NavBar'
import Footer from './components/Footer/Footer'
import Terms from './components/AboutUs/Terms'
import Approve from './components/HomePage/Approve'
import Startpage from './components/Startpage';
import Page404 from './components/Page404/Page404'
import Home from './Home'
import { Provider } from 'react-redux'
import configureStore from './store/store'

const store = configureStore()

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="body">
        <Router>
          <NavBar/>
          <Switch>

          <Route
            
            path="/test"
            render={props => (
              <Home
                {...props}
              />
            )}
        />
        <Route
            
            path="/home"
            render={props => (
              <HomePage
                {...props}
              />
            )}
        />
        <Route
            
            path="/profile/:id"
            render={props => (
              <ProfilePage 
                
                {...props}
              />
            )}
        />
        <Route
            exact
            path="/"
            render={props => (
              <Startpage
                
                {...props}
              />
            )}
        />
        <Route
            
            path="/post/:id"
            render={props => (
              <PostReady 
                
                {...props}
              />
            )}
        />
        <Route
            
            path="/approve"
            render={props => (
              <Approve
                {...props}
              />
            )}
        />
        <Route
            
            path="/terms"
            render={props => (
              <Terms 
                
                {...props}
              />
            )}
        />
        <Route
            
            path="/post"
            render={props => (
              <PostReady
                {...props}
              />
            )}
        />
        <Route
            
            path="/create"
            render={props => (
              <CreatePost
                {...props}
              />
            )}
        />
         <Route
        exact
        path="/login"
        render={props => (
          <SignIn
            {...props}
            />
            )}
        />
        <Route
            
            path="/register"
            render={props => (
              <SignUp
                {...props}
              />
            )}
        />
<Route component={Page404}/>
     </Switch>
     
    
         
        <Footer/>
      </Router> 
      </div>
      </Provider>
    )
  }
}

