import React, { Component } from "react";
import { connect } from 'react-redux';
import * as urls from '../../constants/URL';
import moment from 'moment';
import axios from "axios";
import { withRouter } from "react-router-dom";
import { saveUserAuthenticationInfo, changeSelectedUserBranch } from '../../actions';
//import * as urls from "../../constants/URL";

class MainPage extends Component{
    constructor(props){
        super(props);
        this.state={
          showNotAuthorizedMessage: false
        };
        this.getUserAuthenticationInfo = this.getUserAuthenticationInfo.bind(this);
    }

    getUserAuthenticationInfo(){
        //const mom = "?a=" + moment();
        const url = `${urls.SECURL}SecurityWebService.svc/UserAuthenticate`;
        //const s = sessionStorage.getItem('state');
        //alert(s)
        if(sessionStorage.getItem('state') === null){
        axios({
            method: "post",
            url: url,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            withCredentials: true
          }).then(response => {
            if (response.data) {
              var responseJson = response.data;
              if (responseJson.HasError) {
                //const Msg = responseJson.ServiceError.Message;
              } else {
                  const PrimUserAuthenticationInfo = responseJson.UserAuthenticationInfo;
                  let UserAuthenticationInfo = this.props.UserAuthenticationInfo;
                  UserAuthenticationInfo.Applications = PrimUserAuthenticationInfo.Applications;
                  UserAuthenticationInfo.ArabicName = PrimUserAuthenticationInfo.ArabicName;
                  UserAuthenticationInfo.AuthenticationToken = PrimUserAuthenticationInfo.AuthenticationToken;
                  UserAuthenticationInfo.Branches = PrimUserAuthenticationInfo.Branches;
                  UserAuthenticationInfo.Culture = PrimUserAuthenticationInfo.Culture;
                  UserAuthenticationInfo.EnglishName = PrimUserAuthenticationInfo.EnglishName;
                  UserAuthenticationInfo.ExpiryDateTime = PrimUserAuthenticationInfo.ExpiryDateTime;
                  UserAuthenticationInfo.ITUserIconUrl = PrimUserAuthenticationInfo.ITUserIconUrl;
                  UserAuthenticationInfo.IsITUser = PrimUserAuthenticationInfo.IsITUser;
                  var SelectedApp = -1;
                  for(var j=0; j<PrimUserAuthenticationInfo.Applications.length; j++){
                    if(PrimUserAuthenticationInfo.Applications[j].ID === 3){
                      SelectedApp = j;
                    }
                  }
                  if(SelectedApp === -1){
                    this.props.history.push("/notauthorizedpage");
                  }else{
                  UserAuthenticationInfo.SelectedApplication = SelectedApp;
                  UserAuthenticationInfo.Permissions = PrimUserAuthenticationInfo.Applications[SelectedApp].Permissions;
                  var BrID = null;
                  var BrName = '';
                  if(UserAuthenticationInfo.Branches.length === 1){
                    BrID = UserAuthenticationInfo.Branches[0].ID;
                    BrName = UserAuthenticationInfo.Branches[0].EnglishName;
                  }else{
                  for(var i=0; i<UserAuthenticationInfo.Branches.length; i++){
                      if(UserAuthenticationInfo.Branches[i].IsDefault){
                        BrID = UserAuthenticationInfo.Branches[i].ID;
                        BrName = UserAuthenticationInfo.Branches[i].EnglishName;
                      }
                      
                  }}
                  if(this.props.UserAuthenticationInfo.AuthenticationToken === null || this.props.UserAuthenticationInfo.AuthenticationToken === ''){
                    this.setState({
                      showNotAuthorizedMessage: true
                    })
                }else{
                  this.props.saveUserAuthenticationInfo(UserAuthenticationInfo, 'SAVE_AUTHENTICATIONINFO');
                  this.props.onBranchChanged(UserAuthenticationInfo.Branches, BrID, BrName, 'SAVE_BRANCHES');
                  this.props.history.push("/dashboard");}
              }
            }
            }
          })
          .catch(error => {
            const l=2;
          });
        }else{
              var SelectedApp = 0;
              for(var j=0; j<this.props.UserAuthenticationInfo.Applications.length; j++){
                    if(this.props.UserAuthenticationInfo.Applications[j].ID === 3){
                      SelectedApp = j;
                    }
                  }
                  if(SelectedApp === 0){
                    this.props.history.push("/notauthorizedpage");
                  }else{
          if(this.props.UserToken === null || this.props.UserToken === ''){
            this.setState({
              showNotAuthorizedMessage: true
            })
        }else{
          this.props.history.push("/dashboard");}
        }}
    }

    componentDidMount(){
        this.getUserAuthenticationInfo();
    }


    render(){
        return(
            <div>
              {this.state.showNotAuthorizedMessage ? <div className='MainPageStyle'><div>You are not authorized to access Smart Radiology Solution!</div>
              <div>Please Contact Your Administrator For Support.</div></div> : null}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    UserAuthenticationInfo: state.UserAuthenticationInfo.AuthenticationInfo
  })
  
const mapDispatchToProps = (dispatch) => ({
    saveUserAuthenticationInfo: (Parameter, Type) => dispatch(saveUserAuthenticationInfo(Parameter, Type)),
    onBranchChanged: (Branches, BranchID, BranchName, Type) => dispatch(changeSelectedUserBranch(Branches, BranchID, BranchName, Type)),
  })

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(MainPage))