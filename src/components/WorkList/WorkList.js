import React, { Component } from "react";
import { connect } from "react-redux";
import "./workListStyle.css";
import SideBar from "./SideBar.js";
import SearchComponent from "./SearchComponent.js";
import WorkListGrid from "./WorkListGrid.js";
import DropDownList from "../DropDown/DropDownList.js";
import moment from "moment";
import axios from "axios";
import * as urls from "../../constants/URL";
import Pagination from "react-js-pagination";
import Modal from "react-responsive-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import Select from "react-select";
import { ToastContainer, ToastStore } from "react-toasts";
import RichTextEditor from "react-rte";
import { changeRequestParameter, changeOrdersSearch, setLoadedParameters, changeStatus, refreshPage, saveUserAuthenticationInfo, changeSelectedUserBranch, showHideLoader /*changeDetailsTests, changeDetailsTestsWResults*/ } from "../../actions";
import SweetAlert from 'react-bootstrap-sweetalert';
//import Tooltip from 'react-tooltip-lite';
import { withRouter } from "react-router-dom";
import Attachments from './Attachments'

const PageSizeOptions = [
  { ID: 1, Label: 5 },
  { ID: 2, Label: 10 },
  { ID: 3, Label: 15 },
  { ID: 4, Label: 20 }
];

class WorkList extends Component {
  constructor(props) {
    super();
    this.state = {
      isServiceInfoLoaded: false,
      isLinkedModalitiesLoaded: false,
      isFilmTypesLoaded: false,
      isRisRegisteredRolesLoaded: false,
      isRisFilmsLoaded: false,
      isRisPersonsInChargeLoaded: false,
      isRisReportersLoaded: false,
      isRisTemplatesLoaded: false,
      isReportLoaded: false,
      isAttachmentsLoaded: false,

      isDataFethced: false,
      isSearchComponentLoaded: false,
      isSideBarLoaded: false,
      BrPermissions:{
        RegOpen : false,
        ExOpen : false,
        RepOpen : false,
        AppOpen : false
      },
      XrayID: null,
      PageRefreshes: 0,
      WorkListRefs: 0,
      showSideBar: true,
      WLHomeClass: "WLhomewSidebar",
      RadOrderSearch: [],
      RadOrderSearchCount: 0,
      SelectedPageSize: { ID: 1, Label: 5 },
      Req: {},
      LoadedParameters:{},
      LabTestsStatusColor: "",
      LabTestsStatusText: "",
      MoveNextLabTestsStatusColor: "",
      MoveNextLabTestsStatusText: "",
      ViewDetails: false,
      PatientInfo: {
        Diagnosis: [],
        PatientAge: "",
        PatientDiagnosis: "",
        PatientID: null,
        PatientName: "",
        PatientTemperature: "",
        PatientWeight: ""
      },
      isRequested: true,
      isRequestedDis: false,
      isRequestedBef: false,
      isRegistered: false,
      isRegisteredDis: false,
      isRegisteredBef: false,
      isExamined: false,
      isExaminedDis: false,
      isExaminedBef: false,
      isReported:false,
      isReportedDis: false,
      isReportedBef: false,
      isApproved: false,
      isApprovedDis: false,
      RegTabDis: true,
      ExTabDis: true,
      RepTabDis: true,
      AppTabDis: true,
      AllLabUsers: [],
      SelectedLabUser: -1,
      ReporterChanged: false,
      //Requested
      NoDefinedModality: false,
      isEditSpecimen: false,
      SelectedEditSpecimenInd: null,
      LabOrderTestsCountByTubeList: [],
      AllowAddSpecimen: false,
      AllowEditSpecimen: false,
      AllowDeleteSpecimen: false,
      AllowAddSpecimenAnMoveToPending: false,
      LabOrderSpecimenList:[],
      AddUpdateSpecimenParams:{
        BranchID: null,
        CollectorID: null,
        Comment: '',
        IsMain: null,
        Mode: null,
        SpecimenCode: null,
        OrderID: null
      },
      Comment:'',
      OrderID: null,
      isEditMode: false,
      PreloadedModalities:[],
      SelectedModality:-1,
      RadOrderServiceInfo: {
        MaxAttachedImagesCount: 0,
        MaxAttachedImagesSize: 0,
        ModalityID: 0,
        OrderReason: "",
        ServiceComment: null,
        TechnicianComment: "",
        Test: "",
        TestCode: null,
        TestID: null,
        XrayID: null,
        Message: ''
    },
    RequestedComment:'',
      //Registered
      PreloadedFilmTypes:[],
      SelectedFilmType: -1,
      FilmNumber:'',
      FilmDescription:'',
      RadFilmList:[],
      PreloadedRoles:[],
      SelectedRole: -1,
      RadPersonInChargeList:[],
      FilmPICMissing:false,
      FilmPICMissingMsg: '',
      
      //Examined
      PreloadedReporters:[],
      SelectedReporter:-1,
      tempvalue: RichTextEditor.createEmptyValue(),
      reportChanged: false,
      PreloadedTemplates:[],
      SelectedTemplate:-1,
      notUpdatedMsg: false,
      ReportReporterMsg: '',
      showReportReporterMsg: false,


      LabOrderGroupWithDetailedTestsList:[],
      DetailsTests:{
        ViewDetailsTests:[],
        SelectedTestGrp:0
      },
      showPopUpContainer: false,
      isResend: false,
      isReject: false,
      AnalyzerLabOrderSampleList: [],
      LabOrderTestToRejectList: [],
      showInstructionsPopUpContainer:false,
      //Results
      LabOrderGroupWithResultedTestsDetailedList:[],
      DetailsTestsWResults: {
        ViewDetailsTestsWResults:[],
        ViewDetailsTestsWResultsDisp: [],
        SelectedTestWResultGrp:0
      },
      InitialTests:[],
      GroupResultTemplates: [],
      SelectedGroupResultTemplate: -1,
      ResultComment:'',
      showResultsPop: false,
      ResultsPopupTestInd: null,
      UserInfo:{
        Applications: [
          {
            Authorities: 0
        },{
            Authorities: 0
        },{
            Authorities: 0
        }],
        ArabicName: "",
        AuthenticationToken: "",
        Branches: [],
        Culture: null,
        EnglishName: "",
        ExpiryDateTime: "",
        ITUserIconUrl: "",
        IsITUser: false
    },
    showMoveConfirmationAlert: false,
    showUpdateConfirmationAlert: false,
    RepUpdateParams:{
      Reporter: null,
      ReportContent:RichTextEditor.createEmptyValue(),  
      BranchID:null,
      XrayID:null,
      TestID:null,
      ModalityID:null
    },
    UpdateReportMessage: '',
    ModalityMessage: '',
    ChangeFilters: false,
    PermissionAlertMsg: '',
    showPermissionAlert: false,
    };
    this.checkForDetailsLoaded = this.checkForDetailsLoaded.bind(this);
    this.checkForLoaded = this.checkForLoaded.bind(this);
    this.searchComponentLoaded = this.searchComponentLoaded.bind(this);
    this.sideBarLoaded = this.sideBarLoaded.bind(this);
    this.showHideSideBar = this.showHideSideBar.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onNewPageChanged = this.onNewPageChanged.bind(this);
    this.ChangePageSize = this.ChangePageSize.bind(this);
    this.viewDetails = this.viewDetails.bind(this);
    this.onCloseViewDetailsModal = this.onCloseViewDetailsModal.bind(this);
    //Requested
    this.onModalityChanged = this.onModalityChanged.bind(this);
    this.hideNoDefinedModality = this.hideNoDefinedModality.bind(this);
    this.onRequestedClicked = this.onRequestedClicked.bind(
      this
    );
    this.getRadOrderServiceInfo = this.getRadOrderServiceInfo.bind(this);
    this.getLinkedModalities = this.getLinkedModalities.bind(this);
    this.onRequestedCommentChanged = this.onRequestedCommentChanged.bind(this);
    this.onTechCommentChanged = this.onTechCommentChanged.bind(this);
    this.onRegisterClicked = this.onRegisterClicked.bind(this);
    this.onRegisterOrderClicked = this.onRegisterOrderClicked.bind(this);
    //Registered
    this.onRegisteredClicked = this.onRegisteredClicked.bind(this);
    this.getRISFilmTypes = this.getRISFilmTypes.bind(this);
    this.getRISRegisteredRoles = this.getRISRegisteredRoles.bind(this);
    this.onFilmTypeChanged = this.onFilmTypeChanged.bind(this);
    this.onNumberOfFilmsChanged = this.onNumberOfFilmsChanged.bind(this);
    this.onFilmDescriptionChanged = this.onFilmDescriptionChanged.bind(this);
    this.onAddFilmClicked = this.onAddFilmClicked.bind(this);
    this.getRISFilms = this.getRISFilms.bind(this);
    this.onDeleteFilmClicked = this.onDeleteFilmClicked.bind(this);
    this.onRoleChanged = this.onRoleChanged.bind(this);
    this.onPersonInChargeNameChanged = this.onPersonInChargeNameChanged.bind(this);
    this.onAddPersonInChargeClicked = this.onAddPersonInChargeClicked.bind(this);
    this.getRISPersonsInCharge = this.getRISPersonsInCharge.bind(this);
    this.onDeletePersonInChargeClicked = this.onDeletePersonInChargeClicked.bind(this);
    this.onRegTechCommentChanged = this.onRegTechCommentChanged.bind(this);
    this.hideFilmPICMissing = this.hideFilmPICMissing.bind(this);

    //Examined
    this.onExaminedClicked = this.onExaminedClicked.bind(this);
    this.onTempEditorChange = this.onTempEditorChange.bind(this);
    this.getRISReporters = this.getRISReporters.bind(this);
    this.onSelectedReporterChanged = this.onSelectedReporterChanged.bind(this);
    this.getRISTemplates = this.getRISTemplates.bind(this);
    this.onSelectedTemplateChanged = this.onSelectedTemplateChanged.bind(this);
    this.onResetExaminedTempClicked = this.onResetExaminedTempClicked.bind(this);
    this.onUpdateExaminedTemplateClicked = this.onUpdateExaminedTemplateClicked.bind(this);
    this.onExaTechCommentChanged = this.onExaTechCommentChanged.bind(this);
    this.hidenotUpdatedMsg = this.hidenotUpdatedMsg.bind(this);
    this.onReportClicked = this.onReportClicked.bind(this);
    this.hideReportReporterMsg = this.hideReportReporterMsg.bind(this);
    
    /*Reported*/
    this.onReportedClicked = this.onReportedClicked.bind(this);
    this.getRISReport = this.getRISReport.bind(this);



    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setWrapperRef2 = this.setWrapperRef2.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);



    //Results
    this.setWrapperRef1 = this.setWrapperRef1.bind(this);
    this.showToast = this.showToast.bind(this);
    //this.showTestInformation = this.showTestInformation.bind(this);
    /*Approve*/
    this.onApprovedClicked = this.onApprovedClicked.bind(this);
    this.hideMoveConfirmationAlert = this.hideMoveConfirmationAlert.bind(this);
    this.ConfirmMoveConfirmationAlert = this.ConfirmMoveConfirmationAlert.bind(this);
    this.openMoveConfirmationAlert = this.openMoveConfirmationAlert.bind(this);
    this.hideUpdateConfirmationAlert = this.hideUpdateConfirmationAlert.bind(this);
    this.ConfirmUpdateConfirmationAlert = this.ConfirmUpdateConfirmationAlert.bind(this);
    this.openUpdateConfirmationAlert = this.openUpdateConfirmationAlert.bind(this);
    this.UpdateRep = this.UpdateRep.bind(this);
    this.ResetSelectedPageSize = this.ResetSelectedPageSize.bind(this);
    this.gotoDashboard = this.gotoDashboard.bind(this);
    this.HidePermissionAlert = this.HidePermissionAlert.bind(this);
    this.AttachmentsLoaded = this.AttachmentsLoaded.bind(this);
  }

  AttachmentsLoaded(){
    this.setState({
      isAttachmentsLoaded: true
    }, ()=>{
      this.checkForDetailsLoaded();
    })
  }

  checkForDetailsLoaded(){
    let isRequested = this.state.isRequested;
    let isRegistered = this.state.isRegistered;
    let isExamined = this.state.isExamined;
    let isReported = this.state.isReported;
    let isApproved = this.state.isApproved;
    if(isRequested === true){
      if(this.state.isServiceInfoLoaded && this.state.isLinkedModalitiesLoaded){
        this.props.showHideLoader(false, 'SHOW_HIDE');
      }  
    }else if(isRegistered){
      if(this.state.isServiceInfoLoaded && this.state.isRisFilmsLoaded && this.state.isRisPersonsInChargeLoaded && this.state.isFilmTypesLoaded && this.state.isRisRegisteredRolesLoaded){
        this.props.showHideLoader(false, 'SHOW_HIDE');
      }
    }else if(isExamined || isReported || isApproved){
      if(this.state.isAttachmentsLoaded && this.state.isServiceInfoLoaded && this.state.isRisReportersLoaded && this.state.isRisTemplatesLoaded && this.state.isReportLoaded){
        this.props.showHideLoader(false, 'SHOW_HIDE');
      }
    }
  }

  checkForLoaded(){
    if(this.state.isDataFethced &&
      this.state.isSearchComponentLoaded &&
      this.state.isSideBarLoaded){        
        this.props.showHideLoader(false, 'SHOW_HIDE')
      }
  }

  HidePermissionAlert(){
    this.setState({
      showPermissionAlert: false
    })
  }

  gotoDashboard(){
    this.props.history.push('/dashboard')
  }

  ResetSelectedPageSize(){
    this.setState({
      SelectedPageSize: { ID: 1, Label: 5 }
    })
  }

  onModalityChanged(val){
    const SelectedMod = val.key;
    let RadOrderServiceInfo = Object.assign({}, this.state.RadOrderServiceInfo);
    RadOrderServiceInfo.ModalityID = parseInt(val.value, 10);
    this.setState({
      SelectedModality: SelectedMod,
      RadOrderServiceInfo
    })
  }

  UpdateRep(){
    const RequestParameters = this.state.RepUpdateParams;
    const mom = "?a=" + moment();
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/SaveRISReport${mom}`;
    this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "post",
      url: url,
      data: JSON.stringify(RequestParameters),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        auth_Token: this.props.UserToken
      },
      withCredentials: true
    }).then(response => {
      if (response.data) {
        var responseJson = response.data;
        if (responseJson.HasError) {
          //const Msg = responseJson.ServiceError.Message;
        } else {
          this.setState({
            reportChanged: false,
            reportSaved: true
          },()=>{
            this.getRISReport();
            this.checkForDetailsLoaded();
          })
        }
      }
    })
    .catch(error => {
      const l=2;
    });
  }

  openUpdateConfirmationAlert(){
  }

  ConfirmUpdateConfirmationAlert(){
    this.setState({
      showUpdateConfirmationAlert: false
    }, ()=>{
      this.UpdateRep();
    })
  }

  hideUpdateConfirmationAlert(){
    this.setState({
      showUpdateConfirmationAlert: false
    })
  }

  openMoveConfirmationAlert(){
    const info = this.props.UserAuthenticationInfo;
    var PermissionAlertMsg = '';
    var showPermissionAlert = false;
    var RegOpen = !this.props.BrPermissions.RegOpen;
    var ExOpen = !this.props.BrPermissions.ExOpen;
    var RepOpen= !this.props.BrPermissions.RepOpen;
    var AppOpen = !this.props.BrPermissions.AppOpen;
    if(this.props.UserInfo.IsITUser){
      RegOpen = false;
      ExOpen = false;
      RepOpen = false;
      AppOpen = false;
    }
    if(this.state.isRequested && RegOpen){
      PermissionAlertMsg = 'You are not authorized to move to registered';
      showPermissionAlert = true;
      this.setState({
        PermissionAlertMsg,
        showPermissionAlert
      })
    }else if(this.state.isRegistered && ExOpen){
      PermissionAlertMsg = 'You are not authorized to move to examined';
      showPermissionAlert = true;
      this.setState({
        PermissionAlertMsg,
        showPermissionAlert
      })
    }else if(this.state.isExamined && RepOpen){
      PermissionAlertMsg = 'You are not authorized to move to reported';
      showPermissionAlert = true;
      this.setState({
        PermissionAlertMsg,
        showPermissionAlert
      })
    }else if(this.state.isReported && AppOpen){
      PermissionAlertMsg = 'You are not authorized to move to approved';
      showPermissionAlert = true;
      this.setState({
        PermissionAlertMsg,
        showPermissionAlert
      })
    }else{
    if((this.state.tempvalue.toString("html") === null || this.state.tempvalue.toString("html") === '<p><br></p>' || this.state.tempvalue.toString("html") === '') && !this.state.isRegistered && !this.state.isRequested){
      this.setState({
        showReportReporterMsg: true,
        ReportReporterMsg: "You can't save without a report"
      })
    }else if(this.state.SelectedReporter === -1 && !this.state.isRegistered && !this.state.isRequested){
      this.setState({
        showReportReporterMsg: true,
        ReportReporterMsg: "Please select a reporter"
      })
    }
    else{
    if(this.state.isRegistered){
      if(this.state.RadFilmList.length>0 && this.state.RadPersonInChargeList.length>0){
        this.setState({
          showMoveConfirmationAlert: true
        })
      }
      else if(this.state.RadFilmList.length===0 && this.state.RadPersonInChargeList.length===0){
        this.setState({
          FilmPICMissing: true,
          FilmPICMissingMsg: 'Films and person in charge missing'
        })
      }else if(this.state.RadFilmList.length===0 && this.state.RadPersonInChargeList.length!==0){
        this.setState({
          FilmPICMissing: true,
          FilmPICMissingMsg: 'Films missing'
        })
      }else if(this.state.RadFilmList.length!==0 && this.state.RadPersonInChargeList.length===0){
        this.setState({
          FilmPICMissing: true,
          FilmPICMissingMsg: 'Person in charge missing'
        })
      }
    }else{
    this.setState({
      showMoveConfirmationAlert: true
    })}
  }}
  }

  ConfirmMoveConfirmationAlert(){
    this.setState({
      showMoveConfirmationAlert: false
    }, ()=>{
      this.onRegisterClicked();
    })
  }

  hideMoveConfirmationAlert(){
    this.setState({
      showMoveConfirmationAlert: false
    })
  }

  hideReportReporterMsg(){
    this.setState({
      showReportReporterMsg: false
    })}

  hideFilmPICMissing(){
    this.setState({
      FilmPICMissing: false
    })
  }

  /*Reported*/
  getRISReport(){
    const TestID = this.state.RadOrderServiceInfo.TestID;
    const XrayID= this.state.XrayID;
    const mom = "?a=" + moment();
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/GetRISReport/${XrayID}/${TestID}${mom}`;
    this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "get",
      url: url,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        auth_Token: this.props.UserToken
      },
      withCredentials: true
    }).then(response => {
      if (response.data) {
        var responseJson = response.data;
        if (responseJson.HasError) {
          //const Msg = responseJson.ServiceError.Message;
        } else {
          const RepContent = responseJson.RadServiceReportInfo.ReportContent;
          var tempvalue = RichTextEditor.createValueFromString(RepContent, 'html');
          let PreloadedReporters = [...this.state.PreloadedReporters];
          var SelectedReporter = -1;
          var ReporterChanged = false;
          for(var i=0; i<PreloadedReporters.length; i++){
            if(parseInt(PreloadedReporters[i].value, 10) === parseInt(responseJson.RadServiceReportInfo.Reporter, 10)){
              SelectedReporter = i;
              ReporterChanged = true;
            }
          }
          if(RepContent !== null){
            this.setState({
              tempvalue,
              SelectedReporter,
              ReporterChanged,
              reportSaved: true,
              isReportLoaded: true
            }, ()=>{
              this.checkForDetailsLoaded();
            })
          }else{
            for(var ii=0; ii<PreloadedReporters.length; ii++){
              if(PreloadedReporters[ii].isSelected){
                SelectedReporter = ii
              }
              if(SelectedReporter !== -1){
                this.setState({
                  SelectedReporter,
                  ReporterChanged: true,
                  isReportLoaded: true
                }, ()=>{
                  this.checkForDetailsLoaded();
                })
              }
            }
          }
        }
      }
    })
    .catch(error => {});
  }

  //Examined

  onReportClicked(){
    const info = this.props.UserAuthenticationInfo;
    var PermissionAlertMsg = '';
    var showPermissionAlert = false;
    var RegOpen = !this.props.BrPermissions.RegOpen;
    var ExOpen = !this.props.BrPermissions.ExOpen;
    var RepOpen= !this.props.BrPermissions.RepOpen;
    var AppOpen = !this.props.BrPermissions.AppOpen;
    if(this.props.UserInfo.IsITUser){
      RegOpen = false;
      ExOpen = false;
      RepOpen = false;
      AppOpen = false;
    }
    if(this.state.isRequested && RegOpen){
      PermissionAlertMsg = 'You are not authorized to move to registered';
      showPermissionAlert = true;
      this.setState({
        PermissionAlertMsg,
        showPermissionAlert
      })
    }else if(this.state.isRegistered && ExOpen){
      PermissionAlertMsg = 'You are not authorized to move to examined';
      showPermissionAlert = true;
      this.setState({
        PermissionAlertMsg,
        showPermissionAlert
      })
    }else if(this.state.isExamined && RepOpen){
      PermissionAlertMsg = 'You are not authorized to move to reported';
      showPermissionAlert = true;
      this.setState({
        PermissionAlertMsg,
        showPermissionAlert
      })
    }else if(this.state.isReported && AppOpen){
      PermissionAlertMsg = 'You are not authorized to move to approved';
      showPermissionAlert = true;
      this.setState({
        PermissionAlertMsg,
        showPermissionAlert
      })
    }else{
    const l = this.state.tempvalue.toString("html");
    //if((this.state.ReporterChanged && this.state.reportChanged) || (this.state.tempvalue.toString("html") !== null && this.state.tempvalue.toString("html") !== '<p><br></p>' && this.state.tempvalue.toString("html") !== '' && this.state.SelectedReporter !== -1)){
    if(this.state.reportSaved && this.state.SelectedReporter !== -1){
      this.openMoveConfirmationAlert();
    }else if(!this.state.ReporterChanged && !this.state.reportSaved){
      this.setState({
        showReportReporterMsg: true,
        ReportReporterMsg: "You haven't selected a reporter nor saved a report"
      })
    }else if(!this.state.ReporterChanged && this.state.reportSaved){
      this.setState({
        showReportReporterMsg: true,
        ReportReporterMsg: "You haven't selected a reporter"
      })
    }else if(this.state.ReporterChanged && !this.state.reportSaved){
      this.setState({
        showReportReporterMsg: true,
        ReportReporterMsg: "You haven't saved a report"
      })
    }
  }
  }

  hidenotUpdatedMsg(){
    this.setState({
      notUpdatedMsg: false
    })
  }

  onExaTechCommentChanged(event){
    let RadOrderServiceInfo = Object.assign({}, this.state.RadOrderServiceInfo);
    const TechComment = event.target.value;
    RadOrderServiceInfo.TechnicianComment = TechComment
    this.setState({
      RadOrderServiceInfo
    })
  }

  onUpdateExaminedTemplateClicked(){
    var RequestParameters = {};
    var SelectedReporter = null;
    if(this.state.SelectedReporter!== -1){
      SelectedReporter = this.state.PreloadedReporters[this.state.SelectedReporter].value;
    }
      RequestParameters={
        Reporter: SelectedReporter,
        ReportContent:this.state.tempvalue.toString("html"),  
        BranchID:this.props.BranchID,
        XrayID:this.state.XrayID,
        TestID:this.state.RadOrderServiceInfo.TestID,
        ModalityID:this.state.RadOrderServiceInfo.ModalityID
      }
      var s = this.state.tempvalue.toString("html");
      s.replace(/<[^>]*>?/gm, '');
      const p = this.state.tempvalue.toString("markdown");
      if(!(/[a-z]/i.test(p)) || !isNaN(p)){
        this.setState({
          notUpdatedMsg: true})
      }else if(this.state.reportChanged && this.state.SelectedReporter !== -1){
        var UpdateReport = '';
        if(this.state.isExamined){
          UpdateReport = 'Are you sure you want to save a report?';
        }else{
          UpdateReport = 'Are you sure you want to update a report?';
        }
        this.setState({
          UpdateReportMessage: UpdateReport,
          showUpdateConfirmationAlert: true,
          RepUpdateParams: RequestParameters
        })
      }else{
        this.setState({
          notUpdatedMsg: true})}
  }

  onResetExaminedTempClicked(){
    const s = 5;
    const tempvalue= RichTextEditor.createEmptyValue();
    this.setState({
      tempvalue
    })
  }

  onSelectedTemplateChanged(event){
    const SelectedTemplate = event.key;
    const tempvalue = RichTextEditor.createValueFromString(event.Content, 'html')
    this.setState({
      SelectedTemplate,
      tempvalue
    })
  }

  getRISTemplates(){
    const TestID = this.state.RadOrderServiceInfo.TestID;
    const BranchID= this.props.BranchID;
    const mom = "?a=" + moment();
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/GetRISTemplates/${BranchID}/${TestID}${mom}`;
    this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "get",
      url: url,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        auth_Token: this.props.UserToken
      },
      withCredentials: true
    }).then(response => {
      if (response.data) {
        var responseJson = response.data;
        if (responseJson.HasError) {
          //const Msg = responseJson.ServiceError.Message;
        } else {
          const PreloadedTemplates = responseJson.PreloadedList.map(
            (opt, index) => ({
              value: opt.ID,
              label: opt.Name,
              key: index,
              Content: opt.Content
            })
          );
          var tempvalue = RichTextEditor.createEmptyValue();
          var SelectedTemplate = -1;
          if(PreloadedTemplates.length !== 0){
            //SelectedTemplate = 0;
            if(!this.state.isReported && !this.state.isApproved){
            //tempvalue = RichTextEditor.createValueFromString(PreloadedTemplates[0].Content, 'html') ;
          }
          }
          if(this.state.isExamined){
            this.setState({
              PreloadedTemplates,
              SelectedTemplate,
              isRisTemplatesLoaded: true,
              tempvalue
            }, ()=>{
                this.getRISReport();
                this.checkForDetailsLoaded();
            })
          }else{
          this.setState({
            PreloadedTemplates,
            isRisTemplatesLoaded: true,
            SelectedTemplate
          }, ()=>{
              this.getRISReport();
              this.checkForDetailsLoaded();
          })}
        }
      }
    })
    .catch(error => {});
  }

  onSelectedReporterChanged(event){
    const SelectedReporter = event.key;
    this.setState({
      SelectedReporter,
      ReporterChanged: true
    })
  }

  getRISReporters(){
    const mom = "?a=" + moment();
    const BranchID= this.props.BranchID;
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/GetRISReporters/${BranchID}${mom}`;
    this.props.showHideLoader(true, 'SHOW_HIDE');
    
    axios({
      method: "get",
      url: url,
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
            const PreloadedReporters = responseJson.PreloadedList.map(
              (opt, index) => ({
                value: opt.ID,
                label: opt.Name,
                key: index,
                isSelected: opt.IsSelected
              })
            );
            this.setState({
              PreloadedReporters,
              isRisReportersLoaded: true
            }, ()=>{
              this.checkForDetailsLoaded();
            })
          }
        }
      })
      .catch(error => {});
  }

  onExaminedClicked() {
    if(!this.state.ExTabDis){
    this.setState({
      isRequested: false,
      isRegistered: false,
      isExamined: true,
      isReported: false,
      isApproved: false,
      reportChanged: false
    },()=>{
      //this.getLabOrderTestsDetailedWithResults();
      //this.getLabLabGroupResultTemplates();
      //this.getRISReporters();
      //this.getRISTemplates();
    });}
  }
  
  onTempEditorChange = tempvalue => {
    /*var l = tempvalue.toString('markdown');
    const p = l.trim();
    var m = l.replace(/(\r\n|\n|\r)/gm, "");
    const r = new String(m)
    var ll = r.length;
    var c = 0;
    for(var o=0; o<ll; o++){
      if(r[o] !== ''){
        c++;
      }
    }
    if(c === 0){
    }else{
      this.setState({
        tempvalue
      })
    }*/



    var s = tempvalue.toString("markdown");
    s = s.trim();
    const s0 = tempvalue.toString("html");
    const s1 = s0.split('<p><br></p>')
    if(!(/[a-z]/i.test(s)) && isNaN(s)){
      this.setState({ tempvalue,
        reportChanged: false });
    }else if(s0 === '<p><br></p>'){
      this.setState({
        tempvalue,
        reportChanged: false
      })
    }else{
    if(s === ''){
    }else{
      var count = 0;
      var count1 = 0;
      for(var i=0; i<s1.length; i++){
        if(s1[i] !== '\n' && s1[i] !== '\r'&& s1[i] !== '\r\n' && s1[i] !== '\n\r' && s1[i] !== ""){
          count ++;
        }
      }
      for(var ii=0; ii<s1.length; ii++){
        if(s1[ii] !== ""){
          count1 ++;
        }
      }

      if(count > 0){
        this.setState({ tempvalue,
          reportChanged: true });
      }else{
        this.setState({
        })
      }
    }}


    //if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      //this.props.onChange(tempvalue.toString("html"));
    //}
  };

  /*Reported*/

  onReportedClicked() {
    if(!this.state.RepTabDis){
    this.setState({
      isRequested: false,
      isRegistered: false,
      isExamined: false,
      isReported: true,
      isApproved: false,
      reportChanged: false
    },()=>{
      //this.getLabOrderTestsDetailedWithResults();
      //this.getLabLabGroupResultTemplates();
      //this.getRISReporters();
      //this.getRISTemplates();
    });}
  }

  /*Approved*/

  onApprovedClicked() {
    if(!this.state.AppTabDis){
    this.setState({
      isRequested: false,
      isRegistered: false,
      isExamined: false,
      isReported: false,
      isApproved: true
    },()=>{
      //this.getLabOrderTestsDetailedWithResults();
      //this.getLabLabGroupResultTemplates();
      //this.getRISReporters();
      //this.getRISTemplates();
    });}
  }

  showToast(msg, duration, type) {
    //const msgg = 'Message1';
    //const durationn = 5000;
    //const typee = 1;
    //this.childT.showMyCustomToast(msgg, durationn, typee);
    if (type === 1) {
      ToastStore.success(msg, duration, "ToastCont");
    } else if (type === 2) {
      ToastStore.warning(msg, duration, "ToastCont");
    } else if (type === 3) {
      ToastStore.error(msg, duration, "ToastCont");
    }
  }

  //Registered

  onRegTechCommentChanged(event){
    let RadOrderServiceInfo = Object.assign({}, this.state.RadOrderServiceInfo);
    const TechComment = event.target.value;
    RadOrderServiceInfo.TechnicianComment = TechComment
    this.setState({
      RadOrderServiceInfo
    })
  }

  onDeletePersonInChargeClicked(PersonID){
    if(!this.state.isRegisteredDis)
    {const mom = "?a=" + moment();
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/DeleteRISPersonInCharge${mom}`;
    const RequestParameters={
      PersonID: PersonID
    }
    this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "post",
      url: url,
      data: JSON.stringify(RequestParameters),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        auth_Token: this.props.UserToken
      },
      withCredentials: true
    }).then(response => {
      if (response.data) {
        var responseJson = response.data;
        if (responseJson.HasError) {
          //const Msg = responseJson.ServiceError.Message;
        } else {
          this.props.showHideLoader(false, 'SHOW_HIDE');
          this.getRISPersonsInCharge();
        }
      }
    })
    .catch(error => {});}
  }

  getRISPersonsInCharge(){
    const XrayID = this.state.XrayID;
    const mom = "?a=" + moment();
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/GetRISPersonsInCharge/${XrayID}${mom}`;
    this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "get",
      url: url,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        auth_Token: this.props.UserToken
      },
      withCredentials: true
    }).then(response => {
      if (response.data) {
        var responseJson = response.data;
        if (responseJson.HasError) {
          //const Msg = responseJson.ServiceError.Message;
        } else {
          const RadPersonInChargeList = responseJson.RadPersonInChargeList
          this.setState({
            RadPersonInChargeList,
            isRisPersonsInChargeLoaded: true
          }, ()=>{
            this.checkForDetailsLoaded();
          })
        }
      }
    })
    .catch(error => {});
  }

  onAddPersonInChargeClicked(){
    let RadOrderServiceInfo = Object.assign({}, this.state.RadOrderServiceInfo);
    //alert(JSON.stringify(this.state.RadPersonInChargeList[0]))
    let Name = this.state.PersonInChargeName
    let b = this.state.RadPersonInChargeList.filter(function (obj) {
      return obj.Name.toLowerCase() === Name.toLowerCase()
    });
    if(this.state.SelectedRole !== -1 && this.state.PersonInChargeName !== '' && b.length === 0)
    {
    const RequestParameters={
      RoleID:this.state.PreloadedRoles[this.state.SelectedRole].value,
      Name: this.state.PersonInChargeName,
      XrayID: this.state.XrayID,
      TestID: RadOrderServiceInfo.TestID,
      ModalityID: RadOrderServiceInfo.ModalityID
    }
    const mom = "?a=" + moment();
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/AddRISPersonInCharge${mom}`;
    this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "post",
      url: url,
      data: JSON.stringify(RequestParameters),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        auth_Token: this.props.UserToken
      },
      withCredentials: true
    }).then(response => {
      if (response.data) {
        var responseJson = response.data;
        if (responseJson.HasError) {
          //const Msg = responseJson.ServiceError.Message;
        } else {
          this.setState({
            SelectedRole: -1,
            PersonInChargeName: ''
          }, ()=>{
            this.getRISPersonsInCharge();
          })
        }
      }
    })
    .catch(error => {});
  }else if(b.length > 0 && this.state.SelectedRole !== -1 && this.state.PersonInChargeName !== ''){
    this.setState({
      FilmPICMissingMsg: 'Person In Charge Name Already Exists!',
      FilmPICMissing: true
    })
  }
    else{
      this.setState({
        FilmPICMissingMsg: 'Please Fill All Mandatory Fields!',
        FilmPICMissing: true
      })
    }
  }

  onPersonInChargeNameChanged(event){
    const PersonInChargeName = event.target.value;
    this.setState({
      PersonInChargeName
    })
  }

  onRoleChanged(event){
    const SelectedRole = event.key;
    this.setState({
      SelectedRole
    })
  }

  onDeleteFilmClicked(ServiceFilmID){
    if(!this.state.isRegisteredDis)
    {const mom = "?a=" + moment();
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/DeleteRISFilm${mom}`;
    const RequestParameters={
      ServiceFilmID: ServiceFilmID
    }
    this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "post",
      url: url,
      data: JSON.stringify(RequestParameters),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        auth_Token: this.props.UserToken
      },
      withCredentials: true
    }).then(response => {
      if (response.data) {
        var responseJson = response.data;
        if (responseJson.HasError) {
          //const Msg = responseJson.ServiceError.Message;
        } else {
          this.getRISFilms();
        }
      }
    })
    .catch(error => {});}
  }

  getRISFilms(){
    const XrayID = this.state.XrayID;
    const mom = "?a=" + moment();
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/GetRISFilms/${XrayID}${mom}`;
    this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "get",
      url: url,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        auth_Token: this.props.UserToken
      },
      withCredentials: true
    }).then(response => {
      if (response.data) {
        var responseJson = response.data;
        if (responseJson.HasError) {
          //const Msg = responseJson.ServiceError.Message;
        } else {
          const RadFilmList = responseJson.RadFilmList;
          this.setState({
            RadFilmList,
            isRisFilmsLoaded: true
          }, ()=>{
            this.checkForDetailsLoaded();
          })
        }
      }
    })
    .catch(error => {});
  }

  onAddFilmClicked(){
    let RadOrderServiceInfo = Object.assign({}, this.state.RadOrderServiceInfo);
    if(this.state.SelectedFilmType !== -1 && !isNaN(this.state.FilmNumber) && this.state.FilmNumber !== '')
    {
    const RequestParameters={
      FilmTypeID:this.state.PreloadedFilmTypes[this.state.SelectedFilmType].value,
      Number: this.state.FilmNumber,
      Comments: this.state.FilmDescription,
      PatientID:this.props.Orders.Orders[this.state.OrderIndex].PatientID,
      OrderReason: RadOrderServiceInfo.OrderReason,
      XrayID: this.state.XrayID,
      TestID: RadOrderServiceInfo.TestID,
      ModalityID: RadOrderServiceInfo.ModalityID
    }
    const mom = "?a=" + moment();
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/AddRISFilm${mom}`;
    this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "post",
      url: url,
      data: JSON.stringify(RequestParameters),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        auth_Token: this.props.UserToken
      },
      withCredentials: true
    }).then(response => {
      if (response.data) {
        var responseJson = response.data;
        if (responseJson.HasError) {
          //const Msg = responseJson.ServiceError.Message;
        } else {
          this.setState({
            SelectedFilmType: -1,
            FilmNumber: '',
            FilmDescription: '',
          }, ()=>{
            this.getRISFilms();
          })
        }
      }
    })
    .catch(error => {});}else{
      alert('Please Fill All Mandatory Fields')
    }
  }

  onFilmDescriptionChanged(event){
    const FilmDescription = event.target.value;
    this.setState({
      FilmDescription
    })
  }

  onNumberOfFilmsChanged(event){
    const FilmNumber = event.target.value;
    if(!isNaN(FilmNumber)){
      this.setState({
        FilmNumber
      })
    }
  }

  onFilmTypeChanged(event){
    let a = this.state.RadFilmList.filter(function (obj) {
      return obj.TypeID === event.value
    });
    if(a.length > 0){
      this.setState({
        FilmPICMissingMsg: 'Film Type Already Exists!',
        FilmPICMissing: true
      })
    }
    else{
    const SelectedFilmType = event.key;
    this.setState({
      SelectedFilmType
    })
  }
  }

  getRISRegisteredRoles(){
    const BranchID= this.props.BranchID;
    const mom = "?a=" + moment();
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/GetRISRoles/${BranchID}${mom}`;
    this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "get",
      url: url,
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
          const PreloadedRoles = responseJson.PreloadedList.map(
            (opt, index) => ({
              value: opt.ID,
              label: opt.Name,
              key: index
            })
          );
          
          this.setState({
            PreloadedRoles,
            SelectedRole: -1,
            isRisRegisteredRolesLoaded: true
          }, ()=>{
            this.checkForDetailsLoaded();
          })

        }
      }
    })
    .catch(error => {});
  }

  getRISFilmTypes(){
    const BranchID= this.props.BranchID;
    const mom = "?a=" + moment();
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/GetRISFilmTypes/${BranchID}${mom}`;
    this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "get",
      url: url,
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
          const PreloadedFilmTypes = responseJson.PreloadedList.map(
            (opt, index) => ({
              value: opt.ID,
              label: opt.Name,
              key: index
            })
          );
          
          this.setState({
            PreloadedFilmTypes,
            SelectedFilmType: -1,
            isFilmTypesLoaded: true
          },()=>{
            this.checkForDetailsLoaded();
          })

        }
      }
    })
    .catch(error => {});
  }

  onRegisteredClicked() {
    if(!this.state.RegTabDis){
    this.setState({
      isRequested: false,
      isRegistered: true,
      isExamined: false,
      isReported: false,
      isApproved: false,
      reportChanged: false,
      PersonInChargeName: this.state.UserInfo.EnglishName
    },()=>{
      this.getRISFilms();
      this.getRISPersonsInCharge();
    });}
  }

  //Requested

  hideNoDefinedModality(){
    this.setState({
      NoDefinedModality: false
    })
  }

  onRegisterOrderClicked(){
    const info = this.props.UserAuthenticationInfo;
    var PermissionAlertMsg = '';
    var showPermissionAlert = false;
    var RegOpen = !this.props.BrPermissions.RegOpen;
    var ExOpen = !this.props.BrPermissions.ExOpen;
    var RepOpen= !this.props.BrPermissions.RepOpen;
    var AppOpen = !this.props.BrPermissions.AppOpen;
    if(this.props.UserInfo.IsITUser){
      RegOpen = false;
      ExOpen = false;
      RepOpen = false;
      AppOpen = false;
    }
    if(this.state.isRequested && RegOpen){
      PermissionAlertMsg = 'You are not authorized to move to registered';
      showPermissionAlert = true;
      this.setState({
        PermissionAlertMsg,
        showPermissionAlert
      })
    }else if(this.state.isRegistered && ExOpen){
      PermissionAlertMsg = 'You are not authorized to move to examined';
      showPermissionAlert = true;
      this.setState({
        PermissionAlertMsg,
        showPermissionAlert
      })
    }else if(this.state.isExamined && RepOpen){
      PermissionAlertMsg = 'You are not authorized to move to reported';
      showPermissionAlert = true;
      this.setState({
        PermissionAlertMsg,
        showPermissionAlert
      })
    }else if(this.state.isReported && AppOpen){
      PermissionAlertMsg = 'You are not authorized to move to approved';
      showPermissionAlert = true;
      this.setState({
        PermissionAlertMsg,
        showPermissionAlert
      })
    }else{
    if(this.state.PreloadedModalities.length === 0){
      this.setState({
        NoDefinedModality: true,
        ModalityMessage:'Cannot register the order. Please contact your administrator to link the test to a modality.'
      })
    }else if(this.state.SelectedModality === -1){
      this.setState({
        NoDefinedModality: true,
        ModalityMessage:`Please select a modality before you register your order.`
      })
    }
    else{
      this.openMoveConfirmationAlert();
    }
  }
  }

  onRegisterClicked(){
    let RadOrderServiceInfo = Object.assign({}, this.state.RadOrderServiceInfo);
    var StatusID = 0;
    if(this.state.isRequested){
      StatusID = 2;
    }else if(this.state.isRegistered){
      StatusID = 3;
    }else if(this.state.isExamined){
      StatusID = 4;
    }else if(this.state.isReported){
      StatusID = 5;
    }
    var ModalityID = null;
    if(this.state.SelectedModality === -1){
      ModalityID = RadOrderServiceInfo.ModalityID
    }else{
      ModalityID = this.state.PreloadedModalities[this.state.SelectedModality].value
    }
    const RequestParameters={
      TechnicianComments: RadOrderServiceInfo.TechnicianComment,
      BranchID: this.props.BranchID,
      ServiceComment: RadOrderServiceInfo.ServiceComment,
      Message: RadOrderServiceInfo.Message,
      OrderReason: RadOrderServiceInfo.OrderReason,
      XrayID: this.state.XrayID,
      TestID: RadOrderServiceInfo.TestID,
      ModalityID: ModalityID,
      StatusID: StatusID
    }
    const mom = "?a=" + moment();
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/MoveRISServiceToNextStatus${mom}`;
    if(this.state.isRegistered){
      if(this.state.RadFilmList.length>0 && this.state.RadPersonInChargeList.length>0){
        this.props.showHideLoader(true, 'SHOW_HIDE');
        axios({
          method: "post",
          url: url,
          data: JSON.stringify(RequestParameters),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            auth_Token: this.props.UserToken
          },
          withCredentials: true
        }).then(response => {
          if (response.data) {
            var responseJson = response.data;
            if (responseJson.HasError) {
              //const Msg = responseJson.ServiceError.Message;
            } else {
              const info = this.props.UserAuthenticationInfo;
              var RegOpen = !this.props.BrPermissions.RegOpen;
              var ExOpen = !this.props.BrPermissions.ExOpen;
              var RepOpen= !this.props.BrPermissions.RepOpen;
              var AppOpen = !this.props.BrPermissions.AppOpen;
              if(this.props.UserInfo.IsITUser){
                RegOpen = false;
                ExOpen = false;
                RepOpen = false;
                AppOpen = false;
              }
              if(this.state.isRequested){
                if(ExOpen){
                  this.setState({
                    isRequested: false,
                    isRegistered: true,
                    RegTabDis: false,
                    isExamined: false,
                    isReported: false,
                    isApproved: false,
                    isRequestedBef: true,
                    isExaminedDis: true
                },()=>{
                  this.onRegisteredClicked();
                  this.checkForDetailsLoaded();
                })
                }else{
                  this.setState({
                    isRequested: false,
                    isRegistered: true,
                    RegTabDis: false,
                    isExamined: false,
                    isReported: false,
                    isApproved: false,
                    isRequestedBef: true,},()=>{
                      this.onRegisteredClicked();
                      this.checkForDetailsLoaded();
                    })
                }
              }
              else if(this.state.isRegistered){
                if(RepOpen){
                  this.setState({
                    isRequested: false,
                    isRegistered: false,
                    RegTabDis: false,
                    ExTabDis: false,
                    isExamined: true,
                    isReported: false,
                    isApproved: false,
                    isRequestedBef: true,
                    isRegisteredBef: true,
                    isReportedDis: true,
                },()=>{
                  this.onExaminedClicked();
                  this.getRISReporters();
                  this.getRISTemplates();
                   this.checkForDetailsLoaded()})
              }else{
                  this.setState({
                    isRequested: false,
                    isRegistered: false,
                    isExamined: true,
                    RegTabDis: false,
                    ExTabDis: false,
                    isReported: false,
                    isApproved: false,
                    isRequestedBef: true,
                    isRegisteredBef: true},()=>{
                      this.onExaminedClicked();
                      this.getRISReporters();
                      this.getRISTemplates();
                    this.checkForDetailsLoaded();})
                }
              }else if(this.state.isExamined){
                if(AppOpen){
                this.setState({
                    isRequested: false,
                    isRegistered: false,
                    isExamined: false,
                    isReported: true,
                    RegTabDis: false,
                    ExTabDis: false,
                    RepTabDis: false,
                    isApproved: false,
                    isRequestedBef: true,
                    isRegisteredBef: true,
                    isExaminedBef: true,
                    isApprovedDis: true
                },()=>{
                  this.onReportedClicked();
                  this.getRISReporters();
                  this.getRISTemplates();
                this.checkForDetailsLoaded()})
              }else{
                  this.setState({
                    isRequested: false,
                    isRegistered: false,
                    isExamined: false,
                    isReported: true,
                    RegTabDis: false,
                    ExTabDis: false,
                    RepTabDis: false,
                    isApproved: false,
                    isRequestedBef: true,
                    isRegisteredBef: true,
                    isExaminedBef: true,
                    isApprovedDis: AppOpen},()=>{
                      this.onReportedClicked();
                      this.getRISReporters();
                      this.getRISTemplates();
                    this.checkForDetailsLoaded()})
                }
              }else if(this.state.isReported){
                this.setState({
                  isRequested: false,
                    isRegistered: false,
                    isExamined: false,
                    isReported: false,
                    isApproved: true,
                    RegTabDis: false,
                    ExTabDis: false,
                    RepTabDis: false,
                    AppTabDis: false,
                    isRequestedBef: true,
                    isRegisteredBef: true,
                    isExaminedBef: true,
                    isReportedBef: true
                },()=>{
                  this.onApprovedClicked();
                  this.getRISReporters();
                  this.getRISTemplates();
                this.checkForDetailsLoaded()})
              }
                {/*if(this.state.isRequested){
                  
                }else if(this.state.isRegistered){
                  
                }else if(this.state.isExamined){
                  
                }else if(this.state.isReported){
                  
                }*/}
                this.fetchData();
                //this.onCloseViewDetailsModal();
            }
          }
        })
        .catch(error => {});
      }
      else if(this.state.RadFilmList.length===0 && this.state.RadPersonInChargeList.length===0){
        this.setState({
          FilmPICMissing: true,
          FilmPICMissingMsg: 'Films and person in charge missing'
        })
      }else if(this.state.RadFilmList.length===0 && this.state.RadPersonInChargeList.length!==0){
        this.setState({
          FilmPICMissing: true,
          FilmPICMissingMsg: 'Films missing'
        })
      }else if(this.state.RadFilmList.length!==0 && this.state.RadPersonInChargeList.length===0){
        this.setState({
          FilmPICMissing: true,
          FilmPICMissingMsg: 'Person in charge missing'
        })
      }
    }else
    {
      this.props.showHideLoader(true, 'SHOW_HIDE');
      axios({
      method: "post",
      url: url,
      data: JSON.stringify(RequestParameters),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        auth_Token: this.props.UserToken
      },
      withCredentials: true
    }).then(response => {
      if (response.data) {
        var responseJson = response.data;
        if (responseJson.HasError) {
          //const Msg = responseJson.ServiceError.Message;
        } else {
          this.setState({
          },()=>{
            //ViewDetails: false/
            const info = this.props.UserAuthenticationInfo;
            var RegOpen = !this.props.BrPermissions.RegOpen;
            var ExOpen = !this.props.BrPermissions.ExOpen;
            var RepOpen= !this.props.BrPermissions.RepOpen;
            var AppOpen = !this.props.BrPermissions.AppOpen;
              if(this.props.UserInfo.IsITUser){
                RegOpen = false;
                ExOpen = false;
                RepOpen = false;
                AppOpen = false;
              }
              if(this.state.isRequested){
                if(ExOpen){
                  this.setState({
                    isRequested: false,
                    isRegistered: true,
                    RegTabDis: false,
                    isExamined: false,
                    isReported: false,
                    isApproved: false,
                    isRequestedBef: true,
                    isExaminedDis: true
                },()=>{
                  this.onRegisteredClicked();
                  this.checkForDetailsLoaded();
                })
                }else{
                  this.setState({
                    isRequested: false,
                    isRegistered: true,
                    RegTabDis: false,
                    isExamined: false,
                    isReported: false,
                    isApproved: false,
                    isRequestedBef: true,}, ()=>{
                  this.onRegisteredClicked();
                  this.checkForDetailsLoaded();
                    })
                }
              }
              if(this.state.isRegistered){
                if(RepOpen){
                this.setState({
                    isRequested: false,
                    isRegistered: false,
                    isExamined: true,
                    RegTabDis: false,
                    ExTabDis: false,
                    isReported: false,
                    isApproved: false,
                    isRequestedBef: true,
                    isRegisteredBef: true,
                    isReportedDis: true,
                },()=>{
                  this.onExaminedClicked();
                  this.getRISReporters();
                  this.getRISTemplates();
                this.checkForDetailsLoaded();})
              }else{
                  this.setState({
                    isRequested: false,
                    isRegistered: false,
                    isExamined: true,
                    RegTabDis: false,
                    ExTabDis: false,
                    isReported: false,
                    isApproved: false,
                    isRequestedBef: true,
                    isRegisteredBef: true},()=>{
                      this.onExaminedClicked();
                      this.getRISReporters();
                      this.getRISTemplates();
                    this.checkForDetailsLoaded()})
                }
              }else if(this.state.isExamined){
                if(AppOpen){
                this.setState({
                    isRequested: false,
                    isRegistered: false,
                    isExamined: false,
                    isReported: true,
                    RegTabDis: false,
                    ExTabDis: false,
                    RepTabDis: false,
                    isApproved: false,
                    isRequestedBef: true,
                    isRegisteredBef: true,
                    isExaminedBef: true,
                    isApprovedDis: true
                },()=>{
                  this.onReportedClicked();
                  this.getRISReporters();
                  this.getRISTemplates();
                this.checkForDetailsLoaded();})
              }else{
                  this.setState({
                    isRequested: false,
                    isRegistered: false,
                    isExamined: false,
                    isReported: true,
                    RegTabDis: false,
                    ExTabDis: false,
                    RepTabDis: false,
                    AppTabDis: false,
                    isRequestedBef: true,
                    isRegisteredBef: true,
                    isExaminedBef: true},()=>{
                      this.onReportedClicked();
                      this.getRISReporters();
                      this.getRISTemplates();
                    this.checkForDetailsLoaded();})
                }
              }else if(this.state.isReported){
                this.setState({
                  isRequested: false,
                    isRegistered: false,
                    isExamined: false,
                    isReported: false,
                    isApproved: true,
                    RegTabDis: false,
                    ExTabDis: false,
                    RepTabDis: false,
                    AppTabDis: false,
                    isRequestedBef: true,
                    isRegisteredBef: true,
                    isExaminedBef: true,
                    isReportedBef: true
                },()=>{
                  this.onApprovedClicked();
                  this.getRISReporters();
                  this.getRISTemplates();
                  this.checkForDetailsLoaded();
                })
              }
            this.fetchData();
          })
        }
      }
    })
    .catch(error => {});}
  }

  onTechCommentChanged(event){
    let RadOrderServiceInfo = Object.assign({}, this.state.RadOrderServiceInfo);
    const TechComment = event.target.value;
    RadOrderServiceInfo.TechnicianComment = TechComment
    this.setState({
      RadOrderServiceInfo,
      TechComment
    })
  }

  onRequestedCommentChanged(event){
    let RadOrderServiceInfo = Object.assign({}, this.state.RadOrderServiceInfo);
    const Message = event.target.value;
    RadOrderServiceInfo.Message = Message
    this.setState({
      RadOrderServiceInfo
    })
  }

  onRequestedClicked() {
    this.setState({
      isRequested: true,
      isRegistered: false,
      isExamined: false,
      isReported: false,
      isApproved: false,
      reportChanged: false
    }, ()=>{
      this.checkForDetailsLoaded();
    });
  }

  onCloseViewDetailsModal() {
    this.setState({
      ViewDetails: false,
      isRequested: true,
      isRegistered: false,
      isExamined: false,
      isReported: false,
      isApproved: false,
      reportSaved: false,
      XrayID: null,
      RadOrderServiceInfo: {
        ModalityID: 0,
        OrderReason: "",
        ServiceComment: null,
        RequestedComment:'',
        TechnicianComment: "",
        Test: "",
        TestCode: null,
        TestID: null,
        XrayID: null
    },
    SelectedReporter: -1,
    SelectedTemplate: -1,
    SelectedModality: -1,
    RequestedComment:'',
    tempvalue: RichTextEditor.createEmptyValue(),
    ReporterChanged: false,
    reportChanged: false,
    PersonInChargeName: '',
    RadPersonInChargeList:[],
    RadFilmList:[],
    SelectedFilmType: -1,
    PersonIncharge: -1,
    PreloadedReporters: [],
    FilmNumber: null
    }, ()=>{
      //this.props.changeDetailsTests(null, 'CLOSE_DETAILS_MODAL');
    });
  }

  getLinkedModalities(TestID, OrderIndex){
    const mom = "?a=" + moment();
    const BranchID = this.props.BranchID;
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/GetRISServiceLinkedModalities/${TestID}/${BranchID}${mom}`;
    this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "get",
      url: url,
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
          const PreloadedModalities = responseJson.PreloadedList.map(
            (opt, index) => ({
              value: opt.ID,
              label: opt.Name,
              key: index
            })
          );
        var SelectedModality = -1;
          for(var i=0; i<PreloadedModalities.length; i++){
            if(PreloadedModalities[i].label === this.props.Orders.Orders[OrderIndex].Modality){
              SelectedModality = i;
            }
          }

          this.setState({
            PreloadedModalities,
            SelectedModality,
            isLinkedModalitiesLoaded: true
          }, ()=>{
            this.checkForDetailsLoaded();
          });
        }
      }
    })
    .catch(error => {});
  }

  getRadOrderServiceInfo(OrderID, TestID) {
    //const BranchID = this.props.Req.BranchID;
    const mom = "?a=" + moment();
    const url = `${
      urls.URL
    }RadOrderDetailWebService.svc/GetRadOrderServiceInfo/${OrderID}/${TestID}${mom}`;
    this.props.showHideLoader(true, 'SHOW_HIDE');
    axios({
      method: "get",
      url: url,
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
            const RadOrderServiceInfo = responseJson.RadOrderServiceInfo;

            this.setState({
              RadOrderServiceInfo,
              isServiceInfoLoaded: true
            },()=>{
                this.getRISReporters();
                this.getRISTemplates();
                this.checkForDetailsLoaded();
            }
            );
          }
        }
      })
      .catch(error => {});
  }

  //WorkList

  viewDetails(OrderID, OrderIndex, TestID, XrayID) {
    this.getRadOrderServiceInfo(OrderID, TestID);
    this.getLinkedModalities(TestID, OrderIndex);
    this.getRISFilmTypes();
    this.getRISRegisteredRoles();
    /*this.getLabOrderTestsCountByTube(OrderID);
    this.getLabOrderSpecimenPermissions(OrderID);
    this.getLabOrdersSpecimens(OrderID);*/
    //var ReqOpen = true;
    const info = this.props.UserAuthenticationInfo;
    var RegOpen = !this.props.BrPermissions.RegOpen;
    var ExOpen = !this.props.BrPermissions.ExOpen;
    var RepOpen= !this.props.BrPermissions.RepOpen;
    var AppOpen = !this.props.BrPermissions.AppOpen;
    if(this.props.UserInfo.IsITUser){
      RegOpen = false;
      ExOpen = false;
      RepOpen = false;
      AppOpen = false;
    }
    const mom = "?a=" + moment();
    const url = `${urls.URL}RadOrderDetailWebService.svc/GetPatientInfo/${OrderID}${mom}`;
    this.props.showHideLoader(true, 'SHOW_HIDE')
    axios({
      method: "get",
      url: url,
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
            const PatientInfo = responseJson.PatientInfo;
            var ViewDetails = true;
            if(this.props.Statuses.Statuses[this.props.Statuses.SelectedStatusIndex].StatusID === 1){
              this.setState({
                XrayID: XrayID,
                ViewDetails: true,
                PatientInfo,
                isRequested: true,
                isRegistered: false,
                isExamined: false,
                isReported: false,
                isApproved: false,
                isRegisteredDis: RegOpen,
                isExaminedDis: ExOpen,
                isReportedDis: RepOpen,
                isApprovedDis: AppOpen,
                isRequestedBef: false,
                isRegisteredBef: false,
                isExaminedBef: false,
                isReportedBef: false,
                RegTabDis: true,
                ExTabDis: true,
                RepTabDis: true,
                AppTabDis: true,
                OrderID,
                OrderIndex,
                reportChanged: false,
                RequestedComment:'',
                TechnicianComment: "",
              }, ()=>{
                this.onRequestedClicked();
              });
            }else if(this.props.Statuses.Statuses[this.props.Statuses.SelectedStatusIndex].StatusID === 2){
              if(RegOpen){
                ViewDetails = true
              }
              this.setState({
                XrayID: XrayID,
                ViewDetails: ViewDetails,
                PatientInfo,
                isRequested: false,
                isRegistered: true,
                isExamined: false,
                isReported: false,
                isApproved: false,
                isRegisteredDis: RegOpen,
                isExaminedDis: ExOpen,
                isReportedDis: RepOpen,
                isApprovedDis: AppOpen,
                isRequestedBef: true,
                isRegisteredBef: false,
                isExaminedBef: false,
                isReportedBef: false,
                RegTabDis: false,
                ExTabDis: true,
                RepTabDis: true,
                AppTabDis: true,
                OrderID,
                OrderIndex
              }, ()=>{
                this.onRegisteredClicked();
              });
            }else if(this.props.Statuses.Statuses[this.props.Statuses.SelectedStatusIndex].StatusID === 3){
              if(ExOpen){
                ViewDetails = true
              }
              this.setState({
                XrayID: XrayID,
                ViewDetails: ViewDetails,
                PatientInfo,
                isRequested: false,
                isRegistered: false,
                isExamined: true,
                isReported: false,
                isApproved: false,
                isRegisteredDis: RegOpen,
                isExaminedDis: ExOpen,
                isReportedDis: RepOpen,
                isApprovedDis: AppOpen,
                isRequestedBef: true,
                isRegisteredBef: true,
                isExaminedBef: false,
                isReportedBef: false,
                RegTabDis: false,
                ExTabDis: false,
                RepTabDis: true,
                AppTabDis: true,
                OrderID,
                OrderIndex
              }, ()=>{
                this.onExaminedClicked();
              });
            }else if(this.props.Statuses.Statuses[this.props.Statuses.SelectedStatusIndex].StatusID === 4){
              if(RepOpen){
                ViewDetails = true
              }
              this.setState({
                XrayID: XrayID,
                ViewDetails: ViewDetails,
                PatientInfo,
                isRequested: false,
                isRegistered: false,
                isExamined: false,
                isReported: true,
                isApproved: false,
                isRegisteredDis: RegOpen,
                isExaminedDis: ExOpen,
                isReportedDis: RepOpen,
                isApprovedDis: AppOpen,
                isRequestedBef: true,
                isRegisteredBef: true,
                isExaminedBef: true,
                isReportedBef: false,
                RegTabDis: false,
                ExTabDis: false,
                RepTabDis: false,
                AppTabDis: true,
                OrderID,
                OrderIndex
              }, ()=>{
                this.onReportedClicked();
              });
            }else if(this.props.Statuses.Statuses[this.props.Statuses.SelectedStatusIndex].StatusID === 5){
              if(AppOpen){
                ViewDetails = true
              }
              this.setState({
                XrayID: XrayID,
                ViewDetails: ViewDetails,
                PatientInfo,
                isRequested: false,
                isRegistered: false,
                isExamined: false,
                isReported: false,
                isApproved: true,
                isRegisteredDis: RegOpen,
                isExaminedDis: ExOpen,
                isReportedDis: RepOpen,
                isApprovedDis: AppOpen,
                isRequestedBef: true,
                isRegisteredBef: true,
                isExaminedBef: true,
                isReportedBef: true,
                RegTabDis: false,
                ExTabDis: false,
                RepTabDis: false,
                AppTabDis: false,
                OrderID,
                OrderIndex
              }, ()=>{
                this.onApprovedClicked();
              });
            }
          }
        }
      })
      .catch(error => {});
  }

  ChangePageSize(event) {
    const Parameter = parseInt(event.Label);
    this.setState(
      {
        SelectedPageSize: event
      },
      () => {
        this.props.onChangeReqParam(Parameter, "CHANGE_PAGESIZE");
      }
    );
  }

  onNewPageChanged(pageNumber) {
    const Parameter = parseInt(pageNumber);
    this.props.onChangeReqParam(Parameter, "CHANGE_PAGENUMBER");
  }

  fetchData() {
    const mom = "?a=" + moment();
    let LoadedParameters = Object.assign({}, this.props.LoadedParameters)
    const url = `${urls.URL}RadOrderWorklistWebService.svc/GetRadOrders${mom}`;
    let Req = Object.assign({}, this.props.Req);
    let Req1 = Object.assign({}, this.props.Req);
    if(Req.OrderID !== null){
      Req1.BranchID = null;
      Req1.DateFrom = null;
      Req1.DateTo = null;
      Req1.Gender = null;
      Req1.PageNumber = 1;
      Req1.PageSize = 5;
      Req1.Patient = null;
      Req1.Physicians = null;
      Req1.RadGroups = null;
      Req1.SortCol = 1;
      Req1.SortMode = 2;
      Req1.TestStatusID = 0;
      Req1.Type = null;
    }
    if (Req.BranchID !== 0 && LoadedParameters.PhysiciansLoaded && LoadedParameters.RadGroupsLoaded && LoadedParameters.RadTestsLoaded && LoadedParameters.BranchesLoaded && LoadedParameters.StatusesLoaded) {
      if (parseInt(localStorage.getItem("BranchID"))) {
        //alert('a33333');
      }
      this.props.showHideLoader(true, 'SHOW_HIDE');
      axios({
        method: "post",
        url: url,
        data: JSON.stringify(Req1),
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
              var RadOrderSearch = responseJson.RadOrderSearch.Page;

              const RadOrderSearchCount =
                responseJson.RadOrderSearch.SearchCount;
              const Parameters = {
                Orders: RadOrderSearch,
              };
              const EParameters = {
                Orders: [],
              };
              this.props.changeOrders(EParameters, "SAVE_ORDERS");
              this.setState(
                {
                  RadOrderSearch,
                  RadOrderSearchCount,
                  Req,isDataFethced: true
                },
                () => {
                  if(Req.OrderID !== null){
                    if(RadOrderSearch.length > 0){
                      const StatusID = RadOrderSearch[0].RadTestStatus;
                      var StatusInd = null;
                      for(var i=0; i<this.props.Statuses.Statuses.length; i++){
                        if(parseInt(this.props.Statuses.Statuses[i].StatusID, 10) === parseInt(StatusID, 10)){
                          StatusInd = i;
                        }
                      }
                      //this.props.onChangeReqParam(StatusID, 'CHANGE_SORTSTATUS');
                      this.props.changeStatus(StatusInd, 'CHANGE_SELECTED_STATUS');
                    }
                    //const StatusInd = SelectedFilter.ID;
                    //const StatusID = this.props.Statuses.Statuses[StatusInd].StatusID;
                  }
                  this.props.changeOrders(Parameters, "SAVE_ORDERS");
                  this.checkForLoaded();
                }
              );
            }
          }
        })
        .catch(error => {
          alert('err')
        });
    }
  }

  searchComponentLoaded(){
    this.setState({
      isSearchComponentLoaded: true
    }, () =>{
      this.checkForLoaded();
    })
  }

  sideBarLoaded(){
    this.setState({
      isSideBarLoaded: true
    }, () =>{
      this.checkForLoaded();
    })
  }

  showHideSideBar() {
    var cls = "";
    if (this.state.showSideBar) {
      cls = "WLhomewoSidebar";
    } else {
      cls = "WLhomewSidebar";
    }
    this.setState({
      showSideBar: !this.state.showSideBar,
      WLHomeClass: cls
    });
  }

  componentDidUpdate() {
    if(this.props.BrPermissions !== this.state.BrPermissions){
      this.setState({
        BrPermissions: this.props.BrPermissions
      })
    }

    if(this.props.ChangeFilters !== this.state.ChangeFilters){
      this.setState({
          ChangeFilters: this.props.ChangeFilters
      },()=>{
        this.fetchData();
      })
    }

    if(this.props.LoadedParameters !== this.state.LoadedParameters){
      this.setState({
        LoadedParameters: this.props.LoadedParameters
      },()=>{
        this.fetchData();
      })
    }

    if(JSON.stringify(this.state.Req) !== JSON.stringify(this.props.Req)) {
      this.setState({
        Req: this.props.Req
      },()=>{
        this.fetchData();
      })
      
    }

    if(this.state.RadOrderSearch !== this.props.Orders) {
      this.setState({
        RadOrderSearch:  this.props.Orders
       });
    }

    if(parseInt(this.props.RefreshPages.Worklist, 10) !== this.state.PageRefreshes){
      this.setState({
        BrPermissions:{
          RegOpen : false,
          ExOpen : false,
          RepOpen : false,
          AppOpen : false
        },
        PageRefreshes: parseInt(this.props.RefreshPages.Worklist, 10),
        WorkListRefs: 0,
          showSideBar: true,
          WLHomeClass: "WLhomewSidebar",
          RadOrderSearch: [],
          RadOrderSearchCount: 0,
          SelectedPageSize: { ID: 1, Label: 5 },
          Req: {},
          LoadedParameters:{},
          LabTestsStatusColor: "",
          LabTestsStatusText: "",
          MoveNextLabTestsStatusColor: "",
          MoveNextLabTestsStatusText: "",
          ViewDetails: false,
          PatientInfo: {
            Diagnosis: [],
            PatientAge: "",
            PatientDiagnosis: "",
            PatientID: null,
            PatientName: "",
            PatientTemperature: "",
            PatientWeight: ""
          },
          isRequested: true,
          isRequestedDis: false,
          isRequestedBef: false,
          isRegistered: false,
          isRegisteredDis: false,
          isRegisteredBef: false,
          isExamined: false,
          isExaminedDis: false,
          isExaminedBef: false,
          isReported:false,
          isReportedDis: false,
          isReportedBef: false,
          isApproved: false,
          isApprovedDis: false,
          RegTabDis: true,
          ExTabDis: true,
          RepTabDis: true,
          AppTabDis: true,
          AllLabUsers: [],
          SelectedLabUser: -1,
          ReporterChanged: false,
          //Requested
          NoDefinedModality: false,
          isEditSpecimen: false,
          SelectedEditSpecimenInd: null,
          LabOrderTestsCountByTubeList: [],
          AllowAddSpecimen: false,
          AllowEditSpecimen: false,
          AllowDeleteSpecimen: false,
          AllowAddSpecimenAnMoveToPending: false,
          LabOrderSpecimenList:[],
          AddUpdateSpecimenParams:{
            BranchID: null,
            CollectorID: null,
            Comment: '',
            IsMain: null,
            Mode: null,
            SpecimenCode: null,
            OrderID: null
          },
          Comment:'',
          OrderID: null,
          isEditMode: false,
          PreloadedModalities:[],
          SelectedModality:-1,
          XrayID: null,
          RadOrderServiceInfo: {
            ModalityID: 0,
            OrderReason: "",
            ServiceComment: null,
            TechnicianComment: "",
            Test: "",
            TestCode: null,
            TestID: null,
            XrayID: null,
            Message: ''
        },
        RequestedComment:'',
          //Registered
          PreloadedFilmTypes:[],
          SelectedFilmType: -1,
          FilmNumber:'',
          FilmDescription:'',
          RadFilmList:[],
          PreloadedRoles:[],
          SelectedRole: -1,
          RadPersonInChargeList:[],
          FilmPICMissing:false,
          FilmPICMissingMsg: '',
          
          //Examined
          PreloadedReporters:[],
          SelectedReporter:-1,
          tempvalue: RichTextEditor.createEmptyValue(),
          reportChanged: false,
          PreloadedTemplates:[],
          SelectedTemplate:-1,
          notUpdatedMsg: false,
          ReportReporterMsg: '',
          showReportReporterMsg: false,
    
    
          LabOrderGroupWithDetailedTestsList:[],
          DetailsTests:{
            ViewDetailsTests:[],
            SelectedTestGrp:0
          },
          showPopUpContainer: false,
          isResend: false,
          isReject: false,
          AnalyzerLabOrderSampleList: [],
          LabOrderTestToRejectList: [],
          showInstructionsPopUpContainer:false,
          //Results
          LabOrderGroupWithResultedTestsDetailedList:[],
          DetailsTestsWResults: {
            ViewDetailsTestsWResults:[],
            ViewDetailsTestsWResultsDisp: [],
            SelectedTestWResultGrp:0
          },
          InitialTests:[],
          GroupResultTemplates: [],
          SelectedGroupResultTemplate: -1,
          ResultComment:'',
          showResultsPop: false,
          ResultsPopupTestInd: null,
          UserInfo:{
            Applications: [
              {
                Authorities: 0
            },{
                Authorities: 0
            },{
                Authorities: 0
            }],
            ArabicName: "",
            AuthenticationToken: "",
            Branches: [],
            Culture: null,
            EnglishName: "",
            ExpiryDateTime: "",
            ITUserIconUrl: "",
            IsITUser: false
        },
        showMoveConfirmationAlert: false,
        showUpdateConfirmationAlert: false,
        RepUpdateParams:{
          Reporter: null,
          ReportContent:RichTextEditor.createEmptyValue(),  
          BranchID:null,
          XrayID:null,
          TestID:null,
          ModalityID:null
        },
        UpdateReportMessage: '',
        ModalityMessage: ''
      }, ()=>{
        const EParameters = {
          Orders: [],
        };
        this.props.changeOrders(EParameters, "SAVE_ORDERS");
        const Parameter = {
          UserId: this.props.Req.UserID,
          BranchID: this.props.Req.BranchID
        };
        this.props.onChangeReqParam(Parameter, 'GET_TODAYS_ORDERS');
        this.componentDidMount();
        
      })
    }

    /*const DetailsTests = this.props.DetailsTests;
    if(this.state.DetailsTests !== DetailsTests){
      this.setState({
        DetailsTests: DetailsTests
      })
    }

    const DetailsTestsWResults = this.props.DetailsTestsWResults;
    if(this.state.DetailsTestsWResults !== DetailsTestsWResults){
      this.setState({
        DetailsTestsWResults: DetailsTestsWResults
      }, ()=>{
        this.getLabLabGroupResultTemplates();
      })
    }

    if(this.props.WorkListRefs !== this.state.WorkListRefs){
      this.setState({
        WorkListRefs: this.props.WorkListRefs,
        showSideBar: true,
        RadOrderSearch: [],
        RadOrderSearchCount: 0,
        SelectedPageSize: { ID: 1, Label: 5 },
        Req: {},
        LabTestsStatusColor: "",
        LabTestsStatusText: "",
        MoveNextLabTestsStatusColor: "",
        MoveNextLabTestsStatusText: "",
        ViewDetails: false,
        PatientInfo: {
        Diagnosis: [],
        PatientAge: "",
        PatientDiagnosis: "",
        PatientID: null,
        PatientName: "",
        PatientTemperature: "",
        PatientWeight: ""
      },
      isRequested: true,
      isRegistered: false,
      isExamined: false,
      AllLabUsers: [],
      SelectedLabUser: -1,
      //Specimen
      isEditSpecimen: false,
      SelectedEditSpecimenInd: null,
      LabOrderTestsCountByTubeList: [],
      AllowAddSpecimen: false,
      AllowEditSpecimen: false,
      AllowDeleteSpecimen: false,
      AllowAddSpecimenAnMoveToPending: false,
      LabOrderSpecimenList:[],
      AddUpdateSpecimenParams:{
        BranchID: null,
        CollectorID: null,
        Comment: '',
        IsMain: null,
        Mode: null,
        SpecimenCode: null,
        OrderID: null
      },
      Comment:'',
      OrderID: null,
      isEditMode: false,
      //Tests
      LabOrderGroupWithDetailedTestsList:[],
      DetailsTests:{
        ViewDetailsTests:[],
        SelectedTestGrp:0
      },
      showPopUpContainer: false,
      isResend: false,
      isReject: false,
      AnalyzerLabOrderSampleList: [],
      LabOrderTestToRejectList: [],
      showInstructionsPopUpContainer:false,
      //Results
      LabOrderGroupWithResultedTestsDetailedList:[],
      DetailsTestsWResults: {
        ViewDetailsTestsWResults:[],
        ViewDetailsTestsWResultsDisp: [],
        SelectedTestWResultGrp:0
      },
      InitialTests:[],
      GroupResultTemplates: [],
      SelectedGroupResultTemplate: -1,
      ResultComment:'',
      showResultsPop: false,
      ResultsPopupTestInd: null
      },()=>{
        this.componentDidMount()
      })
    }*/
  }

  componentWillUnmount(){
    this.props.onChangeReqParam(null, 'CHANGE_ORDERID');
    document.removeEventListener('mousedown', this.handleClickOutside);
    var Parameter = 0;
    this.props.refreshPage(Parameter, 'REFRESH_WORKLIST');
    this.props.onChangeReqParam(Parameter, 'GET_TODAYS_ORDERS');
  }

  componentDidMount(){
    document.addEventListener('mousedown', this.handleClickOutside);
    this.setState({
      UserInfo: this.props.UserInfo
    })
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

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if(this.state.showPopUpContainer){
      this.setState({
        showPopUpContainer: false,
        isReject: false,
        isResend: false
      });}
    }else if (this.wrapperRef1 && !this.wrapperRef1.contains(event.target)) {
      if(this.state.showResultsPop){
      this.setState({
        showResultsPop: false,
        ResultsPopupTestInd: null
      });}
    }
    else if (this.wrapperRef2 && !this.wrapperRef2.contains(event.target)) {
      this.setState({
        showInstructionsPopUpContainer: false,
        LabTestInstructionList: null
      });
    }
  }
  
  componentWillMount(){
    if(parseInt(this.props.UserAuth, 10) === 0 && !this.props.IsITUser){
        //this.props.history.push("/notauthorizedpage");
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

  render() {
    var MoveNextLabTestsStatusText = "";
    var MoveNextLabTestsStatusColor = "";
    const l = this.state.tempvalue;
    const {
      LabTestsStatusColor,
      WLHomeClass,
      RadOrderSearchCount,
      RadOrderSearch,
      SelectedPageSize,
      //ShouldchangeAll,
      showSideBar,
      ViewDetails,
      PatientInfo,
      isRequested,
      isRegistered,
      isExamined,
      isReported,
      isApproved,
      AllLabUsers,
      SelectedLabUser,
      NoDefinedModality,
      LabOrderTestsCountByTubeList,
      AllowAddSpecimen,
      AllowEditSpecimen,
      AllowDeleteSpecimen,
      AllowAddSpecimenAnMoveToPending,
      LabOrderSpecimenList,
      DetailsTests,
      showPopUpContainer,
      isReject,
      isResend,
      AnalyzerLabOrderSampleList,
      LabOrderTestToRejectList,
      DetailsTestsWResults,
      GroupResultTemplates,
      SelectedGroupResultTemplate,
      ResultComment,
      showResultsPop,
      ResultsPopupTestInd,
      showInstructionsPopUpContainer,
      LabTestInstructionList,
      PreloadedModalities,
      SelectedModality,
      RadOrderServiceInfo,
      RequestedComment,
      PreloadedFilmTypes,
      SelectedFilmType,
      FilmNumber,
      FilmDescription,
      RadFilmList,
      PreloadedRoles,
      SelectedRole,
      PersonInChargeName,
      RadPersonInChargeList,
      PreloadedReporters,
      SelectedReporter,
      PreloadedTemplates,
      SelectedTemplate,
      isRequestedBef,
      isRegisteredBef,
      isExaminedBef,
      isReportedBef,
      showDeleteAlert1,
      showDeleteAlert2,
      notUpdatedMsg,
      FilmPICMissing,
      FilmPICMissingMsg,
      ReportReporterMsg,
      showReportReporterMsg,
      UserInfo,
      showMoveConfirmationAlert,
      showUpdateConfirmationAlert,
      UpdateReportMessage,
      isRegisteredDis,
      isExaminedDis,
      isReportedDis,
      isApprovedDis,
      ModalityMessage,
      PermissionAlertMsg,
      showPermissionAlert,
      AttachmentsOpens
    } = this.state;


    var n = SelectedModality;
    var nn = PreloadedModalities;
    var SelectedTemp = {
      value: -1,
      label: '',
      key:-1
    };

    if(SelectedTemplate !== -1){
      SelectedTemp = {
        value: PreloadedTemplates[SelectedTemplate].value,
        label: PreloadedTemplates[SelectedTemplate].label,
        key: PreloadedTemplates[SelectedTemplate].key
      }
    }

    var SelectedRep = {
      value: -1,
      label: '',
      key:-1
    };

    if(SelectedReporter !== -1){
      SelectedRep = {
        value: PreloadedReporters[SelectedReporter].value,
        label: PreloadedReporters[SelectedReporter].label,
        key: PreloadedReporters[SelectedReporter].key
      }
    }

    var SelectedFilmType1 = {
      value: -1,
      label: '',
      key:-1
    }
    if(SelectedFilmType !== -1){
      SelectedFilmType1 = {
        value: PreloadedFilmTypes[SelectedFilmType].value,
        label: PreloadedFilmTypes[SelectedFilmType].label,
        key: PreloadedFilmTypes[SelectedFilmType].key
      }
    }

    var SelectedRole1 = {
      value: -1,
      label: '',
      key:-1
    }
    if(SelectedRole !== -1){
      SelectedRole1 = {
        value: PreloadedRoles[SelectedRole].value,
        label: PreloadedRoles[SelectedRole].label,
        key: PreloadedRoles[SelectedRole].key
      }
    }

    let Orders = [...this.props.Orders.Orders];
    var isCanceled = false;
    if (this.props.Statuses.Statuses.length > 0 && parseInt(this.props.Statuses.SelectedStatusIndex, 10) !== -1) {
      MoveNextLabTestsStatusText = this.props.Statuses.Statuses[
        this.props.Statuses.SelectedStatusIndex
      ].MoveToNextStatusText;
      MoveNextLabTestsStatusColor = this.props.Statuses.Statuses[
        this.props.Statuses.SelectedStatusIndex
      ].NextStatusColor;

      if (this.props.Statuses.Statuses[this.props.Statuses.SelectedStatusIndex].StatusID === 0 || this.props.Statuses.Statuses[this.props.Statuses.SelectedStatusIndex].StatusID === 4)
       {
        isCanceled = true;
      }
    }

    var SelectedUser = AllLabUsers[SelectedLabUser];
    if(SelectedLabUser === -1 || SelectedLabUser === null){
      SelectedUser={
        value: -1,
        label: ''
      }
    }

    var Modali = {
      value: -1,
      label: ''
    };

    if(isRequestedBef){
      for(var i=0; i<PreloadedModalities.length; i++){
        if(RadOrderServiceInfo.ModalityID !== 0 && RadOrderServiceInfo.ModalityID !== null){
          if(parseInt(RadOrderServiceInfo.ModalityID, 10) === parseInt(PreloadedModalities[i].value, 10)){
            Modali = PreloadedModalities[i]
          }
        }
      }
    }else if(SelectedModality !== -1){
      Modali = PreloadedModalities[SelectedModality]
    }


    return (
      <div className="WorkListPage">
      {/*<ToastContainer
          store={ToastStore}
          position={ToastContainer.POSITION.TOP_CENTER}
          className="MyToastContainer"
      />*/ }
        <div className="WLbreadCrumb">
          <span onClick={this.gotoDashboard} className="WLbreadCrumblink HomePage">
            Home{" "}
          </span>
          <span> {">"} Worklist </span>
        </div>
        <Modal
          open={ViewDetails}
          onClose={this.onCloseViewDetailsModal}
          classNames={{
            overlay: "",
            modal: "ViewDetailsModal",
            closeIcon: "ViewDetailsClosebtn"
          }}
        >
          <div>

            <SweetAlert
                show={showPermissionAlert}
                custom
                title=''
                confirmBtnText="Ok"
                confirmBtnCssClass="ConfirmAlertBtn"
                customClass="DeleteAlertClass"
                cancelBtnCssClass="CancelAlertBtn"
	            customIcon=""
                onConfirm={this.HidePermissionAlert}
            >
	            {PermissionAlertMsg}
            </SweetAlert>
            
          <SweetAlert
                show={showUpdateConfirmationAlert}
                custom
                title=''
                showCancel
                cancelBtnText="No"
                confirmBtnText="Yes"
                confirmBtnCssClass="ConfirmAlertBtn"
                customClass="DeleteAlertClass"
                cancelBtnCssClass="CancelAlertBtn"
	            customIcon=""
                onCancel={this.hideUpdateConfirmationAlert}
                onConfirm={this.ConfirmUpdateConfirmationAlert}
            >
	            {UpdateReportMessage}
            </SweetAlert>

          <SweetAlert
                show={showMoveConfirmationAlert}
                custom
                title=''
                showCancel
                cancelBtnText="No"
                confirmBtnText="Yes"
                confirmBtnCssClass="ConfirmAlertBtn"
                customClass="DeleteAlertClass"
                cancelBtnCssClass="CancelAlertBtn"
	            customIcon=""
                onCancel={this.hideMoveConfirmationAlert}
                onConfirm={this.ConfirmMoveConfirmationAlert}
            >
	            Are You Sure You Want To Move The Order?
            </SweetAlert>
          <ViewDetailsHearders PatientInfo={PatientInfo} />
            {showInstructionsPopUpContainer ? 
        <div className='PopUpContainerIns' ref={this.setWrapperRef2}>
              <div className='ResPopUpContentContainer'>
                <div className='ResPopupHeader'>
                  <div className='TitleCont'>Tests Instructions</div>
                </div>
                <div className='ResPopUpTable'>
                <div className='ResPopUpTableHeader'>
                  <div className='InstPopUpTableRow1'>Instruction to</div>
                  <div className='InstPopUpTableRow2'>Name</div>
                  <div className='InstPopUpTableRow3'>Description</div>
                  <div className='InstPopUpTableRow4'></div>
                </div>
                {/*{LabTestInstructionList.map((opt, index)=>(
                  <TestsInstuctionsGrid 
                  Instruction={opt}
                  ind={index}
                  key={index}/>
                ))}*/}
                </div>
              </div>
        </div> : null}
            
            <div className="DetailsContainer">
              <div className="DetailsContainerHeader">

                {isRequested ? (
                  <div
                    className="SpecimenCollectionBtn HeadBorder"
                    role="button"
                    onClick={this.onRequestedClicked}
                  >
                    <p className="pad">Requested</p>{" "}
                    <div className="borderHider" />
                  </div>
                ) : (
                  <div
                    className="SpecimenCollectionBtn"
                    role="button"
                    onClick={this.onRequestedClicked}
                  >
                    <p className="pad">Requested</p>
                  </div>
                )}


                {isRegistered ? (
                  <div
                    className="SpecimenCollectionBtn HeadBorder"
                    role="button"
                    onClick={this.onRegisteredClicked}
                  >
                    <p className="pad">Registered</p> <div className="borderHider" />
                  </div>
                ) : (
                  <div
                    className="SpecimenCollectionBtn"
                    role="button"
                    onClick={this.onRegisteredClicked}
                  >
                    <p className="pad">Registered</p>
                  </div>
                )}

                
                {isExamined ? (
                  <div
                    className="SpecimenCollectionBtn HeadBorder"
                    role="button"
                    onClick={this.onExaminedClicked}
                  >
                    <p className="pad">Examined</p>{" "}
                    <div className="borderHider" />
                  </div>
                ) : (
                  <div
                    className="SpecimenCollectionBtn"
                    role="button"
                    onClick={this.onExaminedClicked}
                  >
                    <p className="pad">Examined</p>
                  </div>
                )}

                {isReported ? (
                  <div
                    className="SpecimenCollectionBtn HeadBorder"
                    role="button"
                    onClick={this.onReportedClicked}
                  >
                    <p className="pad">Reported</p>{" "}
                    <div className="borderHider" />
                  </div>
                ) : (
                  <div
                    className="SpecimenCollectionBtn"
                    role="button"
                    onClick={this.onReportedClicked}
                  >
                    <p className="pad">Reported</p>
                  </div>
                )}

                {isApproved ? (
                  <div
                    className="SpecimenCollectionBtn HeadBorder"
                    role="button"
                    onClick={this.onApprovedClicked}
                  >
                    <p className="pad">Approved</p>{" "}
                    <div className="borderHider" />
                  </div>
                ) : (
                  <div
                    className="SpecimenCollectionBtn"
                    role="button"
                    onClick={this.onApprovedClicked}
                  >
                    <p className="pad">Approved</p>
                  </div>
                )}

              </div>
              
              <div>
                <div className='ViewDetsCont'>
              <div className='requestedHeader'>{RadOrderServiceInfo.Test}&nbsp;&nbsp;({RadOrderServiceInfo.TestCode})</div>
                {isRequested ? (
                  <div className="SpecimenFormTotContainer">
                  <SweetAlert
                    show={NoDefinedModality}
	                  custom
                    title=''
	                  confirmBtnText="OK"
                    confirmBtnCssClass="ConfirmAlertBtn"
                    customClass="DeleteAlertClass"
	                  customIcon=""
                    onConfirm={this.hideNoDefinedModality}
                  >
	                  {ModalityMessage}         
                  </SweetAlert>
                    <div className="SpecimenFormContainer">
                      <div className="SpecimenForm">
                        <div className="SpecimenRow">
                          <div className="SpecimenRowCol1">
                            Modality
                          </div>
                          <div className="SpecimenRowCol2 bld">
                            Message
                          </div>
                          <div className="SpecimenRowCol3 bld" >
                            Service Comment
                            </div>
                        </div>
                        <div className="SpecimenRow">
                          <div className="SpecimenRowCol1">
                            <Select isDisabled={isRequestedBef} value={Modali}  className='SpecimenSelect' options={PreloadedModalities} onChange={this.onModalityChanged}/>
                          </div>
                          <div className="SpecimenRowCol2">
                            <input disabled={isRequestedBef} type='text' className='registeredTextInputs' value={RadOrderServiceInfo.Message} onChange={this.onRequestedCommentChanged}/>
                          </div>
                          <div className="SpecimenRowCol3" >
                            <input type='text' className='registeredTextInputs' value={RadOrderServiceInfo.ServiceComment} disabled/></div>
                        </div>

                        <div className="SpecimenRow">
                          <div className="SpecimenRowCol1 bld">
                            Order Reason</div>
                          <div className="SpecimenRowCol4 bld">
                            Technician Comments
                          </div>
                        </div>

                        <div className="SpecimenRow">
                          <div className="SpecimenRowCol1">
                            <input type='text' className='registeredTextInputs' value={RadOrderServiceInfo.OrderReason} disabled/></div>
                          <div className="SpecimenRowCol4">
                            <input disabled={isRequestedBef} type='text' className='registeredTextInputs' value={RadOrderServiceInfo.TechnicianComment} onChange={this.onTechCommentChanged}/>
                          </div>
                        </div>

                        <div className="SpecimenRow">
                          <div className="SpecimenRowCol1">
                            {(!isRequestedBef && !isRegisteredDis) ? <input type='button' className='registeredRegisterButton' value='Register' onClick={this.onRegisterOrderClicked}/> : null}</div>
                          <div className="SpecimenRowCol4"/>
                        </div>

                    </div>
                        </div>
                  </div>
                ) : null}
                {isRegistered ? <div className='RegisteredPage'>
                  <SweetAlert
                    show={FilmPICMissing}
	                  custom
                    title=''
	                  confirmBtnText="OK"
                    confirmBtnCssClass="ConfirmAlertBtn"
                    customClass="DeleteAlertClass"
	                  customIcon=""
                    onConfirm={this.hideFilmPICMissing}
                  >
	                {FilmPICMissingMsg}            
                </SweetAlert>
                  <div className='RegisteredCont'>
                    <div className='RegisteredContHeader'>Film</div>
                    <div className='RegisteredContRow'>
                    <div className='RegisteredContRowCol1'>Type <span className='Mand'>*</span></div>
                    <div className='RegisteredContRowCol2'>Number Of Film(s) <span className='Mand'>*</span></div>
                    <div className='RegisteredContRowCol3'/>
                    </div>
                    
                    <div className='RegisteredContRow zind'>
                    <div className='RegisteredContRowCol1'><Select isDisabled={isRegisteredBef} styles={customStyles1} className='SpecimenSelect' value={SelectedFilmType1} options={PreloadedFilmTypes} onChange={this.onFilmTypeChanged}/></div>
                    <div className='RegisteredContRowCol2'><input disabled={isRegisteredBef} type='text' className='registeredTextInputs' onChange={this.onNumberOfFilmsChanged} value={FilmNumber}/></div>
                    <div className='RegisteredContRowCol3'/>
                    </div>
                    
                    
                    <div className='RegisteredContRow'>
                    <div className='RegisteredContRowCol4'>Description</div>
                    <div className='RegisteredContRowCol3'/>
                    </div>
                    
                    
                    <div className='RegisteredContRow'>
                    <div className='RegisteredContRowCol4'><input disabled={isRegisteredBef} type='text' className='registeredTextInputs' placeholder='Add Description...' onChange={this.onFilmDescriptionChanged} value={FilmDescription}/></div>
                    <div className='RegisteredContRowCol3'>{(!isRegisteredBef && !isExaminedDis) ? <input type='button' className='AddFilmBtn' value='Add' onClick={this.onAddFilmClicked}/> : null}</div>
                    </div>

                    <div className='RegisteredTable'>
                    <div className='RegisteredTableHeader'>
                    <div className='RegisteredTable1Col1'>Name</div>
                    <div className='RegisteredTable1Col2'>Number</div>
                    <div className='RegisteredTable1Col3'>Comment</div>
                    <div className='RegisteredTable1Col4'>Barcode</div>
                    <div className='RegisteredTable1Col5'/>
                    </div>
                    {RadFilmList.map((Film, index) => (
                      <FilmListGrid
                        key={index}
                        ind={index}
                        Film={Film}
                        onDeleteFilmClicked={this.onDeleteFilmClicked}
                        isRegisteredBef={isRegisteredBef}
                      />
              ))}
                  </div>

                  </div>


                  <div className='RegisteredCont'>
                    <div className='RegisteredContHeader'>Person In Charge</div>
                    <div className='RegisteredContRow'>
                    <div className='RegisteredContRowCol1'>Name <span className='Mand'>*</span></div>
                    <div className='RegisteredContRowCol2'>Role <span className='Mand'>*</span></div>
                    <div className='RegisteredContRowCol3'/>
                    </div>
                    
                    <div className='RegisteredContRow zind'>
                    <div className='RegisteredContRowCol1'><input disabled={isRegisteredBef} type='text' className='registeredTextInputs' onChange={this.onPersonInChargeNameChanged} value={PersonInChargeName}/></div>
                    <div className='RegisteredContRowCol2'><Select styles={customStyles1} isDisabled={isRegisteredBef}  className='SpecimenSelect' options={PreloadedRoles} value={SelectedRole1} onChange={this.onRoleChanged}/></div>
                    <div className='RegisteredContRowCol3'>{(!isRegisteredBef && !isExaminedDis) ? <input type='button' className='AddFilmBtn' value='Add' onClick={this.onAddPersonInChargeClicked}/> : null}</div>
                    </div>
                    
                    <div className='RegisteredTable'>
                    <div className='RegisteredTableHeader'>
                    <div className='RegisteredTable2Col1'>Name</div>
                    <div className='RegisteredTable2Col2'>Role</div>
                    <div className='RegisteredTable1Col5'></div>
                    </div>
                    {RadPersonInChargeList.map((PersonIncharge, index) => (
                      <PersonsInchargeListGrid
                        key={index}
                        ind={index}
                        PersonIncharge={PersonIncharge}
                        onDeletePersonInChargeClicked={this.onDeletePersonInChargeClicked}
                        isRegisteredBef={isRegisteredBef}
                      />
              ))}
                  </div>

                  </div>
                  <div className='RegisteredCont'>
                  <div className='RegisteredContHeader'>Comments</div>
                  
                    
                  <div className='RegisteredContRow'>
                    <div className='RegisteredContRowCol5'>Technician Comments</div>
                    </div>
                  <div className='RegisteredContRow'>
                    <div className='RegisteredContRowCol5'><input disabled={isRegisteredBef} type='text' className='registeredTextInputs' value={RadOrderServiceInfo.TechnicianComment} onChange={this.onRegTechCommentChanged}/></div>
                    </div>

                    

                        <div className="SpecimenRow">
                          <div className="SpecimenRowCol1">
                            {(!isRegisteredBef && !isExaminedDis) ? <input type='button' className='registeredExamineButton' value='Examine' onClick={this.openMoveConfirmationAlert}/> : null}</div>
                          <div className="SpecimenRowCol4"/>
                        </div>

                  </div>
                </div>:null}

                {isExamined ? <div className='RegisteredPage'>
                <div className='RegisteredCont'>

                <SweetAlert
                    show={showReportReporterMsg}
	                  custom
                    title=''
	                  confirmBtnText="OK"
                    confirmBtnCssClass="ConfirmAlertBtn"
                    customClass="DeleteAlertClass"
	                  customIcon=""
                    onConfirm={this.hideReportReporterMsg}
                  >
	                  {ReportReporterMsg}           
                  </SweetAlert>
                

                  <SweetAlert
                    show={notUpdatedMsg}
	                  custom
                    title=''
	                  confirmBtnText="OK"
                    confirmBtnCssClass="ConfirmAlertBtn"
                    customClass="DeleteAlertClass"
	                  customIcon=""
                    onConfirm={this.hidenotUpdatedMsg}
                  >
	                  You haven't updated the report            
                  </SweetAlert>
                    <div className='RegisteredContHeader'>Report</div>
                    <div className='RegisteredContRow'>
                    <div className='ExaminedContRowCol1'>Reporter <span className='Mand'>*</span></div>
                    <div className='ExaminedContRowCol2'>Templates</div>
                    </div>
                    
                    <div className='RegisteredContRow zind1'>
                    <div className='ExaminedContRowCol1'><Select isDisabled={isExaminedBef} className='SpecimenSelect' options={PreloadedReporters} value={SelectedRep} onChange={this.onSelectedReporterChanged}/></div>
                    <div className='ExaminedContRowCol2'><Select isDisabled={isExaminedBef} className='SpecimenSelect' options={PreloadedTemplates} value={SelectedTemp} onChange={this.onSelectedTemplateChanged}/></div>
                    </div>

                    <RichTextEditor
                      value={this.state.tempvalue}
                      onChange={this.onTempEditorChange}
                      className="createtemprtlstyle"
                      readOnly={isExaminedBef}
                    />

                    <div className='RegisteredContRow'>
                    <div className='ExaminedContRowCol3'>{(!isExaminedBef && !isReportedDis) ? <input type='button' value='Cancel' className='RTEBtns CancelBtn' onClick={this.onResetExaminedTempClicked}/> : null}</div>
                    <div className='ExaminedContRowCol4'>{(!isExaminedBef && !isReportedDis) ? <input type='button' value='Save' className='RTEBtns UpdateBtn' onClick={this.onUpdateExaminedTemplateClicked}/> : null}</div>
                    <div className='ExaminedContRowCol5'/>
                    </div>

                    <div className='RegisteredContRow AddSpace'>
                    </div>

                    <Attachments 
                      RadOrderServiceInfo={RadOrderServiceInfo}
                      ViewDetails={ViewDetails}
                      isRequested = {isRegistered}
                      isRegistered = {isRegistered}
                      isExaminedP = {true}
                      isReportedP = {false}
                      isApprovedP = {false}
                      isExaminedBef = {isExaminedBef}
                      isReportedBef = {isReportedBef}
                      isApprovedDis = {isReportedDis}
                      AttachmentsLoaded = {this.AttachmentsLoaded}/>

                    <div className='RegisteredContRow'>
                    <div className='RegisteredContRowCol5'>Technician Comments</div>
                    </div>
                  <div className='RegisteredContRow'>
                    <div className='RegisteredContRowCol5'><input disabled={isExaminedBef} type='text' className='registeredTextInputs' value={RadOrderServiceInfo.TechnicianComment} onChange={this.onExaTechCommentChanged}/></div>
                    </div>


                    <div className="SpecimenRow">
                          <div className="SpecimenRowCol1">
                            {(!isExaminedBef && !isReportedDis) ? <input type='button' className='registeredExamineButton' value='Report' onClick={this.onReportClicked}/> : null}</div>
                          <div className="SpecimenRowCol4"/>
                        </div>

                  </div>
                  </div> : null}

                  {isReported ? 
                  <div className='RegisteredPage'>
                  <div className='RegisteredCont'>
                  <SweetAlert
                    show={showReportReporterMsg}
	                  custom
                    title=''
	                  confirmBtnText="OK"
                    confirmBtnCssClass="ConfirmAlertBtn"
                    customClass="DeleteAlertClass"
	                  customIcon=""
                    onConfirm={this.hideReportReporterMsg}
                  >
	                  {ReportReporterMsg}           
                  </SweetAlert>

        <SweetAlert
              show={notUpdatedMsg}
	            custom
              title=''
	            confirmBtnText="OK"
              confirmBtnCssClass="ConfirmAlertBtn"
              customClass="DeleteAlertClass"
	            customIcon=""
              onConfirm={this.hidenotUpdatedMsg}
            >
	        You haven't updated the report            
          </SweetAlert>
                      <div className='RegisteredContHeader'>Report</div>
                      <div className='RegisteredContRow'>
                      <div className='ExaminedContRowCol1'>Reporter <span className='Mand'>*</span></div>
                      <div className='ExaminedContRowCol2'>Templates</div>
                      </div>
                      
                      <div className='RegisteredContRow zind1'>
                      <div className='ExaminedContRowCol1'><Select isDisabled={isReportedBef} className='SpecimenSelect' options={PreloadedReporters} value={SelectedRep} onChange={this.onSelectedReporterChanged}/></div>
                      <div className='ExaminedContRowCol2'><Select isDisabled={isReportedBef} className='SpecimenSelect' options={PreloadedTemplates} value={SelectedTemp} onChange={this.onSelectedTemplateChanged}/></div>
                      </div>
  
                      <RichTextEditor
                        value={this.state.tempvalue}
                        onChange={this.onTempEditorChange}
                        className="createtemprtlstyle"
                        readOnly={isReportedBef}
                      />
  
                      <div className='RegisteredContRow'>
                      <div className='ExaminedContRowCol3'>{(!isReportedBef && !isApprovedDis) ? <input type='button' value='Cancel' className='RTEBtns CancelBtn' onClick={this.onResetExaminedTempClicked}/> : null}</div>
                      <div className='ExaminedContRowCol4'>{(!isReportedBef && !isApprovedDis) ? <input type='button' value='Update' className='RTEBtns UpdateBtn' onClick={this.onUpdateExaminedTemplateClicked}/> : null}</div>
                      <div className='ExaminedContRowCol5'/>
                      </div>

                      <div className='RegisteredContRow AddSpace'>
                    </div>

                    <Attachments 
                      RadOrderServiceInfo={RadOrderServiceInfo}
                      ViewDetails={ViewDetails}
                      isRequested = {isRegistered}
                      isRegistered = {isRegistered}
                      isExaminedP = {false}
                      isReportedP = {true}
                      isApprovedP = {false}
                      isExaminedBef = {isExaminedBef}
                      isReportedBef = {isReportedBef}
                      isApprovedDis = {isApprovedDis}
                      AttachmentsLoaded = {this.AttachmentsLoaded}/>
  
                      <div className='RegisteredContRow'>
                      <div className='RegisteredContRowCol5'>Technician Comments</div>
                      </div>
                    <div className='RegisteredContRow'>
                      <div className='RegisteredContRowCol5'><input disabled={isReportedBef} type='text' className='registeredTextInputs' value={RadOrderServiceInfo.TechnicianComment} onChange={this.onExaTechCommentChanged}/></div>
                      </div>
  
                      <div className="SpecimenRow">
                            <div className="SpecimenRowCol1">
                              {(!isReportedBef && !isApprovedDis) ? <input type='button' className='registeredExamineButton' value='Approve' onClick={this.openMoveConfirmationAlert}/> : null}</div>
                            <div className="SpecimenRowCol4"/>
                          </div>
  
                    </div>
                    </div> :null}


                    {isApproved ? 
                    
                  <div className='RegisteredPage'>
                  <div className='RegisteredCont'>
                  

        <SweetAlert
                show={notUpdatedMsg}
	            custom
                title=''
	            confirmBtnText="OK"
                confirmBtnCssClass="ConfirmAlertBtn"
                customClass="DeleteAlertClass"
	            customIcon=""
                onConfirm={this.hidenotUpdatedMsg}
            >
	        You haven't updated the report            
          </SweetAlert>
                      <div className='RegisteredContHeader'>Report</div>
                      <div className='RegisteredContRow'>
                      <div className='ExaminedContRowCol1'>Reporter <span className='Mand'>*</span></div>
                      <div className='ExaminedContRowCol2'>Templates</div>
                      </div>
                      
                      <div className='RegisteredContRow zind1'>
                      <div className='ExaminedContRowCol1'><Select isDisabled className='SpecimenSelect' options={PreloadedReporters} value={SelectedRep}/></div>
                      <div className='ExaminedContRowCol2'><Select isDisabled className='SpecimenSelect' options={PreloadedTemplates} value={SelectedTemp}/></div>
                      </div>
  
                      <RichTextEditor
                        value={this.state.tempvalue}
                        className="createtemprtlstyle"
                        readOnly
                      />

                      <div className='RegisteredContRow AddSpace'>
                    </div>

                    <Attachments 
                      RadOrderServiceInfo={RadOrderServiceInfo}
                      ViewDetails={ViewDetails}
                      isRequested = {isRegistered}
                      isRegistered = {isRegistered}
                      isExaminedP = {false}
                      isReportedP = {false}
                      isApprovedP = {true}
                      isExaminedBef = {isExaminedBef}
                      isReportedBef = {isReportedBef}
                      AttachmentsLoaded = {this.AttachmentsLoaded}/>
  
                      <div className='RegisteredContRow'>
                      <div className='RegisteredContRowCol5'>Technician Comments</div>
                      </div>
                    <div className='RegisteredContRow'>
                      <div className='RegisteredContRowCol5'><input disabled type='text' className='registeredTextInputs' value={RadOrderServiceInfo.TechnicianComment}/></div>
                      </div>
  
                    </div>
                    </div> :null}

                </div>
              </div>
            </div>
          </div>
        </Modal>
        {this.state.showSideBar ? (
          <SideBar 
            showHideSideBar={this.showHideSideBar}
            sideBarLoaded={this.sideBarLoaded}
           />
        ) : null}
        <div className={WLHomeClass}>
          <SearchComponent
            showHideSideBar={this.showHideSideBar}
            sidebarShown={showSideBar}
            ResetSelectedPageSize={this.ResetSelectedPageSize}
            searchComponentLoaded={this.searchComponentLoaded}
          />
          <div className="WorkListTableCont">
            <div className="WLtable-head">
              <div className="WLtable-headCount">
                Total Orders : {RadOrderSearchCount}
              </div>
            </div>
            <div className="WorkListGrid">
              {Orders.map((Order, index) => (
                <WorkListGrid
                  key={index}
                  ind={index}
                  RadOrder={Order}
                  isCanceled={isCanceled}
                  viewDetails={this.viewDetails}
                />
              ))}
            </div>
          </div>
          <div className="PaginationCont">
            <Pagination
              hideDisabled={true}
              activePage={this.props.Req.PageNumber}
              itemsCountPerPage={this.props.Req.PageSize}
              totalItemsCount={RadOrderSearchCount}
              onChange={this.onNewPageChanged}
            />
            <DropDownList
              SelectedOption={SelectedPageSize.Label}
              Options1={PageSizeOptions}
              ComponentStyle="PageSizeCompStyle"
              HeaderStyle="PageSizeHeaderStyle"
              DropDnStyle="PageSizeDropDnStyle"
              ElementsStyle="PageSizeElStyle"
              onChange={this.ChangePageSize}
            />
          </div>
        </div>
      </div>
    );
  }
}

const ViewDetailsHearders = props => {
  let DiagnosisArr = [];
  const PatientName = props.PatientInfo.PatientName || "";
  const Age = props.PatientInfo.PatientAge || "";
  const Weight = props.PatientInfo.PatientWeight || "";
  const Temperature = props.PatientInfo.PatientTemperature || "";
  /*const Diagnosis =
      '<span style="margin-top: 0px; padding-top: 0px; position: relative; white-space: normal;">' +
        props.Diagnosis +
        "</span>" || "";*/
  DiagnosisArr = props.PatientInfo.Diagnosis;
  return (
    <div className="ViewDetailsHearders">
      <div className="ViewDetailsHeardersItems">
        <FontAwesomeIcon icon="user" size="sm" color="#747272" />{" "}
        <p className="ib fontimportant">{PatientName}</p>
      </div>
      <i className="separators"> | </i>
      <div className="ViewDetailsHeardersItems">
        <p className="ib ViewDetailsHearderslabels">Age: </p>{" "}
        <p className="ib fontimportant">{Age}</p>
      </div>
      <i className="separators"> | </i>
      <div className="ViewDetailsHeardersItems">
        <p className="ib ViewDetailsHearderslabels">Weight: </p>{" "}
        <p className="ib fontimportant">{Weight}</p>
      </div>
      <i className="separators"> | </i>
      <div className="ViewDetailsHeardersItems">
        <p className="ib ViewDetailsHearderslabels">Temperature: </p>{" "}
        <p className="ib fontimportant">{Temperature}</p>
      </div>
      <i className="separators"> | </i>
      <div className="ViewDetailsHeardersItems Di DiagCont">
        <p className="ViewDetailsHearderslabels">Diagnosis: </p>{" "}
        {DiagnosisArr.map((Diag, index) => (
          <MyCustomTooltip 
          Diag={Diag}
          key={index}
          ind={index}/>
        ))}
      </div>
    </div>
  );
};

class MyCustomTooltip extends Component{
  constructor(props){
    super();
    this.state={
      ShowToolTip: false
    };
    this.showTip = this.showTip.bind(this);
    this.hideTip = this.hideTip.bind(this);
  }

  hideTip(){
    this.setState({
      ShowToolTip: false
    })
  }

  showTip(){
    this.setState({
      ShowToolTip: true
    })
  }

  render(){
    const ShowToolTip = this.state.ShowToolTip;
    const Diag = this.props.Diag;
    return(
      <div className="diag1">
          <div
              className="diagCode"
              onMouseOver={this.showTip}
              onMouseLeave={this.hideTip}
            >
              {Diag.Code}
            </div>
            <div>
            {ShowToolTip ? <div className='tooltipcont'>{Diag.Description}</div> : null}</div>
          {/*<Tooltip content={Diag.Description}
          className='react-tooltip-lite1'
            tipContentClassName='DiagTooltip'
            background='black'
            color='white'
            styles={{top:250}}>
          <p
              className="diagCode"
            >
              {Diag.Code}
            </p>
        </Tooltip>*/}
          </div>
    )
  }
}

class PersonsInchargeListGrid extends Component{
  constructor(props){
    super();
    this.state={
      showDeleteAlert2: false
    };
    this.onDeletePersonInChargeClicked = this.onDeletePersonInChargeClicked.bind(this);
    this.hideAlert2 = this.hideAlert2.bind(this);
    this.DeleteConfirmedClicked = this.DeleteConfirmedClicked.bind(this);
  }

  DeleteConfirmedClicked(){
    this.setState({
      showDeleteAlert2: false
    },()=>{
      const PersonID = this.props.PersonIncharge.PersonID;
      this.props.onDeletePersonInChargeClicked(PersonID);
    })
  }

  hideAlert2(){
    this.setState({
      showDeleteAlert2: false
    })
  }

  onDeletePersonInChargeClicked(){
    this.setState({
      showDeleteAlert2: true
    })
  }

  render(){
    const PersonIncharge = this.props.PersonIncharge;
    const {showDeleteAlert2} = this.state
    const isRegisteredBef = this.props.isRegisteredBef
    return(
      <div className='RegisteredContRow borBtm'>
      
      <SweetAlert
                show={showDeleteAlert2}
                custom
                title=''
                showCancel
                cancelBtnText="No"
                confirmBtnText="Yes"
                confirmBtnCssClass="ConfirmAlertBtn"
                customClass="DeleteAlertClass"
                cancelBtnCssClass="CancelAlertBtn"
	            customIcon=""
                onCancel={this.hideAlert2}
                onConfirm={this.DeleteConfirmedClicked}
            >
	        Are You Sure You Want To Delete?
            </SweetAlert>
            <div className='RegisteredTable2Col1'>{PersonIncharge.Name}</div>
            <div className='RegisteredTable2Col2'>{PersonIncharge.RoleName}</div>
            <div className='RegisteredTable1Col5'>{!isRegisteredBef ? <span className='RISVDDeleteIcon' role='button' onClick={this.onDeletePersonInChargeClicked}/> : null}</div>
      </div>
    )
  }
}

class FilmListGrid extends Component{
  constructor(props){
    super();
    this.state={
      showDeleteAlert1: false
    };
    this.onDeleteFilmClicked = this.onDeleteFilmClicked.bind(this);
    this.hideAlert1 = this.hideAlert1.bind(this);
    this.DeleteAppConfirmedClicked = this.DeleteAppConfirmedClicked.bind(this);
  }

  DeleteAppConfirmedClicked(){
    this.setState({
      showDeleteAlert1: false
    },()=>{
      const ServiceFilmID = this.props.Film.ServiceFilmID;
      this.props.onDeleteFilmClicked(ServiceFilmID);
    })
  }

  hideAlert1(){
    this.setState({
      showDeleteAlert1: false,
    })
  }

  onDeleteFilmClicked(){
    this.setState({
      showDeleteAlert1: true
    })
  }

  render(){
    const Film = this.props.Film;
    const {showDeleteAlert1} = this.state
    const isRegisteredBef = this.props.isRegisteredBef;
    return(
      <div className='RegisteredContRow borBtm'>
      
      <SweetAlert
                show={showDeleteAlert1}
                custom
                title=''
                showCancel
                cancelBtnText="No"
                confirmBtnText="Yes"
                confirmBtnCssClass="ConfirmAlertBtn"
                customClass="DeleteAlertClass"
                cancelBtnCssClass="CancelAlertBtn"
	              customIcon=""
                onCancel={this.hideAlert1}
                onConfirm={this.DeleteAppConfirmedClicked}
            >
	        Are You Sure You Want To Delete?
            </SweetAlert>
          <div className='RegisteredTable1Col1'>{Film.TypeName}</div>
          <div className='RegisteredTable1Col2'>{Film.Number}</div>
          <div className='RegisteredTable1Col3'>{Film.Comments}</div>
          <div className='RegisteredTable1Col4'>{Film.BarCode}</div>
          <div className='RegisteredTable1Col5'>{!isRegisteredBef ? <span className='RISVDDeleteIcon' role='button' onClick={this.onDeleteFilmClicked}/>: null}</div>
      </div>
    )
  }
}

const customStyles1 = {
  menu: (base) => ({
    ...base,
    position: "absolute",
    top: 40,
    zIndex: 999999999999999999
  })
};

const customStyles = {
  control: (base) => ({
    // none of react-selects styles are passed to <View />
    ...base,
    height: 20,
    minHeight: 20,
    marginTop: 2
  }),
  menu: (base) => ({
    ...base,
    position: "absolute",
    top: 20,
    zIndex: 10000
  }),
  valueContainer: base => ({
    ...base,
    marginTop: -6
  }),
  indicatorsContainer: base =>({
    ...base,
    display: "none"
  })
};

const mapStateToProps = state => ({
  UserAuth: state.UserAuthenticationInfo.AuthenticationInfo.Applications[state.UserAuthenticationInfo.AuthenticationInfo.SelectedApplication].Authorities,
  Req: state.ChangeRequestParameters,
  BranchID: state.ChangeUserAssignedBranch.BranchID,
  Orders: state.ChangeOrders.Orders,
  Statuses: state.ModifyRadStatuses.Statuses,
  UserToken: state.UserAuthenticationInfo.AuthenticationInfo.AuthenticationToken,
  UserInfo: state.UserAuthenticationInfo.AuthenticationInfo,
  LoadedParameters: state.UpdateLoadedParameters,
  RefreshPages: state.RefreshPages,
  UserAuthenticationInfo: state.UserAuthenticationInfo,
  ChangeFilters: state.RestoreFilters.ChangeFilters,
  UserAuthInfo: state.UserAuthenticationInfo.AuthenticationInfo,
  BrPermissions: state.UpdatePermissions.Permissions
  //DetailsTests: state.ChangeDetailsTests.DetailsTests,
  //DetailsTestsWResults: state.ChangeDetailsTestsWResults.DetailsTestsWResults,
  //WorkListRefs: state.RefreshPages.WorkListRefs
});

const mapDispatchToProps = dispatch => ({
    onChangeReqParam: (Parameter, Type) =>dispatch(changeRequestParameter(Parameter, Type)),
    changeOrders: (Parameter, Type) =>dispatch(changeOrdersSearch(Parameter, Type)),
    setLoadedParameters: (Parameter, Type) => dispatch(setLoadedParameters(Parameter, Type)),
    changeStatus: (Parameter, Type) => dispatch(changeStatus(Parameter, Type)),
    refreshPage: (Parameter, Type) =>dispatch(refreshPage(Parameter, Type)),
    saveUserAuthenticationInfo: (Parameter, Type) => dispatch(saveUserAuthenticationInfo(Parameter, Type)),
    showHideLoader: (isShow, Type) => dispatch(showHideLoader(isShow, Type)),
    onBranchChanged: (Branches, BranchID, BranchName, Type) => dispatch(changeSelectedUserBranch(Branches, BranchID, BranchName, Type))
    //changeDetailsTests: (Parameter, Type) =>
    //dispatch(changeDetailsTests(Parameter, Type)),
    //changeDetailsTestsWResults: (Parameter, Type) =>
    //dispatch(changeDetailsTestsWResults(Parameter, Type))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(WorkList));