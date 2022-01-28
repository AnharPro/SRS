import React, { Component } from "react";
import "./NotificationsPageStyle.css";
import { connect } from 'react-redux';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import { saveNotifications, changeRequestParameter, showHideLoader } from '../../actions';
import * as urls from '../../constants/URL';

class NotificationsPage extends Component{
    constructor(props){
        super();
        this.state={
            Loading:true,
            NotificationDetailedList:[],
            HasMore:false,
            HasMoreText:'',
            page: 1,
            BranchID:0
        };
        this.getNotifications = this.getNotifications.bind(this);
        this.GotoWLSingleOrder = this.GotoWLSingleOrder.bind(this);
        this.LoadMoreNotifs = this.LoadMoreNotifs.bind(this);
        this.refreshDropDnList = this.refreshDropDnList.bind(this);
        this.gotoDashboard = this.gotoDashboard.bind(this);
    }

    gotoDashboard(){
        this.props.history.push('/dashboard')
      }

    refreshDropDnList(){
        const BranchID = this.props.BranchID;
        const mom = '?a=' + moment();
        const url = `${urls.URL}NotificationWebService.svc/GetUserNotifications/${BranchID}${mom}`;
        this.props.showHideLoader(true, 'SHOW_HIDE');
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
                  let NotificationInfo = responseJson.NotificationInfo;
                  const Notifications={
                    Notifs:NotificationInfo
                }
                this.props.saveNotifications(Notifications, 'SAVE_NOTIFICATIONS');
                this.props.showHideLoader(false, 'SHOW_HIDE');
              }
            }
          })
          .catch(error => {});
    }

    LoadMoreNotifs(){
        const page = parseInt(this.state.page, 10) + 1;
        this.setState({page, Loading: true}, ()=>{
            this.getNotifications();
        })
    }

    GotoWLSingleOrder(OrderID, TestID){
        this.props.onChangeReqParam(OrderID, 'CHANGE_ORDERID');
        this.props.onChangeReqParam(String(TestID), 'CHANGE_TESTID');
        this.props.history.push("/worklist");
    }

    getNotifications(){
        const page  = this.state.page;
        const BRID = this.props.BranchID;
        const mom = '?a=' + moment();
        const url = `${urls.URL}NotificationWebService.svc/GetUserDetailedNotifications/${BRID}/${page}${mom}`;
        this.props.showHideLoader(true, 'SHOW_HIDE');
        axios({
            method: "get",
            url:url,
            //data: JSON.stringify(dat),
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
                if (responseJson.HasError){

                }
                else{
                    const NotificationDetailedList = responseJson.NotificationDetailedInfo.NotificationsDetailed;
                    const HasMore = responseJson.NotificationDetailedInfo.HasMore;
                    const HasMoreText = responseJson.NotificationDetailedInfo.HasMoreText;
                    this.setState({ Loading:false, 
                      NotificationDetailedList, 
                      HasMore, 
                      HasMoreText }, ()=>{
                        this.props.showHideLoader(false, 'SHOW_HIDE');
                      });
                }
                //const currpage = this.state.currentPage;
              }
            })
            .catch(error => {
              this.setState({ errorLoginTxt: "Login failed." });
            });
    }

    componentWillMount(){
        const state1 = JSON.parse(localStorage.getItem('state'));
    //const l1 = 1;
    if(this.props.UserToken === null || this.props.UserToken === ''){
      if(localStorage.getItem('state')){
        const state = state1;
        if(state.UserAuthenticationInfo.AuthenticationInfo.Applications[state.UserAuthenticationInfo.AuthenticationInfo.SelectedApplication] === 3){
          if(state.UserAuthenticationInfo.AuthenticationInfo.AuthenticationToken === null || state.UserAuthenticationInfo.AuthenticationInfo.AuthenticationToken === ''){
            this.props.history.push("/notauthorizedpage");
          }else{
            var BrID = null;
                  var BrName = '';
                  for(var i=0; i<state.UserAuthenticationInfo.Branches.length; i++){
                      if(state.UserAuthenticationInfo.Branches[i].IsDefault){
                        BrID =state. UserAuthenticationInfo.Branches[i].ID;
                        BrName = state.UserAuthenticationInfo.Branches[i].EnglishName;
                      }
                  }
                  this.props.saveUserAuthenticationInfo(state.UserAuthenticationInfo, 'SAVE_AUTHENTICATIONINFO');
                  this.props.onBranchChanged(state.UserAuthenticationInfo.Branches, BrID, BrName, 'SAVE_BRANCHES');
        }
      }
        //const l = 1;
      }else{
        //this.props.history.push("/notauthorizedpage");
      }
    }
    }

    componentDidUpdate(){
        if(this.state.BranchID !== this.props.BranchID){
            this.componentDidMount();
          }
    }

    componentDidMount(){
        this.setState({
            BranchID: this.props.BranchID
        }, ()=>{
            this.getNotifications();
        })
        
    }

    render(){
        return(
            <div className='NotificationsPage'>
             <div className='NotifsbreadCrumb'>
             <span onClick={this.gotoDashboard} className="mybreadCrumblink HomePage">
            Home{" "}
          </span> {" "}<span> {">"} Notifications </span></div>
      <div className='NotifsLargeCont'>
      <div className='NotifsGridContainer'>
      <div className='NotifsGridContainerHeader'>Notification Settings</div>
            {this.state.NotificationDetailedList.map((Notif, index) =>(
            <NotificationRow key={index}
                Notif={Notif}
                GotoWLSingleOrder = {this.GotoWLSingleOrder}
                refresh={this.getNotifications}
                refreshDropDnList={this.refreshDropDnList}/>
            ))}
            {this.state.HasMore ? <span className='moreNotifs' role='button' onClick={this.LoadMoreNotifs}>Read More</span> : null} 
      </div>
      <div className='NotifsDescCont'>
                <div className='NotifsDescHeader'>
                NOTIFICATIONS
                </div>
                <div className='notisDescContent'>
                This form helps the User to view all notifications sent by doctors regarding approval or decline of modify prescription feature. This page helps:
                <br/> <br/>
                <ul>
                    <li>
                    View All notifications  
                    </li>
                    <li>
                    View order number, patient, medication, doctor name, approval, date and time for both sent and respond time 
                    </li>
                    <li>
                    Redirects the user to the medication being approved or declined  
                    </li>
                </ul>
                </div>
            
      </div>
      </div>
            </div>
        );
    }
}

class NotificationRow extends Component{
    constructor(props){
        super(props);
        this.state={
            DoctorName:'',
            MOIID: '',
            IsRead:'',
            MessageDetailedTemplate: '',
            NotificationID: '',
            OrderID: '',
            PatientName:'',
            IsRead: false,
        };
        this.GotoWLSingleOrder = this.GotoWLSingleOrder.bind(this);
        this.markNAsRead = this.markNAsRead.bind(this);
        this.MAR = this.MAR.bind(this);
    }

    MAR(){
        this.setState({
            IsRead:true
        }, ()=>{
            this.markNAsRead(false);
        })
        
    }

    markNAsRead(shouldref){
        const notificationID = this.props.Notif.NotificationID;
        const dat = {
        notificationID: notificationID
    }
    const mom = '?a=' + moment();
    const url = `${urls.URL}NotificationWebService.svc/SetUserNotificationRead${mom}`;
      if(this.props.Notif.IsRead !== 1){
        this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "post",
      url: url,
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
              if(shouldref){
                  this.props.refresh();
              }
              this.props.showHideLoader(false, 'SHOW_HIDE');
              this.props.refreshDropDnList();
          }
        }
      })
      .catch(error => {
        this.setState({ errorLoginTxt: "Login failed." });
      });}
    }

    GotoWLSingleOrder(){
        const OrderID = this.props.Notif.OrderID;
        const TestID = this.props.Notif.RadTestID;
        this.props.GotoWLSingleOrder(OrderID, TestID);
        this.markNAsRead(false);
    }

    componentDidMount(){
        this.setState({
            DoctorName:this.props.Notif.DoctorName,
            MOIID: this.props.Notif.MOIID,
            IsRead:this.props.Notif.IsRead,
            MessageDetailedTemplate: this.props.Notif.MessageDetailedTemplate,
            NotificationID: this.props.Notif.NotificationID,
            OrderID: this.props.Notif.OrderID,
            PatientName:this.props.Notif.PatientName
        });
    }

    render(){
        var {
            DoctorName='',
            MOIID= '',
            IsRead='',
            MessageDetailedTemplate= '',
            NotificationID= '',
            OrderID= '',
            PatientName='',
            IsRead= false,
        } = this.state || {};
        var splitNotMsg1 = '';
        var splitNotMsg2 = '';
        var splitNotMsg3 = '';
        var NotMsg = '';
        if(MessageDetailedTemplate !== ''){
            splitNotMsg1 = MessageDetailedTemplate.split('{DoctorName}');
            splitNotMsg2 = splitNotMsg1[1].split('{PatientName}');
            splitNotMsg3 = splitNotMsg2[0].split('no. ');
            DoctorName = <strong><i> {splitNotMsg1[0]} {DoctorName}  &#160;</i></strong>;
            
            NotMsg = <p id="Dec"  role="button"> {splitNotMsg3[0]} {'no. '}
                <span className="NotLink" role="button" onClick={this.GotoWLSingleOrder}>{OrderID} </span> &#160; related to {PatientName}
            </p>;
        }
        
    var classs = 'NotifRow';
    if(!IsRead){
        classs = classs + ' unreadd';
    }

        return(
            <div className={classs}>
      <div className='NotifRowDetMsg' onClick={this.GotoWLSingleOrder}>
            {DoctorName} {NotMsg}
            </div><p className='markRead' role='button' onClick={this.MAR} data-tip='Mark as read' data-for="El1" />

            <ReactTooltip
                id="El1"
                className="InfoToolTip"
                place="bottom"
                effect="solid"
                html={true}
              /> </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
  showHideLoader: (isShow, Type) => dispatch(showHideLoader(isShow, Type)),
    saveNotifications: (Parameter, Type) => dispatch(saveNotifications(Parameter, Type)),
    onChangeReqParam: (Parameter, Type) => dispatch(changeRequestParameter(Parameter, Type)),
  })

  const mapStateToProps = state => ({
    BranchName: state.ChangeUserAssignedBranch.BranchName,
    BranchID: state.ChangeUserAssignedBranch.BranchID,
    UserToken: state.UserAuthenticationInfo.AuthenticationInfo.AuthenticationToken,
  })

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(NotificationsPage))