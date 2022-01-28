import React, { Component } from "react";
import { connect } from "react-redux";
import { changeOrdersSearch, changeRequestParameter, setPatientID } from '../../actions';
import "./workListStyle.css";
import ReactTooltip from "react-tooltip";
import SweetAlert from 'react-bootstrap-sweetalert';

class WorkListGrid extends Component {
  constructor(props) {
    super();
    this.state = {
      showHeldMsg: false,
      heldMessage: ''
    };
    this.viewDetails = this.viewDetails.bind(this);
    this.showQuickView = this.showQuickView.bind(this);
    this.onCheckboxClicked = this.onCheckboxClicked.bind(this);
    this.onTestClicked = this.onTestClicked.bind(this);
    this.chkBox = this.chkBox.bind(this);
    this.IDClicked = this.IDClicked.bind(this);
    this.hideHeldMsg = this.hideHeldMsg.bind(this);
  }

  hideHeldMsg(){
    this.setState({
      showHeldMsg: false
    })
  }

  IDClicked(){
    const Parameter = this.props.RadOrder.MoiID;
    this.props.onChangeReqParam(Parameter, 'CHANGE_PATIENTID');
    this.props.setPatientID(Parameter, 'SET_PATIENTID');
  }

  chkBox(){}

  onTestClicked(OrderIndex, GroupsIndex, TestIndex){
    const Parameter={
      OrderIndex: OrderIndex,
      GroupsIndex: GroupsIndex,
      TestIndex: TestIndex
    }
    this.props.changeOrders(Parameter, 'CHANGE_TEST_SELECTED');
  }

  onCheckboxClicked(){
      const OrderIndex = this.props.ind;
      const Parameter={
        OrderIndex: OrderIndex,
        Checked: this.state.CheckboxChecked
      }
      this.props.changeOrders(Parameter, 'CHANGE_ORDER');
  }

  viewDetails() {
    const OrderIndex = this.props.ind
    const OrderID = this.props.RadOrder.OrderID;
    const TestID = this.props.RadOrder.TestID;
    const XrayID = this.props.RadOrder.XrayID;
    var Msg = '';
    if(this.props.RadOrder.Held || this.props.RadOrder.Modality === null || this.props.RadOrder.Modality === ''){
      if(this.props.RadOrder.Held){
        Msg = 'This Test is on Hold. You cannot view details!';
      }else{
        Msg = 'This Test has no defined modality. Please refer to your technician!';
      }
      this.setState({
        showHeldMsg: true,
        heldMessage: Msg
      })
    }else{
      this.props.viewDetails(OrderID, OrderIndex, TestID, XrayID);
    }
  }

  showQuickView() {}

  componentDidMount(){
  }

  componentDidUpdate(){
  }

  render() {
      var RowClass='WorkListGridRow';
      var HeldStrip='';
      var StatusClass='StatClass ';
      const {
        ChronicDiseases= null,
        DoctorName= "",
        Gender= "",
        IsPregnant= false,
        Modality= "",
        MoiID= "",
        OrderDate= "",
        OrderID= 0,
        PatientID= 0,
        PatientName= "",
        PregnancyInfo= "",
        RadTestStatus= 0,
        RadTestStatusColor= "",
        RadTestStatusText= "",
        TestCode= "",
        TestID= 118,
        TestName= "",
        Held = false,
        XrayID = null
      } = this.props.RadOrder || {};
      var OrderToolTip = RadTestStatusText;
      if(Comment !== '' && Comment !== null){
        OrderToolTip = OrderToolTip + ': ' + Comment;
      }

      const OrderInd = this.props.ind;

      var isChronic = false;

      if(ChronicDiseases !== null){
        isChronic = true;
      }

      if(Held){
        RowClass = RowClass + '';
        HeldStrip='HeldRow';
      }

      if(RadTestStatus === 1){
        StatusClass = StatusClass + 'RequestedSt';
      }else if(RadTestStatus === 4){
        StatusClass = StatusClass + 'ReportedSt';
      }else if(RadTestStatus === 3){
        StatusClass = StatusClass + 'PreliminaryResultedSt';
      }else if(RadTestStatus === 2){
        StatusClass = StatusClass + 'PendingSt';
      }
      const RadTestsStatusColor = RadTestStatusColor;
      const isCanceled = this.props.isCanceled;
      const {showHeldMsg, heldMessage} = this.state;
    return (
      <div className={RowClass}>
      <div className={HeldStrip}/>
      <SweetAlert
              show={showHeldMsg}
	            custom
              title=''
	            confirmBtnText="OK"
              confirmBtnCssClass="ConfirmAlertBtn"
              customClass="DeleteAlertClass"
	            customIcon=""
              onConfirm={this.hideHeldMsg}
            >
            {heldMessage}
        </SweetAlert>
      <ReactTooltip
              id="NorUr"
              place="right"
              effect="solid"
              html={true}
            />
        <div className="WLcol1 WLrow1cont">
          <p
            className="WLgridrow1 WLuserid"
            role="button"
            onClick={this.IDClicked}
            style={{ cursor: "pointer" }}
          >
            {MoiID}
          </p>
          <p className="WLgridrow1">
            <strong>{PatientName}</strong>
          </p>
          <div className="WLgridrow1">
            {IsPregnant ? (
              <p
                className="WLIsPreg"
                data-tip={PregnancyInfo}
                data-for="pregimg"
              />
            ) : null}
            <ReactTooltip
              id="pregimg"
              place="bottom"
              effect="solid"
              html={true}
            />{" "}
            {isChronic ? (
              <p
                className="WLIsChronic"
                data-tip={ChronicDiseases}
                data-for="chronicimg"
              />
            ) : null}
            <ReactTooltip
              id="chronicimg"
              place="bottom"
              effect="solid"
              html={true}
            />
          </div>
        </div>
        <div className="WLlinkks WLcol2">
          <p className="WLgridrow2" role="button" onClick={this.viewDetails}>
            View Details <br /> #ACC-<strong>{XrayID}</strong>
          </p>
        </div>
        <div className="WLstatuss WLcol3">
          <div className="WLgridrow3">
            <p className={StatusClass} style={{backgroundColor: RadTestsStatusColor}}>{RadTestStatusText}</p>
          </div>
        </div>
        <div className="WLcol4 WLlinkks">
        {/*{LabInvoiceGroupWithTests.map((TestGroup, index)=>(
          <TestGroupsGrid 
          Group={TestGroup}
          onTestClicked={this.onTestClicked}
          key={index}
          GroupInd={index}
          OrderInd={OrderInd}
          isCanceled={isCanceled}/>
        ))}*/}
        <p className="WLgridrow5">
            {TestCode} <br /> {TestName}
          </p>
        
        </div>
        <div className="WLalignright fr WLcol5">
          <p className="WLgridrow4">Dr. Name: {DoctorName}</p>
          <p className="WLgridrow4-2">Order On: {OrderDate}</p>
          <div className="WLgridrow4">Modality: {Modality}</div>
        </div>
      </div>
    );
  }
}

class TestGroupsGrid extends Component{
  constructor(props){
    super();
    this.state={
    };
    this.onTestClicked = this.onTestClicked.bind(this);
  }

  onTestClicked(event){
    const TestIndex = parseInt(event.target.dataset.key, 10);
    const GroupsIndex = this.props.GroupInd;
    const OrderIndex = this.props.OrderInd;
    this.props.onTestClicked(OrderIndex, GroupsIndex, TestIndex);
  }

  componentDidUpdate(){
  }

  render(){
    const TestGroup = this.props.Group;
    const isCanceled = this.props.isCanceled;
    return(
          <div className='ChkBoxesCont'>
            {!isCanceled ? TestGroup.Tests.map((Test, index)=>(
              <div className='TestsGridChkBoxes' key={index}>
              {Test.AllowMoveStatus ?
              <input    type="checkbox" 
                        className='TestGridChkBoxes'
                        data-key={index}
                        checked={Test.Selected} 
                        onChange={this.onTestClicked}/> : 
                        <input type="checkbox" 
                        className='TestGridChkBoxes'
                        data-key={index}
                        defaultChecked={false} 
                        disabled={true}/>}
                     
                           {' '} <p className='ChkBoxShortName'>{Test.ShortName}</p>
                </div>
            )) : TestGroup.Tests.map((Test, index)=>(
              <div className='TestsGridChkBoxes' key={index}>
                           {' '} <p className='ChkBoxShortName'>{Test.ShortName}</p>
                </div>
            ))}
          </div>
    )
  }
}

const mapStateToProps = state => ({
  //Orders: state.ChangeOrders.Orders,
  //ChangeSelection: state.ChangeOrders.ChangeSelection
})

const mapDispatchToProps = (dispatch) => ({
  changeOrders: (Parameter, Type) => dispatch(changeOrdersSearch(Parameter, Type)),
  onChangeReqParam: (Parameter, Type) => dispatch(changeRequestParameter(Parameter, Type)),
  setPatientID: (Parameter, Type) => dispatch(setPatientID(Parameter, Type))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(WorkListGrid);