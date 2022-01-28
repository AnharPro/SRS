import React, { Component } from "react";
import { connect } from 'react-redux';
import './SideBarStyle.css';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import axios from "axios";
import * as urls from "../../constants/URL";
import { changeRequestParameter, setLoadedParameters, refreshPage, showHideLoader } from '../../actions';
import PropTypes from "prop-types";

class SideBar extends Component{
    constructor(props){
        super(props);
        this.state={
            PageRefreshes: 0,
            BranchID:0,
            SelectedBranch:{},
            minimDate: new Date(),
            maximDate: new Date(),
            startDate: new Date(),
            endDate: new Date(),
            isMale:false,
            isFemale:false,
            isChronic:false,
            isPregnant:false,
            UserBranchList: [],
            RequesterPhysicianList:[],
            SelectedDoctors:[],
            SelectedDrs:0,
            SelectedUserBranch:0,
            RadGroupList:[],
            SelectedRadGrps:0,
            SelectedLabTests:0,
            SelectedGroups:[],
            SelectedTests:[],
            RadTestList:[],
            ChangeFilters: false,
            ToDate: true,
            isUserBranchesLoaded: false,
            isRadGroupsLoaded: false,
            isRadTestsLoaded: false,
            isRequesterPhysiciansLoaded: false
        };
        this.SelectedBranchChanged = this.SelectedBranchChanged.bind(this);
        this.RadGroupChanged = this.RadGroupChanged.bind(this);
        this.TestNameChanged = this.TestNameChanged.bind(this);
        this.StartDateSet = this.StartDateSet.bind(this);
        this.EndDateSet = this.EndDateSet.bind(this);
        this.isMaleClicked = this.isMaleClicked.bind(this);
        this.isFemaleClicked = this.isFemaleClicked.bind(this);
        this.isChronicClicked = this.isChronicClicked.bind(this);
        this.isPregnantClicked = this.isPregnantClicked.bind(this);
        this.getUserBranches = this.getUserBranches.bind(this);
        this.getRadGroups = this.getRadGroups.bind(this);
        this.getRadTests = this.getRadTests.bind(this);
        this.showHideSideBar = this.showHideSideBar.bind(this);
        this.getRequesterPhysicians = this.getRequesterPhysicians.bind(this);
        this.SelectedDoctorChanged = this.SelectedDoctorChanged.bind(this);
    }

    checkForLoaded(){
        if(this.state.isUserBranchesLoaded &&
          this.state.isRadGroupsLoaded &&
          this.state.isRadTestsLoaded &&
          this.state.isRequesterPhysiciansLoaded ){
            this.props.sideBarLoaded();
          }
      }

    showHideSideBar(){
        this.props.showHideSideBar();
    }

    getRequesterPhysicians(){
        const mom = '?a=' + moment();
        const BranchID = this.props.BranchID;
        const url = `${urls.URL}RadOrderWorklistWebService.svc/GetRequesterPhysicians/${BranchID}${mom}`;
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
                  var RequesterPhysicianList = responseJson.RequesterPhysicianList;
                  RequesterPhysicianList = responseJson.RequesterPhysicianList.map((opt, index)=>({
                        value: opt.ID,
                        label: opt.Name,
                        key: index
                    }))
                  
                  this.setState({
                    RequesterPhysicianList: RequesterPhysicianList,
                    isRequesterPhysiciansLoaded: true
                  },()=>{
                      const Parameter = true;
                      this.props.setLoadedParameters(Parameter, 'UPDATE_PHYSICIANS');
                      this.checkForLoaded();
                  })
              }
            }
          })
          .catch(error => {});
    }

    getRadTests(){
        const mom = '?a=' + moment();
        var labGrps = 0;
        if(this.state.SelectedRadGrps !== ''){
            labGrps = this.state.SelectedRadGrps;
        }
        const url = `${urls.URL}RadOrderWorklistWebService.svc/GetRadTests/${labGrps}${mom}`;
        //(labGrps !== "" && labGrps !== null)
        if(true)
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
                  var TestList = responseJson.RadTestList;
                  TestList = responseJson.RadTestList.map((opt, index)=>({
                        value: opt.ID,
                        label: opt.Name,
                        key: index
                    }))
                  
                  this.setState({
                    RadTestList: TestList,
                    isRadTestsLoaded: true
                  },()=>{
                    const Parameter = true;
                    this.props.setLoadedParameters(Parameter, 'UPDATE_TESTS');
                    this.checkForLoaded();
                  })
              }
            }
          })
          .catch(error => {});
        }else{
            this.setState({
                SelectedLabTests:0,
                SelectedTests:[],
                RadTestList:[],
            }, ()=>{
                const Parameter = '';
                this.props.onChangeReqParam(Parameter, 'CHANGE_RADTESTS');
                const Parameter1 = true;
                this.props.setLoadedParameters(Parameter1, 'UPDATE_TESTS');
            })
        }
    }

    getRadGroups(){
        const mom = '?a=' + moment();
        const url = `${urls.URL}RadOrderWorklistWebService.svc/GetRadGroups${mom}`;
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
                  var GroupList = responseJson.RadGroupList;
                  GroupList = responseJson.RadGroupList.map((opt, index)=>({
                        value: opt.ID,
                        label: opt.Name,
                        key: index
                    }))
                  
                  this.setState({
                    RadGroupList: GroupList,
                    isRadGroupsLoaded: true
                  },()=>{
                    const Parameter = true;
                    this.props.setLoadedParameters(Parameter, 'UPDATE_GROUPS');
                    this.checkForLoaded();
              })
              }
            }
          })
          .catch(error => {});
    }

    getUserBranches(){
        const mom = '?a=' + moment();
        const BranchID = this.props.BranchID;
        if(BranchID !== 0)
        {const url = `${urls.URL}RadOrderWorklistWebService.svc/GetUserBranches/${BranchID}${mom}`;
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
                  var BranchList = responseJson.UserBranchList;
                    BranchList = responseJson.UserBranchList.map((opt, index)=>({
                        value: opt.BranchID,
                        label: opt.BranchName,
                        key: index
                    }))
                  
                  this.setState({
                    UserBranchList: BranchList,
                    SelectedBranch: BranchList[0],
                    isUserBranchesLoaded: true
                  },()=>{
                      var Parameter = 0;
                      if(BranchList.length !== 0){
                    Parameter = BranchList[0].value;}
                    this.props.onChangeReqParam(Parameter, 'CHANGE_BRANCHPARAM');
                    const Parameter1 = true;
                    this.props.setLoadedParameters(Parameter1, 'UPDATE_BRANCHES');
                    this.checkForLoaded();
                  })
              }
            }
          })
          .catch(error => {});}
    }

    isPregnantClicked(){
        var Parameter = null;
        this.setState({
            isPregnant: !this.state.isPregnant
        },()=>{
            if(!this.state.isChronic && !this.state.isPregnant){
                Parameter = null;
            }else if(!this.state.isChronic && this.state.isPregnant){
                Parameter = 2;
            }else if(this.state.isChronic && !this.state.isPregnant){
                Parameter = 1;
            }else if(this.state.isChronic && this.state.isPregnant){
                Parameter = 3;
            }
            this.props.onChangeReqParam(Parameter, 'CHANGE_STATUS');
        })
    }

    isChronicClicked(){
        var Parameter = null;
        this.setState({
            isChronic: !this.state.isChronic
        },()=>{
            if(!this.state.isChronic && !this.state.isPregnant){
                Parameter = null;
            }else if(!this.state.isChronic && this.state.isPregnant){
                Parameter = 2;
            }else if(this.state.isChronic && !this.state.isPregnant){
                Parameter = 1;
            }else if(this.state.isChronic && this.state.isPregnant){
                Parameter = 3;
            }
            this.props.onChangeReqParam(Parameter, 'CHANGE_STATUS');
            
        })
    }

    isFemaleClicked(){
        var Parameter = null;
        this.setState({
            isFemale: !this.state.isFemale
        },()=>{
            if(this.state.isFemale && this.state.isMale){
                Parameter = null;
            }else if(!this.state.isFemale && this.state.isMale){
                Parameter= 1;
            }else if(this.state.isFemale && !this.state.isMale){
                Parameter= 2;
            }
            this.props.onChangeReqParam(Parameter, 'CHANGE_GENDER');
        })
    }

    isMaleClicked(){
        var Parameter = null;
        this.setState({
            isMale: !this.state.isMale
        },()=>{
            if(this.state.isFemale && this.state.isMale){
                Parameter = null;
            }else if(!this.state.isFemale && this.state.isMale){
                Parameter= 1;
            }else if(this.state.isFemale && !this.state.isMale){
                Parameter= 2;
            }
            this.props.onChangeReqParam(Parameter, 'CHANGE_GENDER');
        })
    }

    EndDateSet(date){
        this.setState({
            endDate: date
        },()=>{
            const Parameter = moment(date).format('DD/MM/YYYY');
            this.props.onChangeReqParam(Parameter, 'CHANGE_END_DATE');
        })
    }

    StartDateSet(date){
        this.setState({
            startDate: date
        },()=>{
            const Parameter = moment(date).format('DD/MM/YYYY');
            this.props.onChangeReqParam(Parameter, 'CHANGE_START_DATE');
        })
    }

    SelectedBranchChanged(event){
        const Parameter = event.value;
        this.setState({
            SelectedBranch: event
        },()=>{
            this.props.onChangeReqParam(Parameter, 'CHANGE_BRANCHPARAM');
        })
    }

    SelectedDoctorChanged(val){
        var value = val;
        if(val === null){
            value = [];
        }
        const valuesarray = value.map(opt => ({ value: opt.value}));
        const SelectedDoctors = value;
        var values = '';
        for(var i=0; i<valuesarray.length; i++){
         if (values === ''){
           values = values + valuesarray[i].value.toString()
         }
         else{
           values = values + ',' + valuesarray[i].value.toString();
         }
       }
       this.setState({SelectedDrs: values, SelectedDoctors}, ()=>{
         const Parameter = values;
         this.props.onChangeReqParam(Parameter, 'CHANGE_SELECTED_DOCTOR');
     });
    }

    RadGroupChanged(val){
        var value = val;
        var l=null;
        try {
            if (val.length === 0){
                l=0
            }
        } catch (error) {
            
        }
        if(val === null || l === 0){
            value = [];
            this.TestNameChanged(null);
        }
       const valuesarray = value.map(opt => ({ value: opt.value}));
       const SelectedGroups = value;
       var values = '';
       for(var i=0; i<valuesarray.length; i++){
        if (values === ''){
          values = values + valuesarray[i].value.toString()
        }
        else{
          values = values + ',' + valuesarray[i].value.toString();
        }
      }
      this.setState({SelectedRadGrps: values, SelectedGroups}, ()=>{
        const Parameter = values;
        this.getRadTests();
        this.props.onChangeReqParam(Parameter, 'CHANGE_RADGROUPS');
    });
    }

    TestNameChanged(val){
        var value = val;
        if(val === null){
            value = [];
        }
        const valuesarray = value.map(opt => ({ value: opt.value}));
        const SelectedTests = value;
        var values = '';
        for(var i=0; i<valuesarray.length; i++){
         if (values === ''){
           values = values + valuesarray[i].value.toString()
         }
         else{
           values = values + ',' + valuesarray[i].value.toString();
         }
       }
       this.setState({SelectedLabTests: values, SelectedTests}, ()=>{
        const Parameter = values;
        this.props.onChangeReqParam(Parameter, 'CHANGE_RADTESTS');
    });
    }
    
    componentDidMount(){
        var date = new Date();
        const s =  date.setMonth( date.getMonth() - 6);
        const l = moment(s).format('MM/DD/YYYY');
        date.setMonth( date.getMonth() - 6);
        const nD = new Date(l);
        this.setState({
            minimDate: nD,
            BranchID: this.props.BranchID
        },()=>{
            this.getUserBranches();
            this.getRadGroups();
            this.getRadTests();
            this.getRequesterPhysicians();
        });
    }

    componentDidUpdate(){
        if(this.props.ToDate !== this.state.ToDate){
            if(this.props.ToDate){
                var date = new Date();
                const s =  date.setMonth( date.getMonth() - 6);
                const l = moment(s).format('MM/DD/YYYY');
                //date.setMonth( date.getMonth() - 6);
                const nD = new Date(l);
                this.setState({
                    ToDate: this.props.ToDate,
                    minimDate: nD,
                    maximDate: new Date(),
                    startDate: new Date(),
                    endDate: new Date()
                },()=>{
                    const Parameter = moment(new Date()).format('DD/MM/YYYY');
                    this.props.onChangeReqParam(Parameter, 'CHANGE_START_DATE');

                    const Parameter1 = moment(new Date()).format('DD/MM/YYYY');
                    this.props.onChangeReqParam(Parameter1, 'CHANGE_END_DATE');
                })
            }else{
                var date = new Date();
                const s =  date.setFullYear( date.getFullYear() - 1);
                const l = moment(s).format('MM/DD/YYYY');
                //date.setFullYear( date.getFullYear() - 1);
                const nD = new Date(l);
                this.setState({
                    ToDate: this.props.ToDate,
                    minimDate: nD,
                    maximDate: new Date(),
                    startDate: date,
                    endDate: new Date()
                },()=>{
                    const Parameter = moment(l).format('DD/MM/YYYY');
                    this.props.onChangeReqParam(Parameter, 'CHANGE_START_DATE');

                    const Parameter1 = moment(new Date()).format('DD/MM/YYYY');
                    this.props.onChangeReqParam(Parameter1, 'CHANGE_END_DATE');
                })
            }
        }

        if(this.props.BranchID !== this.state.BranchID){
            this.setState({BranchID: this.props.BranchID},()=>{
                this.getUserBranches();
            })
        }

        if(this.props.ChangeFilters !== this.state.ChangeFilters){
            var date = new Date();
            const s =  date.setMonth( date.getMonth() - 6);
            const l = moment(s).format('MM/DD/YYYY');
            date.setMonth( date.getMonth() - 6);
            const nD = new Date(l);
            this.setState({
                minimDate: nD,
                maximDate: new Date(),
                startDate: new Date(),
                endDate: new Date(),
                //isMale:false,
                //isFemale:false,
                //isChronic:false,
                //isPregnant:false,
                //SelectedDoctors: [],
                //SelectedDrs: 0,
                //SelectedRadGrps:0,
                //SelectedLabTests:0,
                //SelectedGroups:[],
                //SelectedTests:[],
                ChangeFilters: this.props.ChangeFilters
            })
        }

        if(parseInt(this.props.RefreshPages.Worklist, 10) !== this.state.PageRefreshes){
            this.setState({
                PageRefreshes: parseInt(this.props.RefreshPages.Worklist, 10),
                BranchID:0,
                SelectedBranch:{},
                minimDate: new Date(),
                maximDate: new Date(),
                startDate: new Date(),
                endDate: new Date(),
                isMale:false,
                isFemale:false,
                isChronic:false,
                isPregnant:false,
                UserBranchList: [],
                RequesterPhysicianList:[],
                SelectedDoctors:[],
                SelectedDrs:0,
                SelectedUserBranch:0,
                RadGroupList:[],
                SelectedRadGrps:0,
                SelectedLabTests:0,
                SelectedGroups:[],
                SelectedTests:[],
                RadTestList:[],
            }, ()=>{
                this.componentDidMount();
            })
        }
    }

    render(){
        const {UserBranchList,
            SelectedBranch,
            RadGroupList,
            RadTestList,
            SelectedGroups,
            SelectedTests,
            RequesterPhysicianList,
            SelectedDoctors
        } = this.state;
        return(
            <div className='SidebarComp'>
                <div className='SidebarHeader'>
                    <input type='button'
                    className='SidebarButton'
                    value='&#x25C0;'
                    onClick={this.showHideSideBar}/>
                    Filter Orders
                </div>
                <Select value={SelectedBranch} options={UserBranchList} placeholder='Search Branhes...' className='SidebarSelects' nocaret data-live-search='true' onChange={this.SelectedBranchChanged}/>
                <Select value={SelectedDoctors} options={RequesterPhysicianList} placeholder='Search by Doctor...' className='SidebarSelects' nocaret data-live-search='true' isMulti onChange={this.SelectedDoctorChanged}/>
                <Select value={SelectedGroups} options={RadGroupList} placeholder='Search by Groups...' className='SidebarSelects' nocaret data-live-search='true' isMulti onChange={this.RadGroupChanged}/>
                <Select value={SelectedTests} options={RadTestList} placeholder='Search By Test Name...' className='SidebarSelects' nocaret data-live-search='true' isMulti onChange={this.TestNameChanged}/>
                <div className='Labelss'>Patient Status</div>
                <div className='checks'>
                    <input name="Chronic" 
                        type="checkbox" 
                        checked={this.state.isChronic} 
                        onChange={this.isChronicClicked}/> 
                           {' '} Chronic Disease
                </div>
                <div className='checks'>
                    <input name="Pregnant" 
                        type="checkbox" 
                        checked={this.state.isPregnant} 
                        onChange={this.isPregnantClicked} /> 
                           {' '} Is Pregnant
                </div>
                <div className='Labelss'>Gender</div>
                <div className='checks'>
                    <input name="Chronic" 
                        type="checkbox" 
                        checked={this.state.isMale} 
                        onChange={this.isMaleClicked}/> 
                           {' '} Male
                </div>
                <div className='checks'>
                    <input name="Pregnant" 
                        type="checkbox" 
                        checked={this.state.isFemale} 
                        onChange={this.isFemaleClicked} /> 
                           {' '} Female
                </div>
                <div className='myContainer'>
                <DatePicker
                    customInput={<CustomDatepicker />}
                    selected={this.state.startDate}
                    onChange={this.StartDateSet}
                    dateFormat={moment(this.state.startDate).format("DD/MM/YYYY")}
                    className='react-datepicker react-datepicker-manager'
                    calendarClassName="react-datepicker"
                    popperClassName="react-datepicker__current-month"
                    fixedHeight={true}
                    minDate={this.state.minimDate}
                    maxDate={this.state.endDate}
                    selectsStart
                />
                </div>
                <div className='myContainer'>
                <DatePicker
                    customInput={<CustomDatepicker />}
                    selected={this.state.endDate}
                    onChange={this.EndDateSet}
                    dateFormat={moment(this.state.endDate).format("DD/MM/YYYY")}
                    className='react-datepicker react-datepicker-manager'
                    calendarClassName="react-datepicker"
                    popperClassName="react-datepicker__current-month"
                    fixedHeight={true}
                    minDate={this.state.startDate}
                    maxDate={new Date()}
                    selectsEnd
                />
                </div>

                

            </div>
        )
    }
}

  class CustomDatepicker extends React.Component {

    render () {
      return (
        <div
          className="customdatepicker"
          role='button'
          onClick={this.props.onClick}>
          {this.props.value}
        </div>
      )
    }
  }
  
  CustomDatepicker.propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.string
  };

  const mapDispatchToProps = (dispatch) => ({
    onChangeReqParam: (Parameter, Type) => dispatch(changeRequestParameter(Parameter, Type)),
    setLoadedParameters: (Parameter, Type) => dispatch(setLoadedParameters(Parameter, Type)),
    showHideLoader: (isShow, Type) => dispatch(showHideLoader(isShow, Type)),
    refreshPage: (Parameter, Type) =>dispatch(refreshPage(Parameter, Type))
  })

const mapStateToProps = state => ({
    BranchID: state.ChangeUserAssignedBranch.BranchID,
    ChangeFilters: state.RestoreFilters.ChangeFilters,
    UserToken: state.UserAuthenticationInfo.AuthenticationInfo.AuthenticationToken,
    RefreshPages: state.RefreshPages,
    ToDate: state.ChangeCalendar.ToDate
  })

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(SideBar)
