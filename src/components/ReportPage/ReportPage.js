import React, { Component } from "react";
import { connect } from "react-redux";
import "./ReportPageStyle.css";
import ReportsParameterList from "./ReportsParameterList.js";
import Iframe from "react-iframe";
import axios from 'axios';
import * as urls from "../../constants/URL";
import moment from 'moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { refreshPage, showHideLoader } from '../../actions';
import { withRouter } from "react-router-dom";

class ReportPage extends Component{
    constructor(props){
        super();
        this.state={
            PageRefreshes: 0,
            ShowSubmitBtn:false,
            ParametersNamesArray:[],
            ParametersArray:[],
            ParametersTypesArray:[],
            IFrameURL:'',
            ReportParameterList:[],
            ReportList:[],
            Reports:[],
            Categ1H:30,
            Categ1Open:false,
            Categ2H:30,
            Categ2Open:false,
            Categ3H:30,
            Categ3Open:false,
            Categ4H:30,
            Categ4Open:false,
            ChosenReport:0,
            ChosenReportInd: null,
            ChosenReportFileName:'',
            innerwidth: window.innerWidth,
            AllReps: [],
            CatInd: null,
            DateFrom: new Date(),
            DateTo: new Date(),
            CallID:'',
            isReportLoaded: false,
            ReportInstruction: ''
          };
        this.getRepList = this.getRepList.bind(this);
        this.OpenCateg = this.OpenCateg.bind(this);
        this.ReportClicked = this.ReportClicked.bind(this);
        this.getRepPatameters = this.getRepPatameters.bind(this);
        this.showReport = this.showReport.bind(this);
        this.ParameterChanged = this.ParameterChanged.bind(this);
        this.getRepCallID = this.getRepCallID.bind(this);
        this.gotoDashboard = this.gotoDashboard.bind(this);
      }
    
      gotoDashboard(){
        this.props.history.push('/dashboard')
      }

    getRepCallID(){
      const f = this.state.ParametersArray;
      //const t = this.state.ParametersTypesArray;
      const n = this.state.ParametersNamesArray;
      let PL = [...this.state.ReportParameterList];
      const l = this.state.ReportParameterList.length;
      const Rep = this.state.ReportList[this.state.CatInd].Reports[this.state.ChosenReportInd];
      const Req={Parameters:[
        {Key: "ReportName", Value: Rep.FileName}
      ]};
      var unverifParams = 0;
      const paramIndices = [];
      for (var i=0; i<l; i++){
        if(PL[i].IsMandatory && (f[i] === '' || f[i] === null || f[i] === undefined)){
          unverifParams = unverifParams + 1;
          paramIndices.push(i);
        }else if(f[i] !== null){
        if(PL[i].ParameterDataTypeName === "Numeric" || PL[i].ParameterDataTypeName === "Text"){
          if(PL[i].Length !== null && (f[i].length !== PL[i].Length)){
            unverifParams = unverifParams + 1;
            paramIndices.push(i);
          }else{
            PL[i].ObjClass = 'ReportsFormTxtBox'}
          }
        }
        }
      if(unverifParams === 0){
      if(Rep.RequireBranchID){
        const NewPar={Key: "BranchID", Value: this.props.BranchID};
        Req.Parameters.push(NewPar)
      }
      if(Rep.RequireUserName){
        //this.props.UserAuthenticationInfo.ArabicName;
        const UName = this.props.UserAuthenticationInfo.EnglishName;
        const NewPar={Key: "UserName", Value: UName};
        Req.Parameters.push(NewPar)
      }
      for(var i=0; i<l; i++){
        const NewPar={Key: n[i], Value: f[i]};
        Req.Parameters.push(NewPar)
      }
      var RepCallIDUrl =  `${urls.URL}ReportingWebService.svc/AddReportParameters?a=${moment()}`;
      this.props.showHideLoader(true, 'SHOW_HIDE');
      axios({
        method: "post",
        url: RepCallIDUrl,
        data: JSON.stringify(Req),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth_Token: this.props.UserToken
        },
        withCredentials: true
      }).then(response => {
        if (response.data) {
          const responseJson = response.data;
          if (responseJson.HasError) {
            //this.showToast(responseJson.ServiceError.Message, 3);
          } else {
            const CallID = responseJson.ReportQSParamID.ReportParameterID;
            const RepURL = `${urls.REPORTURL}?ReportCallID=${CallID}` 
              this.setState({IFrameURL: RepURL, 
                CallID, isReportLoaded: true, 
                ReportInstruction: '',
                ReportParameterList: PL},()=>{
                this.props.showHideLoader(false, 'SHOW_HIDE');
              });
          }
        }
      })
      .catch(error => {
        //alert(error);
      });
    }else{
      let ReportParameterList = [...this.state.ReportParameterList];
      for (var ii=0; ii<paramIndices.length; ii++){
        ReportParameterList[paramIndices[ii]].ObjClass = 'ReportsFormTxtBoxOutlined'
      }
      this.setState({
        ReportParameterList
      })
    }
    }

    ParameterChanged(ind, vals){
      let ParametersArray = Object.assign({}, this.state.ParametersArray);
      let ReportParameterList = Object.assign({}, this.state.ReportParameterList);
      let DateFrom = this.state.DateFrom;
      let DateTo = this.state.DateTo;
      ParametersArray[ind] = vals;
      if(ReportParameterList[ind].ParameterDisplayLabel === 'From Date'){
        DateFrom = vals;
      }else if(ReportParameterList[ind].ParameterDisplayLabel === 'To Date'){
        DateTo = vals;
      }
      this.setState({ParametersArray, DateFrom, DateTo});
    }    

  showReport(){
    //var IFrameURL = '';
    //const f = this.state.ParametersArray;
    //const t = this.state.ParametersTypesArray;
    //const n = this.state.ParametersNamesArray;
    //const l = this.state.ReportParameterList.length;
    //const fileName = this.state.ChosenReportFileName;
    const Rep = this.state.ReportList[this.state.CatInd].Reports[this.state.ChosenReportInd];
    //var url = urls.REPORTURL;
    //let ReportParameterList = Object.assign({}, this.state.ReportParameterList);


    if(Rep.AllowCallID){
      this.getRepCallID();
    }

    /*url = url + '?FileName=' + fileName;
    for(var i = 0; i<l; i++){
      if(f[i] === null){
        url = url + '&' + n[i] +  '=';
      }else{
        url = url + '&' + n[i] +  '=' + String(f[i]);}
    }
    //alert(url)
    console.log(url)
    IFrameURL = url;

    this.setState({IFrameURL});*/
  }

    getRepPatameters(){
      const ChosenReport = this.state.ChosenReport;
      const BranchID = this.props.BranchID;
      const RepID = this.state.ChosenReport;
      var RepParamsUrl =  `${urls.URL}ReportingWebService.svc/GetReportParameters/${ChosenReport}/${BranchID}?a=${moment()}`;
      this.props.showHideLoader(true, 'SHOW_HIDE');
      axios({
        method: "get",
        url: RepParamsUrl,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          auth_Token: this.props.UserToken
        },
        withCredentials: true
      }).then(response => {
        if (response.data) {
          const responseJson = response.data;
          if (responseJson.HasError) {
            //this.showToast(responseJson.ServiceError.Message, 3);
          } else {
              const RepParameters = responseJson.ReportParameterList;
              var RepParameters1 = [...RepParameters];
              for(var j=0; j<RepParameters.length; j++){
                RepParameters[j]['ObjClass'] = 'ReportsFormTxtBox';
              }
              var ParamsArray = [...Array(RepParameters.length)].map((x, i) => null);
              var ParamsTypesArray = [...Array(RepParameters.length)].map((x, i) => null);
              var ParamsNamesArray = [...Array(RepParameters.length)].map((x, i) => null);
              for(var i=0; i<RepParameters.length; i++){
                
                ParamsNamesArray[i] = RepParameters[i].ParameterName.replace(/\s+/g, '');
                if(RepParameters[i].ParameterControlType === 'DropDown'){
                  if(RepParameters[i].ReportParameterValues[0].ParameterValueID !== -1){
                    ParamsArray[i] = RepParameters[i].ReportParameterValues[0].ParameterValueID;
                  }
                }
                if(RepParameters[i].ParameterDataTypeName === 'Numeric'){
                  ParamsTypesArray[i] = 'N';
                }else if(RepParameters[i].ParameterDataTypeName === 'Date'){
                  ParamsArray[i] = moment().format('YYYY-MM-DD');
                  ParamsTypesArray[i] = 'D';
                }else if(RepParameters[i].ParameterDataTypeName === 'Boolean'){
                  ParamsTypesArray[i] = 'B';
                }else if(RepParameters[i].ParameterDataTypeName === 'Text'){
                  ParamsTypesArray[i] = 'T';
                }else{
                  ParamsTypesArray[i] = '';
                }
              }
              this.setState({
                ReportParameterList: RepParameters, 
                ParametersArray: ParamsArray, 
                ShowSubmitBtn:true, 
                ParametersTypesArray: ParamsTypesArray, 
                ParametersNamesArray: ParamsNamesArray},()=>{
                  this.props.showHideLoader(false, 'SHOW_HIDE');
                });
          }
        }
      })
      .catch(error => {
        //alert(error);
      });
    }


    ReportClicked(ID, Ind, Name, parind){
      const inst = this.state.ReportList[parind].Reports[Ind].Instructions;
      this.setState({ChosenReport: ID,
        ChosenReportInd: Ind,
        ChosenReportFileName: Name,
        CatInd: parind,
        isReportLoaded:false,
        ReportInstruction: inst,
        ReportParameterList: [],
        ShowSubmitBtn: false
      }, ()=>{
        this.getRepPatameters();
      });
    }

    OpenCateg(event){
      const ind = parseInt(event.target.id, 10);
      let AllReps = [...this.state.AllReps];
      for(var i=0; i<AllReps.length; i++){
        //AllReps[i].CatCls = 'Cat1ReportsHead';
      }
      if(AllReps[ind].CatOpen){
        AllReps[ind].CatOpen = false;
        AllReps[ind].CatHeight = 40;
        AllReps[ind].CatCls = 'Cat1ReportsHead';
      }else{
        AllReps[ind].CatOpen = true;
        AllReps[ind].CatHeight = 'auto';
        AllReps[ind].CatCls = 'Cat1ReportsHeadH';
      }
      this.setState({AllReps});
    }

    getRepList(){
        const a = moment();
        //const uid = localStorage.getItem('userID');
        //const bid = localStorage.getItem('BranchID');
        var RepParamsUrl =  `${urls.URL}ReportingWebService.svc/GetReports?${a}`;
        this.props.showHideLoader(true, 'SHOW_HIDE');
        axios({
          method: "get",
          url: RepParamsUrl,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            auth_Token: this.props.UserToken
          },
          withCredentials: true
        }).then(response => {
            if (response.data) {
              const responseJson = response.data;
              if (responseJson.HasError) {
                //this.showToast(responseJson.ServiceError.Message, 3);
              } else {
                  var AllReps = [];
                  const RepList = responseJson.ReportCategoryList;
                  for(var i=0; i<RepList.length; i++){
                    var RepCat = {
                      IsExpandedByDefault: false,
                      ReportCategoryID: null,
                      ReportCategoryName: "",
                      Reports: [],
                      CatHeight: 40,
                      CatCls: 'Cat1ReportsHead',
                      CatOpen: false,
                    };
                    RepCat.IsExpandedByDefault = RepList[i].IsExpandedByDefault;
                    RepCat.ReportCategoryID = RepList[i].ReportCategoryID;
                    RepCat.ReportCategoryName = RepList[i].ReportCategoryName;
                    RepCat.Reports = RepList[i].Reports;
                    if(RepList[i].IsExpandedByDefault){
                      RepCat.CatCls = 'Cat1ReportsHeadH'
                      RepCat.CatHeight = 'auto';
                      RepCat.CatOpen = true;
                    }
                    AllReps.push(RepCat)
                  }
                  this.setState({ReportList: RepList,
                    AllReps
                  },()=>{
                    const RepName = RepList[0].Reports[0].ReportName;
                    const RepID = RepList[0].Reports[0].ReportID;
                    this.ReportClicked(RepID, 0, RepName, 0);
                  });
              }
            }
          }).catch(error => {
            //alert(error);
          });
      }

      componentDidUpdate(){

        if(parseInt(this.props.RefreshPages.Reports, 10) !== this.state.PageRefreshes){
            this.setState({
              PageRefreshes: parseInt(this.props.RefreshPages.Reports, 10),
              ShowSubmitBtn:false,
              ParametersNamesArray:[],
              ParametersArray:[],
              ParametersTypesArray:[],
              IFrameURL:'',
              ReportParameterList:[],
              ReportList:[],
              Reports:[],
              Categ1H:30,
              Categ1Open:false,
              Categ2H:30,
              Categ2Open:false,
              Categ3H:30,
              Categ3Open:false,
              Categ4H:30,
              Categ4Open:false,
              ChosenReport:0,
              ChosenReportInd: null,
              ChosenReportFileName:'',
              innerwidth: window.innerWidth,
              AllReps: [],
              CatInd: null,
              DateFrom: new Date(),
              DateTo: new Date(),
              CallID:''
            },()=>{
                this.componentDidMount();
            })
        }
    }


    componentDidMount(){
        //isMounted = true;
        this.getRepList();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }
  
    componentWillUnmount(){
      //isMounted = false;
      window.removeEventListener("resize", this.updateDimensions.bind(this));
      var Parameter = 0;
        this.props.refreshPage(Parameter, 'REFRESH_REPORTS')
    }

    updateDimensions() {
      let windowwidth  = window.innerWidth;
      this.setState({ innerwidth: windowwidth});
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
        var IFH = '100%';
        if(this.state.innerwidth < 850){
          IFH = '600px';
        }
          //const f = this.state.ReportParameterList;
          var rend = false;
          if(this.state.ReportList.length !== 0){
            rend = true;
          }
    
          const {
            AllReps,
            DateFrom,
            DateTo,
            IFrameURL,
            isReportLoaded,
            ReportInstruction
          }= this.state;
        return(
            <div className="reportsPage">
                <div className="RepbreadCrumb">
                    <span onClick={this.gotoDashboard} className="RepbreadCrumblink HomePage">
                        Home{" "}
                    </span>{" "}
                    <span> {">"} Reports </span>
                </div>
                <div className="ReporstsCont">
                    <div className="RepListCont">
                    {rend ? <div>
                      {AllReps.map((Cat, index1)=>(
                        <div className='Cat1Reports' style={{height: Cat.CatHeight}} key={index1} id={index1}>
                          <p className={Cat.CatCls} role='button' onClick={this.OpenCateg} id={index1}>
                          <i className='replistfa'><FontAwesomeIcon
                            icon="tachometer-alt"
                            size="1x"
                            />
                          </i>
                          {Cat.ReportCategoryName}</p>
                          {Cat.Reports.map ((rep, index)=>(
                              <RepListGrid 
                                key={index}
                                parind={index1}
                                Report={rep}
                                ind={index}
                                ReportClicked={this.ReportClicked}
                                ChosenReport={this.state.ChosenReport}/>
                          ))}
                        </div>
                      ))}
                    </div> : null}

                    </div>
                    <div className="RepIFContainer">
                    {isReportLoaded ? 
                      <Iframe
                        url={IFrameURL}
                        width="100%"
                        height={IFH}
                        id="IFrameID"
                        className="myClassname"
                        display="initial"
                        position="relative"
                        allowFullScreen
                      /> : <div dangerouslySetInnerHTML={{ __html: ReportInstruction }} className='Insts'/>}
          </div>
                    <div className="RepFormContainer" >

                      {this.state.ReportParameterList.map((Obj, index)=>(
                      <ReportsParameterList
                        key={index} 
                        ParamObj={Obj}
                        ParameterChanged={this.ParameterChanged}
                        DateFrom={DateFrom}
                        DateTo={DateTo}
                        ind={index}/>
                      ))}
                      {this.state.ShowSubmitBtn ? <input type='button' value='Show' className='showReportBtn' onClick={this.showReport}/> : null}
                    </div>
                    
                </div>
            </div>
        )
    }
}

class RepListGrid extends Component{
  constructor(props){
    super(props);
    this.state={};
    this.ReportClicked = this.ReportClicked.bind(this);
  }

  ReportClicked(){
    const parind = this.props.parind;
    const RepInd = this.props.ind;
    const fileName = this.props.Report.FileName.replace(/\s+/g, '');
    this.props.ReportClicked(this.props.Report.ReportID, RepInd, fileName, parind);
  }

  render(){
    var cls = 'reportName';
    const {
      //FileName = '',
    ReportID='',
    ReportName=''} = this.props.Report || '';

    if (parseInt(ReportID, 10) === parseInt(this.props.ChosenReport, 10)){
cls = 'reportName chosen';
    }
    return(
      <div className={cls} role='button' onClick={this.ReportClicked}>
      <i className='replistfa'><FontAwesomeIcon
                  icon="ticket-alt"
                  size="sm"
                  transform={{ rotate: -45 }}
                /></i>  <p className='replistRepName'>{ReportName}</p>
      </div>
    )
  }
}

const mapStateToProps = state => ({
    UserToken: state.UserAuthenticationInfo.AuthenticationInfo.AuthenticationToken,
    BranchID: state.ChangeUserAssignedBranch.BranchID,
    UserAuthenticationInfo: state.UserAuthenticationInfo.AuthenticationInfo,
    RefreshPages: state.RefreshPages,
    UserAuth: state.UserAuthenticationInfo.AuthenticationInfo.Applications[state.UserAuthenticationInfo.AuthenticationInfo.SelectedApplication].Authorities,
    IsITUser: state.UserAuthenticationInfo.AuthenticationInfo.IsITUser,
  });
  
  const mapDispatchToProps = dispatch => ({
    showHideLoader: (isShow, Type) => dispatch(showHideLoader(isShow, Type)),
    refreshPage: (Parameter, Type) =>dispatch(refreshPage(Parameter, Type))
  });

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(ReportPage));