import React, { Component } from "react";
import { connect } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './TopTabStyle.css';
import * as urls from '../../constants/URL';
import { withRouter } from "react-router-dom";
import moment from 'moment';
import axios from 'axios';
import av from "../../Images/avatar1.png";
import Avatar from "react-avatar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changeRequestParameter } from '../../actions';
import RingLoader from "react-spinners/RingLoader";
import { css } from "@emotion/core";
const signalR = require("@aspnet/signalr");

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class TopTab extends Component{
    constructor(props){
        super(props);
        this.state={
            BranchID: null,
            UserBranchList: [
                {
                    BranchID: 0,
                    BranchName: ""
                }
            ],
            BrDropDownVisible:false,
            NotificationInfo: {
                Count: 0,
                Notifications: []
            },
            showNotifications: false,
            Token: '',
            UserName: '',
            showUserDropDn: '',
            AuthLvl: '',
            ShowToast1: 0,
            ShowToast2: 0
        };
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.setWrapperRef1 = this.setWrapperRef1.bind(this);
        this.setWrapperRef2 = this.setWrapperRef2.bind(this);
        this.EllipsisClicked = this.EllipsisClicked.bind(this);
        this.BranchChanged = this.BranchChanged.bind(this);
        this.getUserAssignedBranches = this.getUserAssignedBranches.bind(this);
        this.OpenCloseBranches = this.OpenCloseBranches.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.fetchNotifications = this.fetchNotifications.bind(this);
        this.showNotificationsDrop = this.showNotificationsDrop.bind(this);
        this.resetNotificationsCount = this.resetNotificationsCount.bind(this);
        this.seeAllNotifs = this.seeAllNotifs.bind(this);
        this.NotificationClicked = this.NotificationClicked.bind(this);
        this.showUserDropDown = this.showUserDropDown.bind(this);
        this.LogUserOut = this.LogUserOut.bind(this);
        this.showToast = this.showToast.bind(this);
    }
    
    showToast(Msg){
      //alert(Msg);
      //ToastStore.success(Msg, 2000, "TechsToastCont");
      toast.success(Msg, {
          position: toast.POSITION.TOP_CENTER
        });
    }

    LogUserOut(){
      //localStorage.removeItem('state')
      localStorage.clear();
      sessionStorage.removeItem('state');
      sessionStorage.clear();
      this.props.history.push("/");
    }

    showUserDropDown(){
      this.setState({
        showUserDropDn: !this.state.showUserDropDn
      })
    }

    NotificationClicked(OrderID, TestID){
      this.setState({
        showNotifications: false
      }, ()=>{
        this.props.onChangeReqParam(OrderID, 'CHANGE_ORDERID');
        this.props.onChangeReqParam(String(TestID), 'CHANGE_TESTID');
        this.props.history.push("/worklist");
      })
    }

    seeAllNotifs(){
      this.setState({
        showNotifications: false
      }, ()=>{
        this.props.history.push('/notifications')
      })
    }

    resetNotificationsCount(){
        const BranchID = this.props.BranchID;
        const mom = '?a=' + moment();
        const url = `${urls.URL}NotificationWebService.svc/ResetUserNewItemsCount${mom}`;
        const resetparams = {
            branchID: BranchID,
            type: 1
          };
        axios({
            method: "post",
            url: url,
            data: JSON.stringify(resetparams),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              auth_Token: this.props.UserToken
            },
            withCredentials: true
        })
        .then(response => {
            if (response.data) {
              const responseJson = response.data.ResetUserNewItemsCountResult;
              if (responseJson.HasError) {
              } else {
                let NotificationInfo = Object.assign({}, this.state.NotificationInfo);
                NotificationInfo.Count = 0;
                const Notifications={
                  Notifs:NotificationInfo
                }
                this.setState({NotificationInfo}, ()=>{
                  this.props.saveNotifications(Notifications, 'SAVE_NOTIFICATIONS')
                })
              }
              //const currpage = this.state.currentPage;
            }
          })
          .catch(error => {
            this.setState({ errorLoginTxt: "Login failed." });
          });
    }

    showNotificationsDrop(){
        this.setState({
            showNotifications: !this.state.showNotifications
        }, ()=>{
            if(this.state.showNotifications){
            this.resetNotificationsCount();
          }
        })
    }

    fetchNotifications(ShouldshowToast){
        const BranchID = this.props.BranchID;
        const mom = '?a=' + moment();
        const url = `${urls.URL}NotificationWebService.svc/GetUserNotifications/${BranchID}${mom}`;
        if(true)
        {axios({
            method: "get",
            url: url,
            //data: JSON.stringify(params),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              auth_Token: this.props.UserToken
            },
            withCredentials: true
          })
          .then(response => {
            if (response.data) {
              var responseJson = response.data;
              if (responseJson.HasError) {
                //const Msg = responseJson.ServiceError.Message;
              } else {
                  let NotificationInfo = responseJson.NotificationInfo;
                  const Notifications={
                    Notifs:NotificationInfo
                }
                this.props.saveNotifications(Notifications, 'SAVE_NOTIFICATIONS')
                if(this.state.ShowToast1 !== this.state.ShowToast2){
                  const notif = Notifications.Notifs.Notifications[0];
                  var newMsg = notif.Message.split('{DoctorName}');
                  var pel = newMsg[0] +  notif.DoctorName  + newMsg[1];
                  newMsg = pel.split('{PatientName}');
                  var pel = newMsg[0]  + notif.PatientName;
                  this.setState({
                    ShowToast2: this.state.ShowToast1
                  },()=>{
                    this.showToast(pel)
                  })
                }
              }
            }
          })
          .catch(error => {});}
    }

    BranchChanged(BranchID, BranchName){
      let Permissions = this.props.UserAuthInfo.Permissions;
          let Perms = {
            RegOpen : false,
            ExOpen : false,
            RepOpen : false,
            AppOpen : false,
          }
          if(this.props.UserAuthInfo.IsITUser){
            Perms.RegOpen = true;
            Perms.ExOpen = true;
            Perms.RepOpen = true;
            Perms.AppOpen = true;
          }else{
          for(var i=0; i<Permissions.length; i++){
            if(Permissions[i].BranchID.toString() === BranchID.toString()){
              if(Permissions[i].ID === "Registered" && Permissions[i].IsGranted){
                Perms.RegOpen = true;
              }
              if(Permissions[i].ID === "Examined" && Permissions[i].IsGranted){
                Perms.ExOpen = true;
              }
              if(Permissions[i].ID === "Reported" && Permissions[i].IsGranted){
                Perms.RepOpen = true;
              }
              if(Permissions[i].ID === "Approved" && Permissions[i].IsGranted){
                Perms.AppOpen = true;
              }
            }
          }
        }
          this.props.changeBrPermissions(Perms, 'UPDATE_PERMISSIONS')
        this.props.onBranchChanged(this.props.Branches, BranchID, BranchName);
        this.setState({
          BranchID
        },()=>{
          this.fetchNotifications(true);
        })
        
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
          this.setState({BrDropDownVisible: false});
        } 
        if (this.wrapperRef1 && !this.wrapperRef1.contains(event.target)) {
            this.setState({showNotifications: false});
          }
        if (this.wrapperRef2 && !this.wrapperRef2.contains(event.target)) {
            this.setState({showUserDropDn: false});
          }
        /*else if(this.wrapperRef1 && !this.wrapperRef1.contains(event.target)){
          this.setState({PrintADDOpen: false});
        }*/
    }

    OpenCloseBranches(){
        this.setState({
            BrDropDownVisible: !this.state.BrDropDownVisible
        });
    }

    getUserAssignedBranches(){
        const mom = '?a=' + moment();
        const url = `${urls.URL}SecurityWebService.svc/GetUserAssignedBranches${mom}`;
        axios({
            method: "get",
            url: url,
            //data: JSON.stringify(params),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              auth_Token: this.props.UserToken
            },
            withCredentials: true
          })
          .then(response => {
            if (response.data) {
              var responseJson = response.data;
              if (responseJson.HasError) {
                //const Msg = responseJson.ServiceError.Message;
              } else {
                  let UserBranchList = Object.assign({}, this.state.UserBranchList);
                  var Branches = responseJson.UserBranchList;
                  if(Branches.length === 0){
                    Branches = UserBranchList;
                  }
                  this.setState({
                    UserBranchList: Branches
                  }, ()=>{
                    this.props.onBranchChanged(Branches[0].BranchID, Branches[0].BranchName);
                  })
              }
            }
          })
          .catch(error => {});
    }

    EllipsisClicked(){
      if(!this.props.isClickOut){
        this.props.onEllipsisClick(!this.props.visible, false);
      }else{
        this.props.onEllipsisClick(this.props.visible, false);
      }
    }

    componentDidMount(){
        document.addEventListener('mousedown', this.handleClickOutside);

        let connection = new signalR.HubConnectionBuilder()
        .withUrl(`${urls.PUSHNOTIFIP}/pushNotificationHub`)
        .build();
        connection.on("pushReleaseRadTestNotification", toastTimeOut => {
          this.setState({
            ShowToast1: this.state.ShowToast1 + 1
          },()=>{
            this.fetchNotifications(true);
          })
        });
  
        connection
            .start()
            .then()
                .catch(err => {
             //const f = 3;
             alert("Error while establishing connection :(");
            });

        //this.fetchNotifications();
        //this.getUserAssignedBranches();
        var AuthLvl = '';
        var UserAuthInfo = this.props.UserAuthInfo;
        for(var i=0; i<UserAuthInfo.Applications.length; i++){
          if(UserAuthInfo.Applications[i].ID === 3){
            if(UserAuthInfo.IsITUser){
              AuthLvl = 'IT User';
            }else if(parseInt(UserAuthInfo.Applications[i].Authorities, 10) === 2){
              AuthLvl = 'Admin';
            }else if(parseInt(UserAuthInfo.Applications[i].Authorities, 10) === 1){
              AuthLvl = 'Normal';
            }
          }
        }
        this.setState({
          UserName: UserAuthInfo.ArabicName,
          AuthLvl
        })
    }

    componentWillUnmount(){
        document.removeEventListener('mousedown', this.handleClickOutside);
      }

      setWrapperRef2(node) {
        this.wrapperRef2 = node;
      }

      setWrapperRef1(node) {
        this.wrapperRef1 = node;
      }

    setWrapperRef(node) {
        this.wrapperRef = node;
      }

      componentDidUpdate(){

        var AuthLvl = '';
        var UserAuthInfo = this.props.UserAuthInfo;
        for(var i=0; i<UserAuthInfo.Applications.length; i++){
          if(UserAuthInfo.Applications[i].ID === 3){
            if(UserAuthInfo.IsITUser){
              AuthLvl = 'IT User';
            }else if(parseInt(UserAuthInfo.Applications[i].Authorities, 10) === 2){
              AuthLvl = 'Admin';
            }else if(parseInt(UserAuthInfo.Applications[i].Authorities, 10) === 1){
              AuthLvl = 'Normal';
            }
          }
        }

        if(this.state.UserName !== UserAuthInfo.ArabicName || this.state.AuthLvl !== AuthLvl){
          this.setState({
            UserName: UserAuthInfo.ArabicName,
            AuthLvl
          })
        }


        if(this.props.UserToken !== this.state.Token){
          this.setState({
            Token: this.props.UserToken,
            BranchID: this.props.BranchID
          },()=>{
            this.fetchNotifications(true);
          })
        }
        if(this.props.Notifications !== this.state.NotificationInfo){
          this.setState({
            NotificationInfo: this.props.Notifications
          })
        }
        if(this.state.UserBranchList !== this.props.Branches){
          let Permissions = this.props.UserAuthInfo.Permissions;
          let Perms = {
            RegOpen : false,
            ExOpen : false,
            RepOpen : false,
            AppOpen : false,
          }
          if(this.props.UserAuthInfo.IsITUser){
            Perms.RegOpen = true;
            Perms.ExOpen = true;
            Perms.RepOpen = true;
            Perms.AppOpen = true;
          }else{
          for(var i=0; i<Permissions.length; i++){
            if(parseInt(Permissions[i].BranchID, 10) === parseInt(this.props.BranchID)){
              if(Permissions[i].ID === "Registered" && Permissions[i].IsGranted){
                Perms.RegOpen = true;
              }
              if(Permissions[i].ID === "Examined" && Permissions[i].IsGranted){
                Perms.ExOpen = true;
              }
              if(Permissions[i].ID === "Reported" && Permissions[i].IsGranted){
                Perms.RepOpen = true;
              }
              if(Permissions[i].ID === "Approved" && Permissions[i].IsGranted){
                Perms.AppOpen = true;
              }
            }
          }
        }
          this.props.changeBrPermissions(Perms, 'UPDATE_PERMISSIONS')
          this.setState({
            UserBranchList: this.props.Branches
          },()=>{
            this.fetchNotifications(true);
          })
        }
      }

    render(){
        const len = this.state.UserBranchList.length;
        const {NotificationInfo,
            showNotifications,
            UserName,
            AuthLvl,
            showUserDropDn} = this.state;
        return(
            <div className='TopTabEl noselect'>
              
        {this.props.showLoader ? <div className='Loader'>
          <div className='LoaderCont'>
            <RingLoader
              css={override}
              size={150}
              color={"#123abc"}
              loading={this.props.showLoader}
            />
          </div>
        </div> : null}
            <ToastContainer
            autoClose={5000}
            hideProgressBar
            pauseOnVisibilityChange={false}
            closeButton={false}
            className='TechsToastCls'
            toastClassName='TechsToastCont'
            progressClassName='TechsToastProgCont'
            />
                {false ? <div className="TopTabEllipsis noselect" role='button' onClick={this.EllipsisClicked}>
          {" "}
          <FontAwesomeIcon icon="ellipsis-v" size="1x" />
        </div> : null}

        <div className="TopTabLbl noselect" role='button' onClick={this.EllipsisClicked}>
          {" "}
          <FontAwesomeIcon icon="cubes" size="2x" /> <span className='spsss'>S.R.S</span>
        </div>

        {<div className='LocationsContainer' role='button' onClick={this.OpenCloseBranches} ref={this.setWrapperRef}>
            {this.props.BranchName}
            {this.state.BrDropDownVisible ? 
            <div className='BranchesDropDown'>
                {this.state.UserBranchList.map((opt, index)=>(
                    <BranchesDropDn 
                    key={index}
                    ind={index}
                    Branch={opt}
                    len={len}
                    BranchChanged={this.BranchChanged}/>
                ))}
            </div> : null}
        </div>}
        <div className='NotificationsDropDn' ref={this.setWrapperRef1}>
        <p
            className="NotifsBell"
            role="button"
            onClick={this.showNotificationsDrop}
          >
            <FontAwesomeIcon
              icon="bell"
              size="2x"
              color="white"
              type="regular"
            />{" "}
            {NotificationInfo.Count ? (
              <span className="NotificationNumber">
                {NotificationInfo.Count}
              </span>
            ) : null}
          </p>
          {showNotifications ? (
            <div className="NotifsDropDn">
            <div className='NotifsListHeader'>
              <div className='arrow-up' />
              Your Notifications
            </div>
              <div className="notificationsList">
                {NotificationInfo.Notifications.map((Notif, index) => (
                  <NotificationRow
                    key={index}
                    Notif={Notif}
                    NotificationClicked={this.NotificationClicked}
                    RefreshNotifsLst={this.fetchNotifications}
                    UserToken={this.props.UserToken}
                  />
                ))}
              </div>
              <div
                className="showAllNotifs"
                role="button"
                onClick={this.seeAllNotifs}
              >
                See All Notifications
              </div>
            </div>
          ) : null}
                </div>

          <div className='avatar' role='button' onClick={this.showUserDropDown} ref={this.setWrapperRef2}>
            <div className='Logo'/>
            {showUserDropDn ? <div className='UserNameDropDn'>
                  <div className='UserName'>{UserName}</div>
                  <div className='UserName'>{AuthLvl}</div>
                  <div className='LogOut' role='button' onClick={this.LogUserOut}>LogOut</div>
            </div> : null}
          </div>
            </div>
        )
    }
}

class BranchesDropDn extends Component{
    constructor(props){
        super(props);
        this.state={};
        this.BrancheChanged = this.BrancheChanged.bind(this);
    }

    BrancheChanged(){
        this.props.BranchChanged(this.props.Branch.ID, this.props.Branch.EnglishName);
    }

    render(){
        const {Branch = {}, 
            len = 0, 
            ind = 0} = this.props || '';
        return(
                <div> 
                    <div className='BranchesDivs' role='button' onClick={this.BrancheChanged}>
                    {Branch.EnglishName}
                        </div>
                        {ind !== len - 1 ? 
                        <div className='separator' /> : null}
                    </div>
        )
    }
}

class NotificationRow extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.NotifClicked = this.NotifClicked.bind(this);
    }
  
    NotifClicked() {
      const mom = '?a=' + moment();
      const OrderId = this.props.Notif.OrderID;
      const notificationID = this.props.Notif.NotificationID;
      const TestID = this.props.Notif.RadTestID;
      const dat = {
        notificationID: notificationID
      };
      const desturl =`${urls.URL}NotificationWebService.svc/SetUserNotificationRead${mom}`;
      if (!this.props.Notif.IsRead) {
        axios({
          method: "post",
          url: desturl,
          data: JSON.stringify(dat),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            auth_Token: this.props.UserToken
          },
          withCredentials: true
        })
          .then(response => {
            if (response.data) {
              const responseJson = response.data;
              if (responseJson.HasError) {
              } else {
                this.props.RefreshNotifsLst();
              }
            }
          })
          .catch(error => {
            this.setState({ errorLoginTxt: "Login failed." });
          });
      }
      this.props.NotificationClicked(OrderId, TestID);
    }
  
    render() {
      const {
        IsRead = "",
        DoctorName = '',
        Message = "",
        PatientName=""
      } = this.props.Notif || {};
      var newMsg = Message.split('{DoctorName}');
      var pel = newMsg[0] + '<span/>' + DoctorName + '<span/>' + newMsg[1];
      newMsg = pel.split('{PatientName}');
      var pel = newMsg[0] + '<span/>' + PatientName + '<span>&nbsp;</span>' + newMsg[1];
      var classN = "NotifRowDrop";
      if (!IsRead) {
        classN = classN + ' unread';
      }
      return (
        <div className={classN} role="button" onClick={this.NotifClicked}>
          <div
            className="NotifRowMsg"
            dangerouslySetInnerHTML={{ __html: pel }}
          />
        </div>
      );
    }
  }

  
  const mapDispatchToProps = (dispatch) => ({
    onChangeReqParam: (Parameter, Type) => dispatch(changeRequestParameter(Parameter, Type))
  })

const mapStateToProps = state => ({
  })

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(TopTab))
