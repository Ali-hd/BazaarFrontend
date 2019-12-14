import React, { Component } from 'react'
import './App.css'
import Testing from './components/Testing/Testing'
import ProfilePage from './components/ProfilePage/ProfilePage'
import PostReady from './components/PostPage/PostReady'


export default class App extends Component {
  render() {
    return (
      <div className="body">
        <ProfilePage/>
      </div>
    )
  }
}
