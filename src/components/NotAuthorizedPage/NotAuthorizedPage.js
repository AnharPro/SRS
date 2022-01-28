import React, { Component } from "react";
import './NotAuthorizedPageStyle.css';
import { withRouter } from "react-router-dom";

class NotAuthorizedPage extends Component{
    constructor(props){
        super(props);
        this.state={};
    }

    render(){
        return(
            <div className='NotAuthorized'>You Are Not Authorized To Have Access To This Page</div>
        )
    }
}

export default NotAuthorizedPage;