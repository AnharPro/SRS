import React, { Component } from 'react';
import "./workListStyle.css";
import moment from 'moment';
import axios from "axios";
import * as urls from "../../constants/URL";
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from "react-responsive-modal";
import { ToastContainer, toast } from 'react-toastify';

class RequestedPage extends component{y
    constructor(props){
        super(props);
        this.state={};
    }
    render(){
        return(
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
        )
    }
}

const mapStateToProps = state => ({

  });
  
  const mapDispatchToProps = dispatch => ({

  });

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(RequestedPage);