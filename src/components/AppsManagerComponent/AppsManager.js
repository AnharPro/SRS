import React, { Component } from "react";
import './AppsManagerStyle.css';

class AppsManager extends Component{
    constructor(props){
        super(props);
        this.state={};
      this.setWrapperRef = this.setWrapperRef.bind(this);
      this.handleClickOutside = this.handleClickOutside.bind(this);
    }
  
    componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside);
    }
  
    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
      this.wrapperRef = node;
    }

    handleClickOutside(event) {
      if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
        this.props.onEllipsisClick(false, true);
      }
    }


    render(){
        if(this.props.visible){
        return(
            <div className='appsManager' ref={this.setWrapperRef}>
            <div class='row'>
                {this.props.apps.map((opt, index) =>(
                    <div className='col-md-4 col-xs-4'>
                        <div class="parent">
                            <a href={opt.Url}  target="_blank">
                                <img src={opt.IconUrl}></img>
                                <h6>{opt.EnglishName}</h6>
                            </a>
                        </div>
                    </div>        
                ))}
          
        </div>
        </div>

        )}else{
            return null
        }
    }
}

export default AppsManager;