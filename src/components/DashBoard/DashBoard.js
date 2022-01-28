import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./DashBoardStyle.css";
import * as urls from "../../constants/URL";
import axios from "axios";
import ReactTooltip from "react-tooltip";
//import { Chart } from "react-google-charts";
import { ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import moment from 'moment';
import { saveUserAuthenticationInfo, changeSelectedUserBranch, refreshPage, showHideLoader } from '../../actions';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector, LabelList, Text, LineChart, Line,
} from 'recharts';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}) => {
   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} fontSize={16} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


const Colors=[
  'success',
  'info',
  'danger',
  null,
  'warning'
]

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PageRefreshes: 0,
      BranchID: null,
      Chart4Info: '',
      f: "",
      Chart1Data:[],
      Chart2Data:[],
      Chart3Data:[],
      Chart5Data:[],
      Boxes: [
        {
          Count: 0,
          Info: "",
          Title: ""
        },
        {
          Count: 0,
          Info: "",
          Title: ""
        },
        {
          Count: 0,
          Info: "",
          Title: ""
        },
        {
          Count: 0,
          Info: "",
          Title: ""
        },
        {
          Count: 0,
          Info: "",
          Title: ""
        }
      ],
      WPHeight: 635,
      WPArrow: "&#9662;",
      WPPos: "Dn",
      WOHeight: 635,
      WOArrow: "&#9662;",
      WOPos: "Dn",
      NumRepHeight: 35,
      NumRepArrow: "&#9652;",
      NumRepPos: "Up",
      TopTenHeight: 35,
      TopTenArrow: "&#9652;",
      TopTenPos: "Up",
      RecAcHeight: 35,
      RecAcArrow: "&#9652;",
      RecAcPos: "Up",
      FCProgHeight: 35,
      FCProgArrow: "&#9652;",
      FCProgPos: "Up",
      ChartsLoaded: false,
      ChartsLoaded1:false,
      DashboardChartsSection: {
        ChartParameters: null,
        Charts: [
          {
            Key: "",
            Value: {
              ChartItems: [
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                }
              ],
              Info: "",
              SubTitle: null,
              Title: ""
            }
          },
          {
            Key: "",
            Value: {
              ChartItems: [
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                }
              ],
              Info: "",
              SubTitle: null,
              Title: ""
            }
          },
          {
            Key: "",
            Value: {
              ChartItems: [
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                }
              ],
              Info: "",
              SubTitle: null,
              Title: ""
            }
          },
          {
            Key: "",
            Value: {
              ChartItems: [
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                }
              ],
              Info: null,
              SubTitle: null,
              Title: null
            }
          }
        ],
        Info: null,
        Title: ""
      },
      DashboardProgressbarSection: {
        ChartParameters: null,
        Info: "",
        Progressbars: [
          {
            Name: "",
            Percentage: 0,
            Value: 0
          },
          {
            Name: "",
            Percentage: 0,
            Value: 0
          },
          {
            Name: "",
            Percentage: 0,
            Value: 0
          },
          {
            Name: "",
            Percentage: 0,
            Value: 0
          },
          {
            Name: "",
            Percentage: 0,
            Value: 0
          },
          {
            Name: "",
            Percentage: 0,
            Value: 0
          },
          {
            Name: "",
            Percentage: 0,
            Value: 0
          }
        ],
        Title: ""
      },
      NumberOfReportedChart: {
        ChartParameters: [
          {
            ID: 0,
            Name: "",
            ToolTip: ""
          },
          {
            ID: 0,
            Name: "",
            ToolTip: ""
          }
        ],
        Charts: [
          {
            Key: "",
            Value: {
              ChartItems: [
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                },
                {
                  ItemName: "",
                  ItemValues: [
                    {
                      Key: "",
                      Value: 0
                    }
                  ]
                }
              ],
              Info: null,
              SubTitle: "",
              Title: ""
            }
          }
        ],
        
      Info:'',
      SubTitle:'',
      Title:''
      },
      Chart4Data:[["Status", "Percentage", {role: "style" }],
      ["", 0, ""]],
      NumOfRepChartParameters: [{
        value: 0,
        key: 1,
        label: "",
        ToolTip: ""
      },
      {
        value: 1,
        key: 2,
        label: "",
        ToolTip: ""
      }],
      SelNumRedParam:0,
      DashboardRankedRadTestSection: {
        Info: "",
        RankedRadTestNameTitle: "",
        RankedRadTestValueTitle: "",
        RankedRadTests: [],
        Title: ""
    },
    DashboardActivities: {
      Activities: [],
      Info: "",
      Title: ""
  },
  DashboardProgressbarFSection: {
    ChartParameters: null,
    Info: "",
    Progressbars: [
    ],
    Title: ""
},
    isDashboardLoaded: false,
    isReportedStatsLoaded: false,
    isTopTenLoaded: false,
    isRecAcLoaded: false,
    isFCProgLoaded: false
    };
    this.getDashboard = this.getDashboard.bind(this);
    this.getGetReportedStatistics = this.getGetReportedStatistics.bind(this);
    this.ShowHideWorkProgress = this.ShowHideWorkProgress.bind(this);
    this.ShowHideWorkOrder = this.ShowHideWorkOrder.bind(this);
    this.ShowHideNumRep = this.ShowHideNumRep.bind(this);
    this.ShowHideTopTen = this.ShowHideTopTen.bind(this);
    this.ShowHideRecAc = this.ShowHideRecAc.bind(this);
    this.ShowHideFCProg = this.ShowHideFCProg.bind(this);
    this.NumRepParamChanged = this.NumRepParamChanged.bind(this);
    this.getTopTen = this.getTopTen.bind(this);
    this.getRecAc = this.getRecAc.bind(this);
    this.reAuthenticate = this.reAuthenticate.bind(this);
    this.getFCProg = this.getFCProg.bind(this);
    this.checkForLoaded = this.checkForLoaded.bind(this);
  }

  reAuthenticate(){
        const mom = "?a=" + moment();
        const url = 'http://5.189.170.55/Security.WCFRESTService/Services/SecurityWebService.svc/UserAuthenticate';
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
                if(responseJson.ServiceError.Message === 'INVALIDTOKEN'){
                  //this.reAuthenticate();
                }
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
                var SelectedApp = 0;
                for(var j=0; j<PrimUserAuthenticationInfo.Applications.length; j++){
                  if(PrimUserAuthenticationInfo.Applications[j].ID === 3){
                    SelectedApp = j;
                  }
                }
                UserAuthenticationInfo.SelectedApplication = SelectedApp;
                  var BrID = null;
                  var BrName = '';
                  for(var i=0; i<UserAuthenticationInfo.Branches.length; i++){
                      if(UserAuthenticationInfo.Branches[i].IsDefault){
                        BrID = UserAuthenticationInfo.Branches[i].ID;
                        BrName = UserAuthenticationInfo.Branches[i].EnglishName;
                      }
                  }
                  this.props.saveUserAuthenticationInfo(UserAuthenticationInfo, 'SAVE_AUTHENTICATIONINFO');
                  this.props.onBranchChanged(UserAuthenticationInfo.Branches, BrID, BrName, 'SAVE_BRANCHES');
                   
                  this.componentDidMount();
              }
            }
          })
          .catch(error => {
            const l=2;
          });
  }

  NumRepParamChanged(val){
    this.setState({ SelNumRedParam: val.key }, () => {
      this.getGetReportedStatistics(true);
    });
  }

  ShowHideFCProg(){
    if (this.state.FCProgPos === "Up") {
      this.setState({  FCProgPos: "Dn", FCProgArrow: "&#9662;" }, ()=>{
        this.getFCProg(true);
      });
    } else if (this.state.FCProgPos === "Dn")
      this.setState({ FCProgHeight: 35, FCProgPos: "Up", FCProgArrow: "&#9652;" });
  }
  
  ShowHideRecAc(){
    if (this.state.RecAcPos === "Up") {
      this.setState({ RecAcHeight: 400, RecAcPos: "Dn", RecAcArrow: "&#9662;" }, ()=>{
        this.getRecAc(true);
      });
    } else if (this.state.RecAcPos === "Dn")
      this.setState({ RecAcHeight: 35, RecAcPos: "Up", RecAcArrow: "&#9652;" });
  }

  ShowHideTopTen(){
    if (this.state.TopTenPos === "Up") {
      this.setState({ TopTenHeight: 420, TopTenPos: "Dn", TopTenArrow: "&#9662;" }, ()=>{
        this.getTopTen(true);
      });
    } else if (this.state.TopTenPos === "Dn")
      this.setState({ TopTenHeight: 35, TopTenPos: "Up", TopTenArrow: "&#9652;" });
  }

  ShowHideNumRep(){
    if (this.state.NumRepPos === "Up") {
      this.setState({ NumRepHeight: 420, NumRepPos: "Dn", NumRepArrow: "&#9662;" }, ()=>{
        this.getGetReportedStatistics(true);
      });
    } else if (this.state.NumRepPos === "Dn")
      this.setState({ NumRepHeight: 35, NumRepPos: "Up", NumRepArrow: "&#9652;" });
  }

  ShowHideWorkOrder() {
    if (this.state.WOPos === "Up") {
      this.setState({ WOHeight: 615, WOPos: "Dn", WOArrow: "&#9662;" });
    } else if (this.state.WOPos === "Dn")
      this.setState({ WOHeight: 35, WOPos: "Up", WOArrow: "&#9652;" });
  }

  ShowHideWorkProgress() {
    if (this.state.WPPos === "Up") {
      this.setState({ WPHeight: 615, WPPos: "Dn", WPArrow: "&#9662;" });
    } else if (this.state.WPPos === "Dn")
      this.setState({ WPHeight: 35, WPPos: "Up", WPArrow: "&#9652;" });
  }

  getFCProg(LoadData){
    const a = moment();
    var LD = 0;
    if(this.state.FCProgPos === 'Dn'){
      LD = 1;
    }
    const BranchID = this.props.BranchID;
    const url = `${urls.URL}DashboardWebService.svc/GetDashboardRequestedTestsPerGroup/${BranchID}/${LD}?${a}`;
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
            if(responseJson.ServiceError.Message === 'INVALIDTOKEN'){
              //this.reAuthenticate();
            }
            } else {
              let DashboardProgressbarFSection = Object.assign({}, this.state.DashboardProgressbarFSection);
              if(responseJson.DashboardProgressbarSection.Progressbars === null){
                responseJson.DashboardProgressbarSection.Progressbars = DashboardProgressbarFSection.Progressbars;
              }
              const Height = responseJson.DashboardProgressbarSection.Progressbars.length*70;
              this.setState({
                DashboardProgressbarFSection: responseJson.DashboardProgressbarSection,
                FCProgHeight: Height,
                isFCProgLoaded: true
              }, ()=>{
                this.checkForLoaded();
              });
            }
          }
        })
        .catch(error => {});
  }

  getRecAc(LoadData){
    const a = moment();
    var LD = 0;
    if(this.state.RecAcPos === "Dn"){
      LD = 1;
    }
    const BranchID = this.props.BranchID;
    const url = `${urls.URL}DashboardWebService.svc/GetTopNActivities/${BranchID}/${LD}?${a}`;
    this.props.showHideLoader(true, 'SHOW_HIDE')
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
            if(responseJson.ServiceError.Message === 'INVALIDTOKEN'){
              //this.reAuthenticate();
            }
            } else {
              let DashboardActivities = Object.assign({}, this.state.DashboardActivities);
              if(responseJson.DashboardActivities.Activities === null){
                responseJson.DashboardActivities.Activities = DashboardActivities.Activities;
              }
              this.setState({
                DashboardActivities: responseJson.DashboardActivities,
                isRecAcLoaded: true
              }, ()=>{
                this.checkForLoaded();
              });
            }
          }
        })
        .catch(error => {});
  }
  
  getTopTen(LoadData){
    const a = moment();
    var LD = 0;
    if(this.state.TopTenPos === "Dn"){
      LD = 1;
    }
    const BranchID = this.props.BranchID;
    const url = `${urls.URL}DashboardWebService.svc/GetTopNRankedRadTestsNMonthAgo/${BranchID}/${LD}?${a}`;
    this.props.showHideLoader(true, 'SHOW_HIDE')
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
            if(responseJson.ServiceError.Message === 'INVALIDTOKEN'){
              //this.reAuthenticate();
            }
          } else {
            let DashboardRankedRadTestSection = Object.assign({}, this.state.DashboardRankedRadTestSection);
            if(responseJson.DashboardRankedRadTestSection.RankedRadTests === null){
              responseJson.DashboardRankedRadTestSection.RankedRadTests = DashboardRankedRadTestSection.RankedRadTests;
            }
            if(responseJson.DashboardRankedRadTestSection.RankedRadTestNameTitle === null){
              responseJson.DashboardRankedRadTestSection.RankedRadTestNameTitle = DashboardRankedRadTestSection.RankedRadTestNameTitle;
            }
            if(responseJson.DashboardRankedRadTestSection.RankedRadTestValueTitle === null){
              responseJson.DashboardRankedRadTestSection.RankedRadTestValueTitle = DashboardRankedRadTestSection.RankedRadTestValueTitle;
            }
            this.setState({
              DashboardRankedRadTestSection: responseJson.DashboardRankedRadTestSection,
              isTopTenLoaded: true
            }, ()=>{
              this.checkForLoaded();
            });
          }
        }
      })
      .catch(error => {});
  }

  getGetReportedStatistics(LoadData) {
    const a = moment();
    var LD = 0;
    const Param = this.state.NumOfRepChartParameters[this.state.SelNumRedParam].value;
    if(this.state.NumRepPos === 'Dn'){
      LD = 1;
    }
    const BranchID = this.props.BranchID;
    const url = `${urls.URL}DashboardWebService.svc/GetReportedStatistics/${BranchID}/${Param}/${LD}?${a}`;
    this.props.showHideLoader(true, 'SHOW_HIDE')
    axios({
      method: "get",
      url: url,
      //data: JSON.stringify(req),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        auth_Token: this.props.UserToken,
      },
      withCredentials: true
    })
      .then(response => {
        if (response.data) {
          const responseJson = response.data;
          if (responseJson.HasError) {
            //const Msg = responseJson.ServiceError.Message;
            if(responseJson.ServiceError.Message === 'INVALIDTOKEN'){
              //this.reAuthenticate();
            }
          } else {
            let NumberOfReportedChart = Object.assign({}, this.state.NumberOfReportedChart);
            const Charts = NumberOfReportedChart.Charts;
            const Response = responseJson.DashboardChartsSection;
            NumberOfReportedChart = Response;

            if(Response.Charts === null){
              NumberOfReportedChart.Charts = Charts;
            }

            const NumOfRepChartParameters = Response.ChartParameters.map((opt, index)=>(
              {
                value: opt.ID, label: opt.Name, key:index, ToolTip: opt.ToolTip
              }
            ))

            const s = this.state.NumOfRepChartParameters[this.state.SelNumRedParam].label
            const Chart5 = Response.Charts[0].Value.ChartItems;
            var Chart5Data=[];
            const LBL = this.state.NumOfRepChartParameters[this.state.SelNumRedParam].label;
            /*if(s === 'Test'){
              for(var i=0; i<Chart5.length; i++){
                var newDataItem1 = {};
                newDataItem1={
                  name: Chart5[i].ItemValues[0].Key,
                  Tests : Chart5[i].ItemValues[0].Value
                  //fill: colors[i]
                }
                Chart5Data.push(newDataItem1)
              }
            }else if (s === 'Patient'){
              for(var i=0; i<Chart5.length; i++){
                var newDataItem1 = {};
                newDataItem1={
                  name: Chart5[i].ItemValues[0].Key,
                  Patients : Chart5[i].ItemValues[0].Value
                  //fill: colors[i]
                }
                Chart5Data.push(newDataItem1)
              }
            }*/

            for(var i=0; i<Chart5.length; i++){
              var newDataItem1 = {};
              newDataItem1={
                name: Chart5[i].ItemValues[0].Key,
                LBL : Chart5[i].ItemValues[0].Value
                //fill: colors[i]
              }
              Chart5Data.push(newDataItem1)
            }

            var strChart5 = JSON.stringify(Chart5Data);
            strChart5 = strChart5.replace(/LBL/g, LBL)

            Chart5Data = JSON.parse(strChart5);

            this.setState({
              NumberOfReportedChart,
              NumOfRepChartParameters,
              Chart5Data,
              isReportedStatsLoaded: true
            }, ()=>{
              this.checkForLoaded();
            });
          }
        }
      })
      .catch(error => {});
  }

  getDashboard() {
    const a = moment();
    const BranchID = this.props.BranchID;
    const url = `${urls.URL}DashboardWebService.svc/GetDashboard/${BranchID}?${a}`;
    if(BranchID !== null)
    {      
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
          const responseJson = response.data;
          if (responseJson.HasError) {
            //const Msg = responseJson.ServiceError.Message;
            if(responseJson.ServiceError.Message === 'INVALIDTOKEN'){
              this.reAuthenticate();
            }
          } else {
            const colors= [
              "#25b7d3",
              "#ff0000",
              "#ec003b",
              "#00ecb1",
              "#1cec00",
              "#f7fc00",
              "#940388",
              "#00b4e0",
              "#00e070"
            ]
            const Response = responseJson.Dashborad;
            var DCS = null;
            let DashboardChartsSection = Object.assign({}, this.state.DashboardChartsSection);
            DashboardChartsSection.ChartParameters = Response.DashboardChartsSection.ChartParameters;
            DashboardChartsSection.Info = Response.DashboardChartsSection.Info;
            DashboardChartsSection.Title = Response.DashboardChartsSection.Title;
            var Chart1 = null;
            var Chart2 = null;
            var Chart3 = null;
            var Chart4 = null;
            var Chart1Data = [];
            var Chart2Data = [];
            var Chart3Data = [];
            var Chart4Data = [];
            var f='';
            var Chart4Info = '';
            if(Response.DashboardChartsSection.Charts.length > 3){
              DashboardChartsSection.Charts[3] = Response.DashboardChartsSection.Charts[3];
              Chart4Data = [["Status", "Percentage", { role: "style" }]];
              DCS = Response.DashboardChartsSection.Charts[3].Value.ChartItems;
            for(var i=0; i<DCS.length; i++){
              const l = [DCS[i].ItemName, DCS[i].ItemValues[0].Value, "#0593af"]
              Chart4Data.push(l);
            }
            
            Chart4Info = Response.DashboardChartsSection.Charts[3].Value.Info
            Chart4 = Response.DashboardChartsSection.Charts[3].Value.ChartItems;
            var Chart4Data=[];
            for(var i=0; i<Chart4.length; i++){
              var newDataItem1 = {};
              newDataItem1={
                name: Chart4[i].ItemValues[0].Key,
                value: Chart4[i].ItemValues[0].Value,
                fill: colors[i]
              }
              //if(parseInt(Chart4[i].ItemValues[0].Value, 10) !== 0){
                Chart4Data.push(newDataItem1)
              //}
            }
          }

          if(Response.DashboardChartsSection.Charts.length > 0){
            DashboardChartsSection.Charts[0] = Response.DashboardChartsSection.Charts[0];
            Chart1 = Response.DashboardChartsSection.Charts[0].Value.ChartItems;
            Chart1Data = [
              {
                name:'All Orders',
                Value:Chart1[0].ItemValues[0].Value,
                fill: "#0593af"
              },
              {
                name:'My Orders',
                Value:Chart1[1].ItemValues[0].Value,
                fill: "#04a111"
              },{
                name:Chart1[2].ItemName,
                Value:Chart1[2].ItemValues[0].Value,
                fill: "#fcb900"
              }
            ];
          }
            
          if(Response.DashboardChartsSection.Charts.length > 1){
            DashboardChartsSection.Charts[1] = Response.DashboardChartsSection.Charts[1];
            Chart2 = Response.DashboardChartsSection.Charts[1].Value.ChartItems;
            Chart2Data=[];
            for(var i=0; i<Chart2.length; i++){
              var newDataItem = {};
              newDataItem={
                name: Chart2[i].ItemValues[0].Key,
                value: Chart2[i].ItemValues[0].Value,
                fill: colors[i]
              }
              //if(parseInt(Chart2[i].ItemValues[0].Value, 10) !== 0){
              Chart2Data.push(newDataItem)}
          }
            
          if(Response.DashboardChartsSection.Charts.length > 2){
            DashboardChartsSection.Charts[2] = Response.DashboardChartsSection.Charts[2];
            f = Response.DashboardChartsSection.Charts[2].Value.Info
            Chart3 = Response.DashboardChartsSection.Charts[2].Value.ChartItems;
            Chart3Data=[
              {
                name:'All Orders',
                Value:Chart3[0].ItemValues[0].Value,
                fill: "#0593af"
              },
              {
                name:'My Orders',
                Value:Chart3[1].ItemValues[0].Value,
                fill: "#04a111"
              },{
                name:Chart3[2].ItemName,
                Value:Chart3[2].ItemValues[0].Value,
                fill: "#fcb900"
              }
            ]
          }
            
            this.setState({
              Chart1Data,
              Chart2Data,
              Chart3Data,
              Chart4Data,
              Chart4Info,
              ChartsLoaded: true,
              f,
              Boxes: Response.Boxes,
              DashboardChartsSection,
              DashboardProgressbarSection: Response.DashboardProgressbarSection,
              isDashboardLoaded: true
            }, ()=>{
              this.checkForLoaded();
            });
          }
        }
      })
      .catch(error => {
        const l = 2;
      });}else{
        //this.reAuthenticate();
      }
  }

  componentDidMount() { 
    this.setState({
      BranchID: this.props.BranchID,
      isDashboardLoaded: false,
      isReportedStatsLoaded: false,
      isTopTenLoaded: false,
      isRecAcLoaded: false,
      isFCProgLoaded: false
    }, ()=>{
      this.getDashboard();
      this.getGetReportedStatistics();
      this.getTopTen();
      this.getRecAc();
      this.getFCProg();
    })
  }

  checkForLoaded(){
    if(this.state.isDashboardLoaded &&
      this.state.isReportedStatsLoaded &&
      this.state.isTopTenLoaded &&
      this.state.isRecAcLoaded &&
      this.state.isFCProgLoaded ){
        this.props.showHideLoader(false, 'SHOW_HIDE')
      }
  }

  componentDidUpdate(){
    if(this.state.BranchID !== this.props.BranchID){
      this.componentDidMount();
    }
    if(parseInt(this.props.RefreshPages.Dashboard, 10) !== this.state.PageRefreshes){
      this.setState({
        PageRefreshes: parseInt(this.props.RefreshPages.Dashboard, 10)
      }, ()=>{
        this.setState({
          BranchID: null,
f: "",
Chart1Data:[],
Chart2Data:[],
Chart3Data:[],
Chart5Data:[],
Boxes: [
  {
    Count: 0,
    Info: "",
    Title: ""
  },
  {
    Count: 0,
    Info: "",
    Title: ""
  },
  {
    Count: 0,
    Info: "",
    Title: ""
  },
  {
    Count: 0,
    Info: "",
    Title: ""
  },
  {
    Count: 0,
    Info: "",
    Title: ""
  }
],
WPHeight: 635,
WPArrow: "&#9662;",
WPPos: "Dn",
WOHeight: 635,
WOArrow: "&#9662;",
WOPos: "Dn",
NumRepHeight: 35,
NumRepArrow: "&#9652;",
NumRepPos: "Up",
TopTenHeight: 35,
TopTenArrow: "&#9652;",
TopTenPos: "Up",
RecAcHeight: 35,
RecAcArrow: "&#9652;",
RecAcPos: "Up",
FCProgHeight: 35,
FCProgArrow: "&#9652;",
FCProgPos: "Up",
DashboardChartsSection: {
  ChartParameters: null,
  Charts: [
    {
      Key: "",
      Value: {
        ChartItems: [
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          }
        ],
        Info: "",
        SubTitle: null,
        Title: ""
      }
    },
    {
      Key: "",
      Value: {
        ChartItems: [
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          }
        ],
        Info: "",
        SubTitle: null,
        Title: ""
      }
    },
    {
      Key: "",
      Value: {
        ChartItems: [
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          }
        ],
        Info: "",
        SubTitle: null,
        Title: ""
      }
    },
    {
      Key: "",
      Value: {
        ChartItems: [
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          }
        ],
        Info: null,
        SubTitle: null,
        Title: null
      }
    }
  ],
  Info: null,
  Title: ""
},
DashboardProgressbarSection: {
  ChartParameters: null,
  Info: "",
  Progressbars: [
    {
      Name: "",
      Percentage: 0,
      Value: 0
    },
    {
      Name: "",
      Percentage: 0,
      Value: 0
    },
    {
      Name: "",
      Percentage: 0,
      Value: 0
    },
    {
      Name: "",
      Percentage: 0,
      Value: 0
    },
    {
      Name: "",
      Percentage: 0,
      Value: 0
    },
    {
      Name: "",
      Percentage: 0,
      Value: 0
    },
    {
      Name: "",
      Percentage: 0,
      Value: 0
    }
  ],
  Title: ""
},
NumberOfReportedChart: {
  ChartParameters: [
    {
      ID: 0,
      Name: "",
      ToolTip: ""
    },
    {
      ID: 0,
      Name: "",
      ToolTip: ""
    }
  ],
  Charts: [
    {
      Key: "",
      Value: {
        ChartItems: [
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          },
          {
            ItemName: "",
            ItemValues: [
              {
                Key: "",
                Value: 0
              }
            ]
          }
        ],
        Info: null,
        SubTitle: "",
        Title: ""
      }
    }
  ],
  
Info:'',
SubTitle:'',
Title:''
},
Chart4Data:[["Status", "Percentage", {role: "style" }],
["", 0, ""]],
NumOfRepChartParameters: [{
  value: 0,
  key: 1,
  label: "",
  ToolTip: ""
},
{
  value: 1,
  key: 2,
  label: "",
  ToolTip: ""
}],
SelNumRedParam:0,
DashboardRankedRadTestSection: {
  Info: "",
  RankedRadTestNameTitle: "",
  RankedRadTestValueTitle: "",
  RankedRadTests: [],
  Title: ""
},
DashboardActivities: {
Activities: [],
Info: "",
Title: ""
},
DashboardProgressbarFSection: {
ChartParameters: null,
Info: "",
Progressbars: [
],
Title: ""
}
        }, ()=>{
          this.componentDidMount();
        })
      })
    }
  }

  componentWillUnmount(){
    var Parameter = 0;
    this.props.refreshPage(Parameter, 'REFRESH_DASHBOARD');
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
    const {
      Boxes,
      DashboardChartsSection,
      DashboardProgressbarSection,
      NumberOfReportedChart,
      NumOfRepChartParameters,
      DashboardRankedRadTestSection,
      DashboardActivities,
      DashboardProgressbarFSection,
      Chart2Data,
      Chart4Data,
      Chart4Info
    } = this.state;
    if (this.state.WPPos === "Dn") {
      if (this.state.WPHeight === 635) {
      }
    }

    const Chart5Tooltip = NumOfRepChartParameters[this.state.SelNumRedParam].label;
    //const Chart5Tooltip = 's';
    return (
      <div className="labDashboardPage">
        <div className="labDashboardTopContainer">
          <div className="TopContainerElements pdgrt">
            <div className="TopContainerElement1">
              <p className="Cont1Icon" />
              <p className="infoIcon" data-tip={Boxes[0].Info} data-for="El1" />
              <ReactTooltip
                id="El1"
                className="InfoToolTip GrayToolTip"
                place="bottom"
                effect="solid"
                html={true}
              />
              <div className="TopElementsLabels1">
                {" "}
                <span>{Boxes[0].Title} </span>
                <br />
                <span className="TopElementsLabels2">{Boxes[0].Count} </span>
              </div>
            </div>
          </div>
          <div className="TopContainerElements pdgrt pdglt">
            <div className="TopContainerElement2">
              <p className="Cont1Icon" />
              <p className="infoIcon" data-tip={Boxes[1].Info} data-for="El1" />
              <ReactTooltip
                id="El1"
                className="InfoToolTip GrayToolTip"
                place="bottom"
                effect="solid"
                html={true}
              />
              <div className="TopElementsLabels1">
                {" "}
                <span>{Boxes[1].Title} </span>
                <br />
                <span className="TopElementsLabels2">{Boxes[1].Count} </span>
              </div>
            </div>
          </div>
          <div className="TopContainerElements pdgrt pdglt">
            <div className="TopContainerElement3">
              <p className="Cont1Icon" />
              <p className="infoIcon" data-tip={Boxes[2].Info} data-for="El1" />
              <ReactTooltip
                id="El1"
                className="InfoToolTip GrayToolTip"
                place="bottom"
                effect="solid"
                html={true}
              />
              <div className="TopElementsLabels1">
                {" "}
                <span>{Boxes[2].Title} </span>
                <br />
                <span className="TopElementsLabels2">{Boxes[2].Count} </span>
              </div>
            </div>
          </div>
          <div className="TopContainerElements pdgrt pdglt">
            <div className="TopContainerElement4">
              <p className="Cont1Icon" />
              <p className="infoIcon" data-tip={Boxes[3].Info} data-for="El1" />
              <ReactTooltip
                id="El1"
                className="InfoToolTip GrayToolTip"
                place="bottom"
                effect="solid"
                html={true}
              />
              <div className="TopElementsLabels1">
                {" "}
                <span>{Boxes[3].Title} </span>
                <br />
                <span className="TopElementsLabels2">{Boxes[3].Count} </span>
              </div>
            </div>
          </div>
          <div className="TopContainerElements pdglt">
            <div className="TopContainerElement5">
              <p className="Cont1Icon" />
              <p className="infoIcon" data-tip={Boxes[4].Info} data-for="El1" />
              <ReactTooltip
                id="El1"
                className="InfoToolTip GrayToolTip"
                place="bottom"
                effect="solid"
                html={true}
              />
              <div className="TopElementsLabels1">
                {" "}
                <span>{Boxes[4].Title} </span>
                <br />
                <span className="TopElementsLabels2">{Boxes[4].Count} </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="labDashboradSecondLeftContainer labContHeightTrans"
          style={{ height: this.state.WPHeight + "px" }}
        >
          <div
            className="labContTopBar"
            role="button"
            onClick={this.ShowHideWorkProgress}
          >
            <span
              style={{ color: "#0bcbf1" }}
              dangerouslySetInnerHTML={{ __html: this.state.WPArrow }}
            />{" "}
            {DashboardChartsSection.Title}
          </div>
          <div className="SecondLeftContainerChart1">
          <div className='ChartTitle'> {DashboardChartsSection.Charts[0].Value.Title}</div>
            <p
              className="infoIcon"
              data-tip={DashboardChartsSection.Charts[0].Value.Info}
              data-for="chart1I"
            />
            <ReactTooltip
              className="GrayToolTip"
              id="chart1I"
              place="bottom"
              effect="solid"
              html={true}
            />
            <BarChart
              width={450}
              height={270}
              data={this.state.Chart1Data}
              fontSize={15}
              margin={{
              top: 45, right: 30, left: -30, bottom: 5,
        }}
      >
        <XAxis dataKey="name" allowDataOverflow={true} fontSize={15}/>
        <YAxis  fontSize={16}/>
        <Tooltip contentStyle={{fontSize:14}}/>
        <Bar dataKey="Value">
      {/*<LabelList dataKey="name" position="insideTop" fill='#ffffff' />*/}
        </Bar>
      </BarChart>
          </div>
          <div className="SecondLeftContainerChart2">
          <div className='ChartTitle'> {DashboardChartsSection.Charts[1].Value.Title}</div>
            <p
              className="infoIcon"
              data-tip={DashboardChartsSection.Charts[1].Value.Info}
              data-for="chart2I"
            />
            <ReactTooltip
              className="GrayToolTip"
              id="chart2I"
              place="bottom"
              effect="solid"
              html={true}
            />
            <PieChart width={430} height={325}>
              <Pie 
                margin={{ top: 80, right: 30, left: 10, bottom: 5,}} 
                outerRadius={120} 
                data={this.state.Chart2Data} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                label={renderCustomizedLabel}
                isAnimationActive={false}
                labelLine={false} >
                
                  </Pie>
                
                <Tooltip contentStyle={{fontSize:14}}/>
                
                <Legend  align='right' layout='vertical' verticalAlign='middle'  wrapperStyle={{fontSize:14}}/>
            </PieChart>
          </div>
          <div className="SecondLeftContainerChart3">
          <div className='ChartTitle'> {DashboardChartsSection.Charts[2].Value.Title}</div>
            <p
              className="infoIcon"
              data-tip={DashboardChartsSection.Charts[2].Value.Info}
              data-for="chart1I"
            />
            <ReactTooltip
              className="GrayToolTip"
              id="chart1I"
              place="bottom"
              effect="solid"
              html={true}
            />
             <BarChart
              width={450}
              height={270}
              data={this.state.Chart3Data}
              fontSize={15}
              margin={{
              top: 55, right: 30, left: -30, bottom: 5,
        }}
      >
        <XAxis dataKey="name"  fontSize={15}/>
        <YAxis  fontSize={16}/>
        <Tooltip contentStyle={{fontSize:14}}/>
        <Bar dataKey="Value" fill="#8884d8" >
        </Bar>
      </BarChart>
          </div>
          <div
            className="SecondLeftContainerChart4"
            style={{ overflow: "visible" }}
          >
          <div className='ChartTitle'> {DashboardChartsSection.Charts[3].Value.Title}</div>
            <p
              className="infoIcon"
              data-tip={Chart4Info}
              data-for="chart4I"
            />
            <ReactTooltip
              className="GrayToolTip"
              id="chart4I"
              place="bottom"
              effect="solid"
              html={true}
            />
            <PieChart width={450} height={340}>
              <Pie 
                margin={{ top: 65, right: 30, left: 0, bottom: 5,}} 
                data={this.state.Chart4Data} 
                innerRadius={70} 
                outerRadius={120} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                label={renderCustomizedLabel}
                isAnimationActive={false}
                labelLine={false}/>
                <Tooltip contentStyle={{fontSize:14}} />
                <Legend  align='right' layout='vertical' verticalAlign='middle' wrapperStyle={{fontSize:14}}/>
            </PieChart>
          </div>
        </div>
        <div
          className="labDashboradSecondRightContainer labContHeightTrans"
          style={{ height: this.state.WOHeight + "px" }}
        >
          <div
            className="labContTopBar"
            role="button"
            onClick={this.ShowHideWorkOrder}
          >
            <p className="infoIcon" data-tip={DashboardProgressbarSection.Info} data-for="WOI" />
            <ReactTooltip
              className="GrayToolTip"
              id="WOI"
              place="bottom"
              effect="solid"
              html={true}
            />
            <span
              style={{ color: "#0bcbf1" }}
              dangerouslySetInnerHTML={{ __html: this.state.WOArrow }}
            />
            {DashboardProgressbarSection.Title}
          </div>
          <div className="labProgressBarsContainer">
            <p className="labSecContPBsLabels">
              {DashboardProgressbarSection.Progressbars[0].Name}
            </p>
            <ProgressBar
              now={DashboardProgressbarSection.Progressbars[0].Percentage}
              className="labSecContPBs"
              striped
              bsStyle="success"
            />{" "}
            <span className="labProgbarsPerc">
              &#10100;
              {DashboardProgressbarSection.Progressbars[0].Value}
              &#10101; {DashboardProgressbarSection.Progressbars[0].Percentage}%
            </span>
            <p className="labSecContPBsLabels">
              {DashboardProgressbarSection.Progressbars[1].Name}
            </p>
            <ProgressBar
              now={DashboardProgressbarSection.Progressbars[1].Percentage}
              className="labSecContPBs"
              striped
              bsStyle="info"
            />{" "}
            <span className="labProgbarsPerc">
              &#10100;
              {DashboardProgressbarSection.Progressbars[1].Value}
              &#10101; {DashboardProgressbarSection.Progressbars[1].Percentage}%
            </span>
            <p className="labSecContPBsLabels">
              {DashboardProgressbarSection.Progressbars[2].Name}
            </p>
            <ProgressBar
              now={DashboardProgressbarSection.Progressbars[2].Percentage}
              className="labSecContPBs"
              striped
              bsStyle="danger"
            />{" "}
            <span className="labProgbarsPerc">
              &#10100;
              {DashboardProgressbarSection.Progressbars[2].Value}
              &#10101; {DashboardProgressbarSection.Progressbars[2].Percentage}%
            </span>
            <p className="labSecContPBsLabels">
              {DashboardProgressbarSection.Progressbars[3].Name}
            </p>
            <ProgressBar
              now={DashboardProgressbarSection.Progressbars[3].Percentage}
              className="labSecContPBs"
              striped
              bsStyle={null}
            />{" "}
            <span className="labProgbarsPerc">
              &#10100;
              {DashboardProgressbarSection.Progressbars[3].Value}
              &#10101; {DashboardProgressbarSection.Progressbars[3].Percentage}%
            </span>
            <p className="labSecContPBsLabels">
              {DashboardProgressbarSection.Progressbars[4].Name}
            </p>
            <ProgressBar
              now={DashboardProgressbarSection.Progressbars[4].Percentage}
              className="labSecContPBs"
              striped
              bsStyle="warning"
            />{" "}
            <span className="labProgbarsPerc">
              &#10100;
              {DashboardProgressbarSection.Progressbars[4].Value}
              &#10101; {DashboardProgressbarSection.Progressbars[4].Percentage}%
            </span>
          </div>
        </div>
        <div className="labThirdContainer">
          <div className="labThirdContainerChartCont labContHeightTrans" style={{ height: this.state.NumRepHeight + "px" }}>
            <div className="labContTopBar">
              <div
                role="button"
                onClick={this.ShowHideNumRep}
                style={{ display: "inline-block" }}
              >
                <p
                  className="infoIcon"
                  data-tip={NumberOfReportedChart.Info}
                  data-for="DisStatI"
                />
                <ReactTooltip
                  className="GrayToolTip"
                  id="DisStatI"
                  place="bottom"
                  effect="solid"
                  html={true}
                />
                <span
                  style={{ color: "#0bcbf1" }}
                  dangerouslySetInnerHTML={{ __html: this.state.NumRepArrow }}
                />{" "}
                {NumberOfReportedChart.Title}
              </div>
              <div style={{ display: "inline-block", minWidth: "200px", marginLeft:10 }}>
              <Select
                  styles={customStyles}
                  value={NumOfRepChartParameters[this.state.SelNumRedParam]}
                  options={NumOfRepChartParameters}
                  placeholder="Search Branches..."
                  className="srchselect"
                  nocaret
                  data-live-search="true"
                  onChange={this.NumRepParamChanged}
                />
              </div>
            </div>
          <div className='labThirdLeftContainerChart'>
          
          <div className='ChartTitle'> {NumberOfReportedChart.Charts[0].Value.Title}</div>
          <LineChart
          width={500}
          height={350}
          data={this.state.Chart5Data}
          margin={{
            top: 70, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={15}/>
          <YAxis fontSize={16}/>
          <Tooltip contentStyle={{fontSize:14}}/>
          <Line  dataKey={Chart5Tooltip} stroke="#8884d8" fill="#8884d8" />
        </LineChart>
              <div className='DuartionContainer' dangerouslySetInnerHTML={{__html:NumberOfReportedChart.SubTitle}}/>
          </div>

          </div>
          <div className='labThirdContainerTableCont labContHeightTrans'
          style={{ height: this.state.TopTenHeight + "px" }}>
                <div className='labContTopBar'>
                <div
                role="button"
                onClick={this.ShowHideTopTen}
                style={{ display: "inline-block" }}
              >
                <p
                  className="infoIcon"
                  data-tip={DashboardRankedRadTestSection.Info}
                  data-for="TopTenI"
                />
                <ReactTooltip
                className='GrayToolTip'
                  id="TopTenI"
                  place="bottom"
                  effect="solid"
                  html={true}
                />
                <span
                  style={{color:'#0bcbf1'}} dangerouslySetInnerHTML={{ __html: this.state.TopTenArrow }}
                />{" "} {DashboardRankedRadTestSection.Title}
              </div>
                </div>
                <ul className="labTopTenList">
                <div className='TopTenListHead'>
                  <p className="labTopTenLITxt">
                    <strong>{DashboardRankedRadTestSection.RankedRadTestNameTitle}</strong>
                  </p>
                  <p className="labTopTenLINumber">
                  <strong> {DashboardRankedRadTestSection.RankedRadTestValueTitle}</strong>
                  </p>
                </div>
                {DashboardRankedRadTestSection.RankedRadTests.map((opt, index) => (
                  <li key={index} className='TopTenListItem'>
                    <p className="labTopTenLITxt">{opt.RadTestName}</p>
                    <p className="labTopTenLINumber">{opt.RankValue}</p>
                  </li>
                ))}
              </ul>
          </div>
        </div>
      <div className='labFourthContainer'>
                  <div className='labFourthContainerTableContainer labContHeightTrans'
                  style={{ height: this.state.RecAcHeight + "px" }}>
                  <div className="labContTopBar" role="button" onClick={this.ShowHideRecAc}>
              <p
                className="infoIcon"
                data-tip={DashboardActivities.Info}
                data-for="RecAcI"
              />
              <ReactTooltip
              className='GrayToolTip'
                id="RecAcI"
                place="bottom"
                effect="solid"
                html={true}
              />
              <span
                style={{color:'#0bcbf1'}} dangerouslySetInnerHTML={{ __html: this.state.RecAcArrow }}
              />{" "}
              {DashboardActivities.Title}
            </div>
            <ul className="labTopTenList">
                {DashboardActivities.Activities.map((opt, index) => (
                  <li>
                    <span className="labTopTenLITxt">{opt}</span>
                  </li>
                ))}
              </ul>
                  </div>
      <div className='labFourthContainerProgBars labContHeightTrans'
      style={{ height: this.state.FCProgHeight + "px" }}>
      <div className="labContTopBar" role="button" onClick={this.ShowHideFCProg}>
              <p
                className="infoIcon"
                data-tip={DashboardProgressbarFSection.Info}
                data-for="MPRI"
              />
              <ReactTooltip
              className='GrayToolTip'
                id="MPRI"
                place="bottom"
                effect="solid"
                html={true}
              />
              <span
                style={{color:'#0bcbf1'}} dangerouslySetInnerHTML={{ __html: this.state.FCProgArrow }}
              />{" "}
              {DashboardProgressbarFSection.Title}
            </div>
            <div className='labFouthContainerProgBarsC'>
            {DashboardProgressbarFSection.Progressbars.map((PB, index)=>(
              <div>
              <p className="labSecContPBsLabels">
                {PB.Name}
              </p>
              <ProgressBar
                now={PB.Percentage}
                className="labSecContPBs"
                striped
                bsStyle={Colors[index % 5]}
              />{" "}
              <span className="labProgbarsPerc">
                &#10100;
                {PB.Value}
                &#10101; {PB.Percentage}%
              </span>
              </div>
            ))}
              </div>
      </div>
      </div>
      </div>
    );
  }
}

const customStyles = {
  control: (base, state) => ({
    // none of react-selects styles are passed to <View />
    ...base,
    height: 25,
    minHeight: 25,
    position: "absolute",
    top: -17,
    width: 200
  }),
  menu: (base, state) => ({
    ...base,
    position: "absolute",
    top: 10,
    zIndex: 10000
  }),
  valueContainer: base => ({
    ...base,
    height: 25,
    marginTop: -5,
    overflow: "visible"
  }),
  dropdownIndicator: base => ({
    ...base,
    width: 32,
    color: "#000000",
    marginTop: -5,
  }),
  indicatorSeparator: base => ({
    ...base,
    display: "none"
  })
};

const mapStateToProps = state => ({
  UserToken: state.UserAuthenticationInfo.AuthenticationInfo.AuthenticationToken,
  BranchID: state.ChangeUserAssignedBranch.BranchID,
  UserAuthenticationInfo: state.UserAuthenticationInfo.AuthenticationInfo,
  RefreshPages: state.RefreshPages,
  UserAuth: state.UserAuthenticationInfo.AuthenticationInfo.Applications[state.UserAuthenticationInfo.AuthenticationInfo.SelectedApplication].Authorities,
});

const mapDispatchToProps = dispatch => ({
  saveUserAuthenticationInfo: (Parameter, Type) => dispatch(saveUserAuthenticationInfo(Parameter, Type)),
  onBranchChanged: (Branches, BranchID, BranchName, Type) => dispatch(changeSelectedUserBranch(Branches, BranchID, BranchName, Type)),
  showHideLoader: (isShow, Type) => dispatch(showHideLoader(isShow, Type)),
  refreshPage: (Parameter, Type) =>dispatch(refreshPage(Parameter, Type))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));