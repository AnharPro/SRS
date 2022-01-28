import React, { Component } from "react";
import './FooterStyle.css';

class Footer extends Component{
    constructor(props){
        super(props);
        this.state={};
    }

    render(){
        return(
            <div className='footerpage'>
                <p className='copyrt'>Copyright © 2018 AnharCo. All rights reserved.</p>
                <p className='vers'>Version 2.0.0 </p>
            </div>
        )
    }
}

export default Footer;