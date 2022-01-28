import React, { Component } from "react";
import './TechniciansPageStyle.css';
import { connect } from "react-redux";
import * as urls from "../../constants/URL";
import axios from "axios";
import Select from "react-select";
//import { ToastContainer, ToastStore } from "react-toasts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { withRouter } from "react-router-dom";
//import { withToastManager } from 'react-toast-notifications';
import ReactTooltip from "react-tooltip";
import { refreshPage, showHideLoader } from '../../actions';

class TechniciansPage extends Component{
    constructor(props){
        super();
        this.state={
            PageRefreshes: 0,
            BrID: 0,
            RadUserInfo: {
                Count: 0,
                RadAuthorities:[
                    {
                        value: 0,
                        label: "",
                        key:0
                    }
                ],
                RadRoles: [
                    {
                        value: 0,
                        label: "",
                        key:0
                    }
                ],
                RadUsers: [
                ]
            },
            TechniciansRefs:0
        }
        this.getTechnicians = this.getTechnicians.bind(this);
        this.showToast = this.showToast.bind(this);
        this.SwitchOnOff = this.SwitchOnOff.bind(this);
        this.RadUserUpdated = this.RadUserUpdated.bind(this);
        this.gotoDashboard = this.gotoDashboard.bind(this);
    }
  
    gotoDashboard(){
      this.props.history.push('/dashboard')
    }

    RadUserUpdated(UserID, ExecID, values, Type){
        const mom = '?a=' + moment();
        const BrID = this.props.BranchID;
        const url = `${urls.URL}SecurityWebService.svc/UpdateRadUser${mom}`;
        const params={
            executiveID:UserID,
            items:values,
            type:Type,
            branchID: BrID
        };
        this.props.showHideLoader(true, 'SHOW_HIDE');
        axios({
            method: "post",
            url: url,
            data: JSON.stringify(params),
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
                const Msg = responseJson.genericMessage.Message;
                this.showToast(Msg);
                this.getTechnicians();
              }
            }
          })
          .catch(error => {});
    }

    SwitchOnOff(UserID, ExecID, Status){
        const mom = '?a=' + moment();
        const url = `${urls.URL}SecurityWebService.svc/SetUserActiveStatus${mom}`;
        const params={
            executiveID : UserID,
            status : Status
        };
        this.props.showHideLoader(true, 'SHOW_HIDE');
        axios({
            method: "post",
            url: url,
            data: JSON.stringify(params),
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
                const Msg = responseJson.genericMessage.Message;
                this.showToast(Msg);
                this.getTechnicians();
              }
            }
          })
          .catch(error => {});
    }

    showToast(Msg){
        //alert(Msg);
        //ToastStore.success(Msg, 2000, "TechsToastCont");
        toast.success(Msg, {
            position: toast.POSITION.TOP_CENTER
          });
      }

    getTechnicians(){
        const BrID = this.props.BranchID;
        const PageSize = 10000;
        const PageNumber = 1;
        const mom = '?a=' + moment();
        const url = `${urls.URL}SecurityWebService.svc/GetRadUsers/${BrID}/${PageSize}/${PageNumber}${mom}`;
        if(parseInt(BrID, 10) !== 0){
            this.props.showHideLoader(true, 'SHOW_HIDE');
            axios({
            method: "get",
            url: url,
            //data: JSON.stringify(req),
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
                let RadUserInfo = Object.assign({}, this.state.RadUserInfo);
                if(responseJson.RadUserInfo.RadRoles === null){
                  responseJson.RadUserInfo.RadRoles = RadUserInfo.RadRoles;
                }else{
                    const AuthRoles = responseJson.RadUserInfo.RadRoles.map((opt, index) =>(
                        {value: opt.ID, label: opt.Name, key: index}
                    ));
                    responseJson.RadUserInfo.RadRoles = AuthRoles;
                }
                if(responseJson.RadUserInfo.RadAuthorities === null){
                    responseJson.RadUserInfo.RadAuthorities = RadUserInfo.RadAuthorities;
                  }else{
                    const Grps = responseJson.RadUserInfo.RadAuthorities.map((opt, index) =>(
                        {value: opt.ID, label: opt.Name, key: index}
                    ));
                    responseJson.RadUserInfo.RadAuthorities = Grps;
                }
                if(responseJson.RadUserInfo.RadUsers === null){
                    responseJson.RadUserInfo.RadUsers = RadUserInfo.RadUsers;
                  }
                  this.setState({
                    RadUserInfo: {
                        Count: 0,
                        RadAuthorities:[
                            {
                                value: 0,
                                label: "",
                                key:0
                            }
                        ],
                        RadRoles: [
                            {
                                value: 0,
                                label: "",
                                key:0
                            }
                        ],
                        RadUsers: [
                        ]
                    }
                },()=>{
                    this.setState({
                        RadUserInfo: responseJson.RadUserInfo
                    }, ()=>{
                        this.props.showHideLoader(false, 'SHOW_HIDE');
                    })});
              }
            }
          })
          .catch(error => {});}
    }

    componentDidMount(){
        if(parseInt(this.props.UserAuth, 10) === 1){
        this.props.history.push("/dashboard");
        }else{
        this.getTechnicians();}
    }

    componentWillUnmount(){
        var Parameter = 0;
        this.props.refreshPage(Parameter, 'REFRESH_TECHNICIANS')
    }

    componentDidUpdate(){
        if(this.state.BrID !== this.props.BranchID){
            this.setState({
                BrID: this.props.BranchID
            },()=>{
                this.getTechnicians();
            })
        }

        if(parseInt(this.props.RefreshPages.Technicians, 10) !== this.state.PageRefreshes){
            this.setState({
                PageRefreshes: parseInt(this.props.RefreshPages.Technicians, 10),
                BrID: 0,
                RadUserInfo: {
                    Count: 0,
                    RadAuthorities:[
                        {
                            value: 0,
                            label: "",
                            key:0
                        }
                    ],
                    RadRoles: [
                        {
                            value: 0,
                            label: "",
                            key:0
                        }
                    ],
                    RadUsers: [
                    ]
                },
                TechniciansRefs:0
            },()=>{
                this.componentDidMount();
            })
        }


        /*if(parseInt(this.props.TechniciansRefs,10)!== parseInt(this.state.TechniciansRefs,10)){
            this.setState({
                TechniciansRefs: this.props.TechniciansRefs,
                RadUserInfo: {
                    Count: 0,
                    RadAuthorities:[
                        {
                            value: 0,
                            label: "",
                            key:0
                        }
                    ],
                    RadRoles: [
                        {
                            value: 0,
                            label: "",
                            key:0
                        }
                    ],
                    RadUsers: [
                        {
                            AllowSetActivateStatus: false,
                            Authorities: null,
                            IsActive: false,
                            Role: null,
                            UserAccount: null,
                            UserID: 0,
                            UserLog: null,
                            UserName: ""
                        }
                    ]
                }
            })
            this.componentDidMount();
        }*/
    }

    componentWillMount(){
        if(parseInt(this.props.UserAuth, 10) === 0 && !this.props.IsITUser){
            this.props.history.push("/notauthorizedpage");
        }

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

    render(){
        const {RadUserInfo} = this.state;
        return(
            <div className='TechniciansPage'>
            {/*<ToastContainer
            store={ToastStore}
            position={ToastContainer.POSITION.TOP_CENTER}
            />*/}
            <ToastContainer
            autoClose={5000}
            hideProgressBar
            pauseOnVisibilityChange={false}
            closeButton={false}
            className='TechsToastCls'
            toastClassName='TechsToastCont'
            progressClassName='TechsToastProgCont'
            />
            <div className="mybreadCrumb">
          <span onClick={this.gotoDashboard} className="mybreadCrumblink HomePage">
            Home{" "}
          </span>{" "}
          <span> {">"} Technicians </span>
        </div>
            <div className='TechniciansCont'>
            <div className="TechsNumberOfusers">Number Of Users: {RadUserInfo.Count}</div>
            <div className='Techniciansgrid'>
            <div className='Techniciansgridheader'>
                <div className='TechniciansCols padd5'>
                    Name
                </div>
                <div className='TechniciansCols border_left padd5'>
                    User Name
                </div>
                <div className='TechniciansCols border_left padd5'>
                    User Authority
                </div>
                <div className='TechniciansCols border_left padd5'>
                    Roles
                </div>
                <div className='TechniciansSCol border_left padd5'>
                    
                </div>
            </div>
                {RadUserInfo.RadUsers.map(RadUser => (
                    <TechniciansGrid
                    RadUser={RadUser}
                    Authlvls={RadUserInfo.RadRoles}
                    Groups={RadUserInfo.RadAuthorities}
                    SwitchOnOff={this.SwitchOnOff}
                    RadUserUpdated={this.RadUserUpdated}
                    />
                ))}
            </div>
            </div>
            </div>
        )
    }
}


const Switch = function(props) {
    let classNames = [
      "switch ib",
      props.isOn ? "switch_is-on" : "switch_is-off"
    ].join(" ");
    return (
      <div className={classNames} onClick={props.handleToggle}>
        <ToggleButton isOn={props.isOn} isOnn={props.isOnn} />
      </div>
    );
  };
  
const ToggleButton = function(props) {
    let classNames = [
      "toggle-button noselect",
      props.isOn ? "toggle-button_position-left" : "toggle-button_position-right"
    ].join(" ");
    return <div className={classNames}>{props.isOnn}</div>;
  };

class TechniciansGrid extends Component{
    constructor(props){
        super();
        this.state={
            isAuthOn: false,
            isAuthOnn: "OFF",
            Authlvls:[],
            Groups:[],
            SelectedAuthorityRoles:[],
            SelectedGroups:[]
        }
    this.switchtoggled = this.switchtoggled.bind(this);
    this.AuthRolesChanged = this.AuthRolesChanged.bind(this);
    this.UserAuthority = this.UserAuthority.bind(this);
    }

    UserAuthority(val){
        const ExecID = 1;
        const UserID = this.props.RadUser.UserID;
        const Type = 1;
        var values = '';
        if(val !== null){
        const SelectedGrpsArr = val.map(opt => ({ value: opt.value}));
        for(var i=0; i<SelectedGrpsArr.length; i++){
            if (values === ''){
                values = values + SelectedGrpsArr[i].value.toString()
            }
            else{
                values = values + ',' + SelectedGrpsArr[i].value.toString();
            }
        }}


        this.setState({
            SelectedGroups: val
        },()=>{
            this.props.RadUserUpdated(UserID, ExecID, values, Type);
        })
    }

    AuthRolesChanged(val){
        const ExecID = 1;
        const UserID = this.props.RadUser.UserID;
        const Type = 2;
        var value = val.value;


        this.setState({
            SelectedAuthorityRoles: val.key
        },()=>{
            this.props.RadUserUpdated(UserID, ExecID, value, Type);
        })
    }

    switchtoggled() {    
        var isAuthOnn = "";
        const Status = this.state.isAuthOn;
        const UserID = this.props.RadUser.UserID;
        const ExecID = 1;
        if (this.state.isAuthOn) {
            isAuthOnn = "OFF";
          } else {
            isAuthOnn = "ON";
          }
        
        this.setState({ isAuthOn: !this.state.isAuthOn, isAuthOnn: isAuthOnn },
             () => {
                 this.props.SwitchOnOff(UserID, ExecID, !Status);
             });
      }

    componentDidMount(){
        const IsActive = this.props.RadUser.IsActive;
        const RadAuthorities = this.props.Groups;
        const RadRoles = this.props.Authlvls;
        var isAuthOnn = "";
        if (IsActive) {
            isAuthOnn = "ON";
        } else {
            isAuthOnn = "OFF";
        }

        var AuthRoles = this.props.RadUser.Role;
        var SelRoles = -1;
        if(AuthRoles !== null && RadRoles.length > 0){
            for(var i=0; i<RadRoles.length; i++){
                if(parseInt(RadRoles[i].value, 10) === parseInt(AuthRoles)){
                    SelRoles = RadRoles[i].key;
                }
            }
        }



        var Grps = this.props.RadUser.Authorities;
        var SelGrps = [];
        if(Grps !== null){
            if (String(Grps).includes(',')){
                const NGrps = Grps.split(',');
                for(var ii = 0; ii<NGrps.length; ii++){
                    const GID = parseInt(NGrps[ii]);
                    const G = RadAuthorities.filter(l =>{
                        const f = l.value;
                        return String(f) === String(GID);
                    });
                    SelGrps= [...SelGrps, G[0]];
                }
            }else{
                const GID = parseInt(Grps);
                const G = RadAuthorities.filter(l =>{
                    const f = l.value;
                    return String(f) === String(GID);
                });
                SelGrps= [...SelGrps, G[0]];
            }
        }


        this.setState({
            isAuthOn: IsActive,
            isAuthOnn,
            Authlvls: this.props.Authlvls,
            SelectedGroups:SelGrps,
            SelectedAuthorityRoles:SelRoles,
            Groups: this.props.Groups
          });
    }

    render(){
        const {
            RadUser,
        } = this.props || '';
        const {Authlvls,
        Groups,
        SelectedAuthorityRoles,
        SelectedGroups} = this.state || '';
        
        
        var SelRole=null;
        if(SelectedAuthorityRoles !== -1){
            SelRole = Authlvls[SelectedAuthorityRoles]
        }
        return(
            <div className='TechniciansgridRow'
            data-tip={RadUser.UserLog}
            data-for="TechInf">
            <ReactTooltip id="TechInf" place="right" effect="solid" html={true} className='TechTooltip'/>
                <div className='TechniciansCols padd5'>
                    {RadUser.UserName}
                </div>
                <div className='TechniciansCols border_left border_right padd5'>
                    {RadUser.UserAccount}
                </div>
                <div className='TechniciansSelCols padd5'>
                
                <Select
                    value={SelectedGroups}
                    options={Groups}
                    className="srchselect"
                    nocaret
                    isMulti
                    data-live-search="true"
                    styles={customStyles}
                    onChange={this.UserAuthority}
                />
                </div>
                <div className='SepDiv' />
                <div className='TechniciansSelCols padd5'>
                
                <Select
                    value={SelRole}
                    options={Authlvls}
                    className="srchselect"
                    nocaret
                    data-live-search="true"
                    styles={customStyles}
                    onChange={this.AuthRolesChanged}
                />
                </div>
                <div className='TechniciansSCol border_left padd5'>
                <Switch
                    isOn={this.state.isAuthOn}
                    isOnn={this.state.isAuthOnn}
                    handleToggle={this.switchtoggled}
          />
                </div>
            </div>
        )
    }
}

const customStyles = {
    control: (base, state) => ({
      // none of react-selects styles are passed to <View />
      ...base,
      minHeight: 25,
      width: '98%'
    }),
    menu: (base, state) => ({
      ...base,
      position: "absolute",
      zIndex: 10,
      float: 'left'
    }),
    valueContainer: base => ({
      ...base,
    }),
    dropdownIndicator: base => ({
      ...base,
      width: 28,
    }),
    indicatorSeparator: base => ({
      ...base,
      display: "none"
    })
  };

  const mapStateToProps = state => ({
    BranchID: state.ChangeUserAssignedBranch.BranchID,
    UserToken: state.UserAuthenticationInfo.AuthenticationInfo.AuthenticationToken,
    UserAuth: state.UserAuthenticationInfo.AuthenticationInfo.Applications[state.UserAuthenticationInfo.AuthenticationInfo.SelectedApplication].Authorities,
    IsITUser: state.UserAuthenticationInfo.AuthenticationInfo.IsITUser,
    RefreshPages: state.RefreshPages
    //TechniciansRefs: state.RefreshPages.TechniciansRefs
  });

  const mapDispatchToProps = dispatch => ({
    showHideLoader: (isShow, Type) => dispatch(showHideLoader(isShow, Type)),
    refreshPage: (Parameter, Type) =>dispatch(refreshPage(Parameter, Type))
  });

  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(TechniciansPage));