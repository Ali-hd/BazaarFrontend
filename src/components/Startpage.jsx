import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
export default class Startpage extends Component {

    render() {
        return (
            <div>
                    <Redirect to='/home'/>
            </div>
        )
    }
}
