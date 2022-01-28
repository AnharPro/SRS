import React, { Component } from 'react';
import "./workListStyle.css";
import moment from 'moment';
import axios from "axios";
import * as urls from "../../constants/URL";
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import Modal from "react-responsive-modal";
import { showHideLoader } from "../../actions";
import { ToastContainer, toast } from 'react-toastify';
import { debounce, throttle } from 'lodash';

class Attachments extends Component{
    constructor(props){
        super();
        this.state={
            UploadBtnDis: false,
            ImagesList: [],
            showLimitExccededAlert: false,
            LimitExccededAlert: 'You have excceeded the maximium number of files',
            files:[],
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
                Message: '',
                isDisabled: false
            },
            showAttachmentAlert: false,
            AttachmentAlert: '',
            update: false,
            OverallSize: 0,
            PreviewImages: false,
            SelectedImage:-1
        }
        this.handleDrop = this.handleDrop.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.updateFiles = this.updateFiles.bind(this);
        this.getRadiologyImages = this.getRadiologyImages.bind(this);
        this.uploadImages = debounce(this.uploadImages.bind(this), 2000);
        this.HideAttachmentAlert = this.HideAttachmentAlert.bind(this);
        this.showAttachmentAlert = this.showAttachmentAlert.bind(this);
        this.EditName = this.EditName.bind(this);
        this.onCloseViewImagesModal = this.onCloseViewImagesModal.bind(this);
        this.onPreviewClicked = this.onPreviewClicked.bind(this);
        this.onFileChosen = this.onFileChosen.bind(this);
        this.showToast = this.showToast.bind(this);
    }

    showToast(Msg){
      //alert(Msg);
      //ToastStore.success(Msg, 2000, "TechsToastCont");
      toast.success(Msg, {
          position: toast.POSITION.TOP_CENTER
        });
    }

    onFileChosen(evt){
      //const p = evt.target.files;
      this.handleDrop(evt.target.files)
    }

    onPreviewClicked(ind){
      let ImagesList = [...this.state.ImagesList];
      if(this.state.SelectedImage !== -1){
        ImagesList[this.state.SelectedImage].isSelected = false
      }
      ImagesList[ind].isSelected = true;
      this.setState({
        PreviewImages: true,
        ImagesList,
        SelectedImage: ind
      })
    }
    
    onCloseViewImagesModal(){
      let ImagesList = [...this.state.ImagesList];
      for(var i=0; i<ImagesList.length; i++){
        ImagesList[i].isSelected = false;
      }
      this.setState({
        PreviewImages: false,
        ImagesList
      })
    }

    EditName(ind, NewName){
      let ImagesList = [...this.state.ImagesList]
      ImagesList[ind].FileDisplayName = NewName;
      ImagesList[ind].FileName = NewName;
      this.setState({
        ImagesList
      })
    }

    HideAttachmentAlert(){
        this.setState({
            showAttachmentAlert: false
        })
    }

    showAttachmentAlert(){

    }

    uploadImages(){
      if(!this.state.UploadBtnDis){
      this.setState({
        UploadBtnDis: true
      }, ()=>{
        let ImagesList = [...this.state.ImagesList];
        let RadOrderServiceInfo = Object.assign({}, this.state.RadOrderServiceInfo);
        var Images1 = [];
        var NewImage = {
            XrayID: null,
            Name: '',
            Data: '',
            Order: null,
            Size: 0,
        };
        for(var i=0; i<ImagesList.length; i++){
            if(!ImagesList[i].isSaved){
                let NI = Object.assign({}, NewImage);
                NI.XrayID = RadOrderServiceInfo.XrayID;
                NI.Name = ImagesList[i].FileDisplayName;
                NI.Data = ImagesList[i].Base64S;
                NI.Order = parseInt(i, 10) + 1;
                NI.OriginalSize = ImagesList[i].FileSize;
                Images1.push(NI);
            }
        }
        const mom = '?a=' + moment();
        //const BranchID = this.props.BranchID;
        const XrayID = this.state.RadOrderServiceInfo.XrayID;
        var Imagess = {Images: Images1}
        const url = `${urls.URL}RadOrderDetailWebService.svc/AddRadiologyImage${mom}`;
        if(XrayID !== null){
          this.props.showHideLoader(true, 'SHOW_HIDE');
        axios({
            method: "post",
            url: url,
            data: JSON.stringify(Imagess),
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
                  UploadBtnDis: false
                },()=>{
                  alert(1)
                  this.getRadiologyImages();
                  this.showToast('Successfully uploaded');
                  this.props.showHideLoader(false, 'SHOW_HIDE');
                })
              }
            }
          })
          .catch(error => {});}
        })}
    }


    getRadiologyImages(){
        const mom = '?a=' + moment();
        //const BranchID = this.props.BranchID;
        const XrayID = this.state.RadOrderServiceInfo.XrayID;
        const url = `${urls.URL}RadOrderDetailWebService.svc/GetRadiologyImages/${XrayID}${mom}`;
        if(XrayID !== null){
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
                var ImagesList = responseJson.RadiologyImageList;
                var OverallSize = 0;
                var Images = [];
                var NewFile={
                    FileName: '',
                    FileDisplayName: '',
                    FileSize: 0,
                    Base64S: '',
                    isSaved: false,
                    ID: null,
                    isSelected: false,
                    isEdited: false
                  };
                  for(var i = 0; i<ImagesList.length; i++){
                      let NF = Object.assign({}, NewFile);
                      NF.FileName = ImagesList[i].Name;
                      NF.FileDisplayName = ImagesList[i].Name;
                      NF.Base64S = ImagesList[i].Data;
                      NF.Order = ImagesList[i].Order;
                      NF.FileSize = ImagesList[i].Size;
                      NF.isSaved = true;
                      NF.ID = ImagesList[i].ID;
                      OverallSize = OverallSize + parseInt(ImagesList[i].Size, 10)
                      Images.push(NF)
                  }
                  this.setState({
                    ImagesList:[]
                  },()=>{
                    this.setState({
                      ImagesList: Images,
                      OverallSize
                  }, ()=>{
                    this.props.AttachmentsLoaded();
                  })
                  })
                
              }
            }
          })
          .catch(error => {});}
    }

    updateFiles(fileList, OverallSize){
        var showLimitExccededAlert = false;
          if(fileList.length > 5){
            showLimitExccededAlert = true;
          }
          
      this.setState({ImagesList: fileList,
        showLimitExccededAlert,
        OverallSize
      })
      }
    
      removeFile(ind){
        let ImagesList = [...this.state.ImagesList];
        var OverallSize = this.state.OverallSize;
        const st = parseInt(ind,10);
        const FS = ImagesList[st].FileSize;
        //ImagesList.splice(st, 1);
        if(ImagesList[st].isSaved){
        const ID = ImagesList[st].ID;
        const mom = '?a=' + moment();
        //const BranchID = this.props.BranchID;
        //const XrayID = this.state.RadOrderServiceInfo.XrayID;
        var Data = {imageID: ID}
        const url = `${urls.URL}RadOrderDetailWebService.svc/RemoveRadiologyImage${mom}`;
        this.props.showHideLoader(true, 'SHOW_HIDE');
        axios({
            method: "post",
            url: url,
            data: JSON.stringify(Data),
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
                OverallSize = parseInt(OverallSize, 10) - parseInt(FS, 10);
                this.setState({
                  OverallSize
                },()=>{
                  this.getRadiologyImages();
                })
              }
            }
          })
          .catch(error => {});}
          else{
            OverallSize = parseInt(OverallSize, 10) - parseInt(FS, 10);
            ImagesList.splice(st, 1);
            var IML = ImagesList;
            this.setState({
              ImagesList: []
            },()=>{
              this.setState({
                ImagesList,
                OverallSize
            })
            })
          }
      }
    
      handleDrop = (files) => {
        if(!this.state.isDisabled){
        let ImagesList = [...this.state.ImagesList];
        var OverallSize = this.state.OverallSize;
        const NewSize = this.state.OverallSize + Math.round(files[0].size/1024);
        var type = files[0].type;
        type = type.split('/');
        if(type[0] !== 'image'){
          this.setState({
            AttachmentAlert: 'You can only upload images',
            showAttachmentAlert: true
        })  
        }else if(files.length > 1){
            this.setState({
                AttachmentAlert: 'You cannot upload more than one file at a time',
                showAttachmentAlert: true
            })  
        }else if(ImagesList.length === 5){
          this.setState({
              AttachmentAlert: 'You have already reached the maximum number of files to upload',
              showAttachmentAlert: true
          })
        }else if(NewSize > this.state.RadOrderServiceInfo.MaxAttachedImagesSize){
          this.setState({
            AttachmentAlert: 'You cannot upload this file you have exceeded the maximum upload size',
            showAttachmentAlert: true
        })
        }else{
          var NewFile={
          FileName: '',
          FileDisplayName: '',
          FileSize: 0,
          Base64S: '',
          isSaved: false,
          ID: null,
          isSelected:false,
          isEdited: false
        }
        if (files[0].name){
          
        var fileToLoad = files[0];
        new Promise(function(resolve, reject) {
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
          let f = Object.assign({}, NewFile);
          f.FileName = files[0].name;
          f.FileDisplayName = files[0].name;
          f.FileSize = Math.round(files[0].size/1024);
          OverallSize = OverallSize + parseInt(f.FileSize, 10);
          //alert(f.FileSize)
          var srcData = fileLoadedEvent.target.result;
          const p = srcData.split(',');
           // <--- data: base64
           f.Base64S = p[1];
          ImagesList.push(f);
          resolve(fileLoadedEvent.target.result);
        }
        fileReader.readAsDataURL(fileToLoad);
      })
      .then(processFileContent =>{
        this.updateFiles(ImagesList, OverallSize)
      })
      .catch(function(err) {
        console.log(err)
      });
    }
    }
  }
        
      }

      componentDidMount(){
        var Dis = false;
        if(this.props.isExaminedP){
          if(this.props.isExaminedBef || this.props.isReportedDis){
            Dis = true
          }
        }else if(this.props.isReportedP){
          if(this.props.isReportedBef || this.props.isApprovedDis){
            Dis = true;
          }
        }else if(this.props.isApprovedP){
          Dis = true;
        }
          this.setState({
              isDisabled: Dis,
              update: !this.state.update
          })          
      }

      componentDidUpdate(){
          if (this.state.RadOrderServiceInfo !== this.props.RadOrderServiceInfo){
            this.setState({
                RadOrderServiceInfo: this.props.RadOrderServiceInfo
              }, ()=>{
                  this.getRadiologyImages();
              })
          }
      }

      componentWillUnmount(){
          this.setState({
            RadOrderServiceInfo:{}
          })
      }

    render(){
            const {
                showLimitExccededAlert,
                AttachmentAlert,
                showAttachmentAlert,
                OverallSize,
                RadOrderServiceInfo,
                PreviewImages,
                ImagesList,
                SelectedImage,
                isDisabled,
                UploadBtnDis,
              } = this.state;

              const isApprovedP = this.props.isApprovedP;

              var imgSrc = '';
              if(SelectedImage !== -1  && PreviewImages){
              imgSrc = `data:image/gif;base64,${ImagesList[SelectedImage].Base64S}`}
              var canUpload = false;
              if(ImagesList.length > 0){
                var Num = 0;
                for(var i=0; i<ImagesList.length; i++){
                  if(!ImagesList[i].isSaved){
                    Num = Num + 1;
                  }
                }
                if(Num > 0){
                canUpload = true;}
              }
              return (
                <div className="DDComp">
                <ToastContainer
                  autoClose={5000}
                  hideProgressBar
                  pauseOnVisibilityChange={false}
                  closeButton={false}
                  className='TechsToastCls'
                  toastClassName='TechsToastCont'
                  progressClassName='TechsToastProgCont'
                />
                  <Modal
                  open={PreviewImages}
                  onClose={this.onCloseViewImagesModal}
                  classNames={{
                    overlay: "",
                    modal: "AttachmentModal",
                    closeIcon: "ViewDetailsClosebtn"
                  }}
                >
                <div className='PreviewImageModal'>
                  <div className='PreviewImageImagesListCont'>
                    {this.state.ImagesList.map((file, index) =>
                      <ImageWThumb 
                        key={index}
                        ind={index}
                        file={file}
                        SelectedImage={SelectedImage}
                        onPreviewClicked={this.onPreviewClicked}
                       />
  
                    )}
                  </div>
                  <div className='PreviewImageImageContainer'>
                    <img alt="" src={imgSrc} />
                  </div>
                </div>
                </Modal>
                <div className='AttachmentsHeader'>
                <div className='AttachmentTitle'>Upload Files 
                
                </div>
                <div className='SizeContainer'>
                  <div className='MaxSize'>
                    Maximum Allowed Size: {RadOrderServiceInfo.MaxAttachedImagesSize} Kb
                  </div>
                  <div className='MaxSize'>
                    Uploaded Size: {OverallSize} Kb
                  </div>
                </div>
                </div>
                {/*<FileBase64 multiple={ true }
                  onDone={ this.getFiles.bind(this) }>*/}
                  <SweetAlert
                    show={showAttachmentAlert}
                    custom
                    title=''
                    confirmBtnText="Ok"
                    confirmBtnCssClass="ConfirmAlertBtn"
                    customClass="DeleteAlertClass"
                    cancelBtnCssClass="CancelAlertBtn"
	                customIcon=""
                    onConfirm={this.HideAttachmentAlert}
                >
	                {AttachmentAlert}
                </SweetAlert>
                  <DragAndDrop 
                    handleDrop={this.handleDrop} 
                    showLimitExccededAlert={showLimitExccededAlert}>
                  <div className='DropBoxContainer'>
                    {this.state.ImagesList.map((file, index) =>
                      <FileLine 
                        key={index}
                        ind={index}
                        file={file}
                        removeFile={this.removeFile}
                        EditName={this.EditName}
                        onPreviewClicked={this.onPreviewClicked}
                        isDisabled={isDisabled}
                        UserToken={this.props.UserToken}
                        />
                      
                    )}
                  </div>
                </DragAndDrop>
                {/*</FileBase64>*/}
                <div className='AttachmentBtnsCont'>
                {(!isApprovedP && !this.state.isDisabled) ? 
                <div>
                <input type="file" name="file" id="file" className="inputfile" onChange={this.onFileChosen}/>
                <label for="file">Choose a file</label></div> : null}
                {(!isDisabled) ? <input type='button' value='Upload' disabled={!canUpload || UploadBtnDis} className='RTEBtns UpdateBtn UploadBtn' onClick={this.uploadImages}/> : null}
                </div>
                </div>
        )
    }
}

class ImageWThumb extends Component{
  constructor(props){
    super();
    this.state={
      isSelected: false
    }
    this.onImageClicked = this.onImageClicked.bind(this);
  }

  onImageClicked(){
    if(this.props.ind !== this.props.SelectedImage){
      this.props.onPreviewClicked(this.props.ind)
    }
  }

  componentDidMount(){
    if(this.props.file.isSelected){
      this.setState({
        isSelected: true
      })
    }
  }

  componentDidUpdate(){
    if(this.props.file.isSelected !== this.state.isSelected){
      this.setState({
        isSelected: this.props.file.isSelected
      })
    }
  }

  render(){
    const F = this.props.file;
    const ThumbN = `data:image/gif;base64,${F.Base64S}`;
    var Cls = 'ThumbnailImg';
    if (F.isSelected){
      Cls = 'ThumbnailImgL'
    }
    return(
      <div role='button' onClick={this.onImageClicked}>
        <img src={ThumbN} className={Cls}/> {F.FileDisplayName}
      </div>
    )
  }
}


class FileLine extends Component{
    constructor(props){
      super();
      this.state={
        isEditingName: false,
        DisplayNameValue: ['' ,''],
        showDeleteConfirmation: false,
      };
      this.removeFile = this.removeFile.bind(this);
      this.onEditFileNameClicked = this.onEditFileNameClicked.bind(this);
      this.onNameChanged = this.onNameChanged.bind(this);
      this.doneEditingClicked = this.doneEditingClicked.bind(this);
      this.onPreviewClicked = this.onPreviewClicked.bind(this);
      this.hideDeleteConfirmationAlert = this.hideDeleteConfirmationAlert.bind(this);
      this.showRemoveFileAlert = this.showRemoveFileAlert.bind(this);
      this.DeleteConfirmedClicked = this.DeleteConfirmedClicked.bind(this);
    }

    showRemoveFileAlert(){
      this.setState({
        showDeleteConfirmation: true
      })
    }

    DeleteConfirmedClicked(){
      this.setState({
        showDeleteConfirmation: false
      },()=>{
        this.removeFile();
      })
    }

    hideDeleteConfirmationAlert(){
      this.setState({
        showDeleteConfirmation: false
      })
    }

    onPreviewClicked(){
      this.props.onPreviewClicked(this.props.ind)
    }

    doneEditingClicked(){
      let DisplayNameValue = [...this.state.DisplayNameValue];
      const mom = '?a=' + moment();
      const totalName = DisplayNameValue[0] + '.' + DisplayNameValue[1];
      const Dat = {
        imageID: this.props.file.ID,
        imageName:totalName
      }
      if(this.props.file.isSaved){
      const url = `${urls.URL}RadOrderDetailWebService.svc/UpdateRadiologyImage${mom}`;
      this.props.showHideLoader(true, 'SHOW_HIDE');
      axios({
          method: "post",
          url: url,
          data: JSON.stringify(Dat),
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
              this.setState({
                isEditingName: false
              },()=>{
                this.props.EditName(this.props.ind, totalName);
                this.props.showHideLoader(false, 'SHOW_HIDE');
              })
            }
          }
        })
        .catch(error => {});}
        else{
          this.setState({
            isEditingName: false
          },()=>{
            this.props.EditName(this.props.ind, totalName);
            this.props.showHideLoader(false, 'SHOW_HIDE');
          })
        }
      
    }

    onNameChanged(event){
      var DisplayNameValue = [...this.state.DisplayNameValue]
      const NewName = event.target.value;
      DisplayNameValue[0] = NewName;
      this.setState({
        DisplayNameValue
      })
    }

    onEditFileNameClicked(){
      this.setState({
        isEditingName: true
      })
    }
  
    removeFile(){
      const ind = this.props.ind;
      this.props.removeFile(ind)
    }

    componentDidMount(){
      var FN = this.props.file.FileDisplayName;
      FN = FN.split('.');
      this.setState({
        DisplayNameValue: FN
      })
    }
  
    render(){
      const F = this.props.file;
      const {
        isEditingName,
        DisplayNameValue,
        showDeleteConfirmation
      } = this.state;

      const DN = `${DisplayNameValue[0]}.${DisplayNameValue[1]} (${F.FileSize} Kb)`;
      const EdtDN = DisplayNameValue[0]
      return(
        <div className='FileLineContainer'>
        <SweetAlert
                show={showDeleteConfirmation}
                custom
                title=''
                showCancel
                cancelBtnText="No"
                confirmBtnText="Yes"
                confirmBtnCssClass="ConfirmAlertBtn"
                customClass="DeleteAlertClass"
                cancelBtnCssClass="CancelAlertBtn"
	              customIcon=""
                onCancel={this.hideDeleteConfirmationAlert}
                onConfirm={this.DeleteConfirmedClicked}
            >
	                Are you sure you want to delete this file?
                </SweetAlert>
        <div className='FileLineLeftEl'>{isEditingName ? 
        <div className='InputCont'>
        <input type='text' className='fileNameInput' value={EdtDN} onChange={this.onNameChanged}/>
        <div role='button' onClick={this.doneEditingClicked} className='DoneBtn'>Done</div>
        </div>:<input type='text' className='fileNameInput' disabled value={DN}/>}</div>
        <div className='FileLineRightEl' role='button' onClick={this.onPreviewClicked}><span className='EditImage'/></div>
        {(!this.props.isDisabled) ? <div className='FileLineRightEl' role='button' onClick={this.onEditFileNameClicked}>Edit</div> : null}
        {!this.props.isDisabled ? <div className='FileLineRightEl DelFile' role='button' onClick={this.showRemoveFileAlert}>x</div> : null}
        </div>
      )
    }
  }


  class DragAndDrop extends Component{
    constructor(props){
      super();
      this.state={
        dragging: false,
        showLimitExccededAlert: false
      };
      this.handleDrag = this.handleDrag.bind(this);
      this.handleDragOut = this.handleDragOut.bind(this);
      this.handleDragIn = this.handleDragIn.bind(this);
      this.handleDrop = this.handleDrop.bind(this);
    }
    dropRef = React.createRef();
  
    handleDrag(e){
      e.preventDefault()
      e.stopPropagation()
    }
  
    handleDragOut(e){
      e.preventDefault()
      e.stopPropagation()
      this.dragCounter--
    if (this.dragCounter > 0) return
    this.setState({dragging: false})
    }
  
    handleDragIn(e){
      e.preventDefault()
      e.stopPropagation()
      this.dragCounter++  
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({dragging: true})
    }
    }
  
    handleDrop(e){
      e.preventDefault()
      e.stopPropagation()
      this.setState({dragging: false})
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.props.handleDrop(e.dataTransfer.files)
        e.dataTransfer.clearData()
        this.dragCounter = 0
      }
    }
    
    componentDidMount(){
      this.dragCounter = 0
      let div = this.dropRef.current
      div.addEventListener('dragenter', this.handleDragIn)
      div.addEventListener('dragleave', this.handleDragOut)
      div.addEventListener('dragover', this.handleDrag)
      div.addEventListener('drop', this.handleDrop)
    }
  
    componentWillUnmount() {
      let div = this.dropRef.current
      div.removeEventListener('dragenter', this.handleDragIn)
      div.removeEventListener('dragleave', this.handleDragOut)
      div.removeEventListener('dragover', this.handleDrag)
      div.removeEventListener('drop', this.handleDrop)
    }
  
    componentDidUpdate(){
      if(this.props.showLimitExccededAlert !== this.state.showLimitExccededAlert){
        this.setState({
          showLimitExccededAlert: this.props.showLimitExccededAlert
        })
      }
    }
  
  
    render(){
      return(
        <div
          style={{position: 'relative'}}
          className='DropBox'
          ref={this.dropRef}
        >
        {this.state.showLimitExccededAlert ? <div 
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0, 
                right: 0,
                zIndex: 9999
              }}
            >
                <div className='AlertMsg'>You have exceeded the maximium number of files</div>
            </div> : null}
          {this.state.dragging &&
            <div 
              style={{
                border: 'dashed grey 4px',
                backgroundColor: 'rgba(255,255,255,.8)',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0, 
                right: 0,
                zIndex: 9999
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  left: 0,
                  textAlign: 'center',
                  color: 'grey',
                  fontSize: 36
                }}
              >
                <div>drop here :)</div>
              </div>
            </div>
          }
          {this.props.children}
        </div>
      )
    }
  }


  const mapDispatchToProps = (dispatch) => ({
    showHideLoader: (isShow, Type) => dispatch(showHideLoader(isShow, Type)),
  })

const mapStateToProps = state => ({
    UserToken: state.UserAuthenticationInfo.AuthenticationInfo.AuthenticationToken
  })

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Attachments)