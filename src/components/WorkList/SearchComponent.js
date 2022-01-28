import React, { Component } from "react";
import { connect } from 'react-redux';
import './SearchComponentStyle.css';
import DropDownList from '../DropDown/DropDownList.js';
import * as urls from '../../constants/URL';
import moment from 'moment';
import axios from "axios";
import { changeRequestParameter, changeStatus, onTodaysOrdersClicked, setLoadedParameters, setPatientID, refreshPage, changeCalendar, showHideLoader } from '../../actions';
const signalR = require("@aspnet/signalr");

const FilterOptions1=[
    {ID:1, Label:'All Orders'},
    {ID:2, Label:'Requested'},
    {ID:3, Label:'Pending'},
    {ID:4, Label:'Preliminary Resulted'},
    {ID:5, Label:'Reported'},
    {ID:6, Label:'Cancelled'},
    {ID:7, Label:'Multi-Status'}
];

const FilterOptions2=[
    {ID:1, Label:'Date Created'},
    {ID:2, Label:'Patient Name'}
];

const FilterOptions3=[
    {ID:1, Label:'Ascending'},
    {ID:2, Label:'Descending'}
];

class SearchComponent extends Component{
    constructor(props){
        super(props);
        this.state={
          PageRefreshes: 0,
            showSideBar:true,
            PatientHavingRadOrderList:[],
            PatientHavingRadOrderListF:[],
            showPatientsDropDn:false,
            srchText:'',
            SelectedSort:{ID:1, Label:'Date Created'},
            SelectedSortOrder:{ID:2, Label:'Descending'},
            SelectedFilter:{ID:2, Label:'Requested'},
            Req:{},
            ChangeFilters: false,
            NewCount: 0,
            StatusID: 0,
            IDCounter: 0,
            isRadStatusesLoaded: false,
            isPatientsLoaded: false
        };
        this.OrdersFilerClicked = this.OrdersFilerClicked.bind(this);
        this.OrdersSortClicked = this.OrdersSortClicked.bind(this);
        this.OrdersSortOrderClicked = this.OrdersSortOrderClicked.bind(this);
        this.getPatientsHavingLabOrders = this.getPatientsHavingLabOrders.bind(this);
        this.showPatientsDD = this.showPatientsDD.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.hidePatientsDD = this.hidePatientsDD.bind(this);
        this.checkIfEnterPressed = this.checkIfEnterPressed.bind(this);
        this.filterPatients = this.filterPatients.bind(this);
        this.PatientClicked = this.PatientClicked.bind(this);
        this.showHideSideBar = this.showHideSideBar.bind(this);
        this.getRadStatuses = this.getRadStatuses.bind(this);
        this.getTodaysOrders = this.getTodaysOrders.bind(this);
        this.fetchNewOrdersNotifications = this.fetchNewOrdersNotifications.bind(this);
        this.resetNewOrdersCount = this.resetNewOrdersCount.bind(this);
        this.checkForLoaded = this.checkForLoaded.bind(this);
    }

    checkForLoaded(){
        if(this.state.isRadStatusesLoaded &&
          this.state.isPatientsLoaded ){
            this.props.searchComponentLoaded();
          }
      }

    resetNewOrdersCount(){
      const BranchID = this.props.BranchID;
      const mom = '?a=' + moment();
      const url = `${urls.URL}NotificationWebService.svc/ResetUserNewItemsCount${mom}`;
      const resetparams = {
          branchID: BranchID,
          type: 2
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
            const responseJson = response.data.GetUserNewItemsCountResult;
            if (responseJson.HasError) {
            } else {
            }
            //const currpage = this.state.currentPage;
          }
        })
        .catch(error => {
          this.setState({ errorLoginTxt: "Login failed." });
        });
  }

    fetchNewOrdersNotifications(){
      const BranchID = this.props.BranchID;
      const mom = '?a=' + moment();
      const url = `${urls.URL}NotificationWebService.svc/GetUserNewItemsCount/${BranchID}/1${mom}`;
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
            if (responseJson.GetUserNewItemsCountResult.HasError) {
              //const Msg = responseJson.ServiceError.Message;
            } else {
                let NewCount = responseJson.GetUserNewItemsCountResult.NewItemsInfo.NewCount;
                this.setState({
                  NewCount
                })
            }
          }
        })
        .catch(error => {});
  }

    getTodaysOrders(){
      const Parameter = {
        UserId: this.props.Req.UserID,
        BranchID: this.props.Req.BranchID
      };
      this.setState({
        NewCount: 0
      }, ()=>{
        this.props.onChangeReqParam(Parameter, 'GET_TODAYS_ORDERS');
        this.props.onTodaysOrdersClicked( 1, 'RESET_FILTERS' );
        this.props.ResetSelectedPageSize();
        this.resetNewOrdersCount();
      })
    }

    showHideSideBar(){
      this.props.showHideSideBar();
      }

    PatientClicked(ID, Name){
      var srchTxt = '';
        if(isNaN(this.state.srchText)){
          srchTxt = Name;
        }
        else{
          srchTxt = ID;
        }
        this.setState({srchText: srchTxt}, ()=> {
          this.hidePatientsDD();
          const Parameter = srchTxt;
          this.props.onChangeReqParam(Parameter, 'CHANGE_PATIENT');})

          if(srchTxt === ''){
            this.props.changeCalendar(1, 'TO_DATE');
          }else{
            this.props.changeCalendar(1, 'BACK_ONE_YEAR')
          }
      }

    filterPatients(evt){
        const srchText = evt.target.value;
        var PatientHavingRadOrderListF = {...this.state.PatientHavingRadOrderListF};
        PatientHavingRadOrderListF = this.state.PatientHavingRadOrderList.filter((pat) =>{
          if(isNaN(srchText)){
            return pat.PatientName.includes(srchText)
          }
          else{
            return String(pat.MOIID).startsWith(String(srchText))
          }
        })
    
        if(srchText === "" || srchText === null){
          const Parameter = srchText;
            this.props.onChangeReqParam(Parameter, 'CHANGE_PATIENT');
        }
        this.setState({PatientHavingRadOrderListF, srchText});
      }

    checkIfEnterPressed(evt){
        const srchTxt = evt.target.value;
        if(evt.key === "Enter"){
          this.setState({srchText: srchTxt}, 
            ()=> {
              const Parameter = srchTxt;
              this.props.onChangeReqParam(Parameter, 'CHANGE_PATIENT');
              this.hidePatientsDD();
              if(srchTxt === ''){
                this.props.changeCalendar(1, 'TO_DATE');
              }else{
                this.props.changeCalendar(1, 'BACK_ONE_YEAR')
              }
              //this.searchinput.blur();
              })
        }
      }

    setWrapperRef(node) {
        this.wrapperRef = node;
      }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
          this.hidePatientsDD();
        }
      }

    hidePatientsDD(){
        this.setState({showPatientsDropDn: false}, ()=>{
          //alert('aa')
          //this.searchinput.blur();
        });
    }

    showPatientsDD(){
        this.setState({showPatientsDropDn: !this.state.showPatientsDropDn
        });
    }

    getRadStatuses(){
      const mom = '?a=' + moment();
      const BranchID = 1;
      const url = `${urls.URL}RadOrderWorklistWebService.svc/GetRadStatuses/${BranchID}${mom}`;
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
            var RadStatusList = responseJson.RadStatusList;
            RadStatusList = RadStatusList.map((opt, index)=>({
              ID: index,
              StatusID: opt.ID,
              Label: opt.Name,
              //StatusColor: opt.Color,
              isDefault: opt.IsDefault,
              //MoveToNextStatusText: opt.MoveToNextStatusText,
              //MoveToStatusID: opt.MoveToStatusID,
              //NextStatusColor: opt.NextStatusColor
            }));
            var SelectedStatusInd = -1;
            for(var i = 0; i < RadStatusList.length; i++){
              if(RadStatusList[i].isDefault){
                SelectedStatusInd = i;
              }
            }
            var Parameters={
              Statuses:RadStatusList,
              SelectedStatusIndex: SelectedStatusInd
            }
            this.setState({
              isRadStatusesLoaded: true
            }, ()=>{
              this.props.changeStatus(Parameters, 'SAVE_STATUSES');
              const StatusID = RadStatusList[SelectedStatusInd].StatusID;
              this.props.onChangeReqParam(StatusID, 'CHANGE_SORTSTATUS');
              const Parameter1 = true;
              this.props.setLoadedParameters(Parameter1, 'UPDATE_STATUSES');
              this.checkForLoaded();
            })
          }
        }
      })
      .catch(error => {
        const a = error
      });
    }

    getPatientsHavingLabOrders(){
        const mom = '?a=' + moment();
        const BranchID = this.props.BranchID;
        var StatusID = 0;
        if(this.props.Statuses.Statuses.length > 0){
        StatusID= this.props.Statuses.Statuses[this.props.Statuses.SelectedStatusIndex].StatusID}
        const DateFromA = String(this.props.Req.DateFrom).split('/');
        const DateFrom = `${DateFromA[2]}-${DateFromA[1]}-${DateFromA[0]}`;
        const DateToA = String(this.props.Req.DateTo).split('/');
        const DateTo = `${DateToA[2]}-${DateToA[1]}-${DateToA[0]}`;
        const url = `${urls.URL}RadOrderWorklistWebService.svc/GetPatientsHavingRadOrder/${BranchID}/${StatusID}${mom}`;
        if(BranchID !== 0 || StatusID !== 0)
        {
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
                  var PatientsHavingOrders = responseJson.PatientHavingRadOrderList;
                  
                  this.setState({
                    PatientHavingRadOrderList: PatientsHavingOrders,
                    PatientHavingRadOrderListF: PatientsHavingOrders,
                    isPatientsLoaded: true
                  }, ()=>{
                    this.checkForLoaded();
                  })
              }
            }
          })
          .catch(error => {});}
    }

    OrdersSortClicked(event){
      const SelectedSort = event;
      this.setState({
        SelectedSort
      },()=>{
        const Parameter = SelectedSort.ID;
        this.props.onChangeReqParam(Parameter, 'CHANGE_SORTCOL');
      })
    }

    OrdersSortOrderClicked(event){
      const SelectedSortOrder = event;
      this.setState({
        SelectedSortOrder
      },()=>{
        const Parameter = SelectedSortOrder.ID;
        this.props.onChangeReqParam(Parameter, 'CHANGE_SORTMODE');
      })
    }

    OrdersFilerClicked(event){
      const SelectedFilter = event;
      this.setState({
        SelectedFilter
      },()=>{
        const StatusInd = SelectedFilter.ID;
         //SelectedFilter.StatusID;
        const StatusID = this.props.Statuses.Statuses[StatusInd].StatusID;
        this.props.onChangeReqParam(StatusID, 'CHANGE_SORTSTATUS');
        this.props.changeStatus(StatusInd, 'CHANGE_SELECTED_STATUS');
      })
    }

    componentWillUnmount(){
        document.removeEventListener('mousedown', this.handleClickOutside);
        const StatusInd = 0;
        const StatusID = 0;
        const Parameter = '';
        this.props.onChangeReqParam(StatusID, 'CHANGE_SORTSTATUS');
        this.props.changeStatus(StatusInd, 'CHANGE_SELECTED_STATUS');
        this.props.setPatientID(Parameter, 'RESET_PATIENTID');
    }

    componentDidMount(){
    let connection = new signalR.HubConnectionBuilder()
    .withUrl(`${urls.PUSHNOTIFIP}/pushNotificationHub`)
    .build();

    connection.on("pushNewPatientRadOrderNotification", (toastMessage, toastTimeOut) => {
      //this.fetchNewOrdersNotifications();
      this.getPatientsHavingLabOrders();
      //alert('new notif');
    });
      connection.start()
    .then()
    .catch(err => {
      //const f = 3;
      //alert('Error while establishing connection :(');
    });

      document.addEventListener('mousedown', this.handleClickOutside);
      this.setState({
        Req: this.props.Req
      },()=>{
        //this.getPatientsHavingLabOrders();
        this.getRadStatuses();
        this.resetNewOrdersCount();
      })
    }

    componentDidUpdate(){
      if(this.props.IDParams.Counter !== this.state.IDCounter){
        this.setState({
          IDCounter: this.props.IDParams.Counter,
          srchText: this.props.IDParams.PatientID
        })
      }

      if(this.state.showSideBar !== this.props.sidebarShown){
        this.setState({
          showSideBar: this.props.sidebarShown
        })
      }
      
      if(this.props.Statuses.Statuses.length > 0){
        //StatusID1= this.props.Statuses.Statuses[this.props.Statuses.SelectedStatusIndex].StatusID
      if(this.state.StatusID !== this.props.Statuses.Statuses[this.props.Statuses.SelectedStatusIndex].StatusID){
        this.setState({
          StatusID: this.props.Statuses.Statuses[this.props.Statuses.SelectedStatusIndex].StatusID
        }, ()=>{
          this.getPatientsHavingLabOrders();
        })
      }
      }

      if(this.props.ChangeFilters !== this.state.ChangeFilters){
        var RadStatusList = this.props.Statuses.Statuses
        var SelectedStatusInd = -1;
            for(var i = 0; i < RadStatusList.length; i++){
              if(RadStatusList[i].isDefault){
                SelectedStatusInd = i;
              }
            }
            const StatusID = RadStatusList[SelectedStatusInd].StatusID;
            //this.props.onChangeReqParam(StatusID, 'CHANGE_SORTSTATUS');
            //this.props.changeStatus(SelectedStatusInd, 'CHANGE_SELECTED_STATUS');
        this.setState({
            srchText:'',
            //SelectedSort:{ID:1, Label:'Date Created'},
            //SelectedSortOrder:{ID:2, Label:'Descending'},
            ChangeFilters: this.props.ChangeFilters
        })
    }

    if(parseInt(this.props.RefreshPages.Worklist, 10) !== this.state.PageRefreshes){
      this.setState({
        PageRefreshes: parseInt(this.props.RefreshPages.Worklist, 10),
        showSideBar:true,
            PatientHavingRadOrderList:[],
            PatientHavingRadOrderListF:[],
            showPatientsDropDn:false,
            srchText:'',
            SelectedSort:{ID:1, Label:'Date Created'},
            SelectedSortOrder:{ID:2, Label:'Descending'},
            SelectedFilter:{ID:2, Label:'Requested'},
            Req:{},
            ChangeFilters: false,
            NewCount: 0,
            StatusID: 0,
            IDCounter: 0,
      })
      this.props.onTodaysOrdersClicked( 1, 'RESET_FILTERS' );
      this.componentDidMount();
      this.resetNewOrdersCount();
    }

    }

    render(){
      const {
        SelectedSort,
        showSideBar,
        SelectedSortOrder,
        NewCount
      } = this.state;
      const Statuses = this.props.Statuses.Statuses;
      var SelectedStatusOption='';
      if(Statuses.length > 0 && parseInt(this.props.Statuses.SelectedStatusIndex, 10) !== -1){
      SelectedStatusOption = Statuses[this.props.Statuses.SelectedStatusIndex].Label;}
        return(
            <div className='SearchCompCont'>
            <div className='SearchComCol1'>
            <div className='DropsCont'>
            <div className='SidebarFiltCont'>
            {!showSideBar ? 
                    <input type='button'
                    className='SCSidebarButton'
                    value='&#x25C0;'
                    onClick={this.showHideSideBar}/> : null}
                <DropDownList 
                  SelectedOption={SelectedStatusOption}
                  Options1={Statuses}
                  ComponentStyle='OrderSelectionStyle'
                  HeaderStyle='OderSelectionHeaderStyle'
                  DropDnStyle='OrderSelectionDropDnStyle'
                  ElementsStyle='OrderSelectionElStyle'
                  onChange={this.OrdersFilerClicked}
                /></div>

                <DropDownList 
                  Tag='sort By '
                  SelectedOption={SelectedSort.Label}
                  SelectedOption2={SelectedSortOrder.Label}
                  Options1={FilterOptions2}
                  Options2={FilterOptions3}
                  TagNameStyle='sortByTagStyle'
                  ComponentStyle='sortBySelectionStyle'
                  HeaderStyle='sortBySelectionHeaderStyle'
                  DropDnStyle='sortByDropDnStyle'
                  ElementsStyle='sortBySelectionElStyle'
                  onChange={this.OrdersSortClicked}
                  onChange1={this.OrdersSortOrderClicked}
                />
                </div>
                </div>
                
                <div className='SearchCompCol2'>
                <div className="SearchBoxCont">
            <div className="SearchInp">
              <input
                className="SearchBox q"
                type="search"
                value={this.state.srchText}
                placeholder="Search by patient ID, name"
                aria-label="Search"
                onChange= {this.filterPatients}
                onKeyDown={this.checkIfEnterPressed}
                onClick={this.showPatientsDD}
                /*ref={(searchinput) => { this.searchinput = searchinput; }}*/
              />
              <input type="button" className="b" onClick={this.searchclicked}/>
              {this.state.showPatientsDropDn ? <div className='PatientsSearchBar' 
                ref={this.setWrapperRef}>
              {this.state.PatientHavingRadOrderListF.map((Patient, index) => (
                <PatientsDropdn Patientprop={Patient} key={index} PatientClicked={this.PatientClicked}/>
              ))}
              </div> : null}
            </div>
          </div>
            <div className='TodaysordersCont'>
            <button
              className="todaysorderbtn todaysorderbtn-outline-success mymy-2 mymy-sm-0 fr"
              onClick={this.getTodaysOrders}
            >
              Today's Orders 
            </button>
            {NewCount ? <div className='OrderNotifsTag'>{NewCount}</div> : null}
          </div>
                </div>
            </div>
        )
    }
}

class PatientsDropdn extends React.Component{
    constructor(props){
      super(props);
      this.state={};
      this.PatientSelected = this.PatientSelected.bind(this);
    }
  
    PatientSelected(){
      const ID = this.props.Patientprop.MOIID;
      const Name = this.props.Patientprop.PatientName;
      this.props.PatientClicked(ID, Name);
    }
  
    render(){
      const {
        MOIID = '',
        PatientName = '',
      } = this.props.Patientprop || {};
      return(
        <div className='PatientRow' role='button' onClick={this.PatientSelected}>
          <strong>{MOIID}</strong>  {PatientName}
        </div>
      );
    }
  }


const mapStateToProps = state => ({
    Req: state.ChangeRequestParameters,
    BranchID: state.ChangeUserAssignedBranch.BranchID,
    Statuses: state.ModifyRadStatuses.Statuses,
    ChangeFilters: state.RestoreFilters.ChangeFilters,
    UserToken: state.UserAuthenticationInfo.AuthenticationInfo.AuthenticationToken,
    IDParams: state.SetPatientID,
    RefreshPages: state.RefreshPages
  })
  
const mapDispatchToProps = (dispatch) => ({
    onChangeReqParam: (Parameter, Type) => dispatch(changeRequestParameter(Parameter, Type)),
    changeStatus: (Parameter, Type) => dispatch(changeStatus(Parameter, Type)),
    onTodaysOrdersClicked: (Parameter, Type) => dispatch(onTodaysOrdersClicked(Parameter, Type)),
    setLoadedParameters: (Parameter, Type) => dispatch(setLoadedParameters(Parameter, Type)),
    setPatientID: (Parameter, Type) => dispatch(setPatientID(Parameter, Type)),
    refreshPage: (Parameter, Type) =>dispatch(refreshPage(Parameter, Type)),
    showHideLoader: (isShow, Type) => dispatch(showHideLoader(isShow, Type)),
    changeCalendar: (Parameter, Type) =>dispatch(changeCalendar(Parameter, Type))
  })

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchComponent)