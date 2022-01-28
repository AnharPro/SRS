import React, { Component } from "react";
import "./ReportPageStyle.css";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import PropTypes from "prop-types";
//import { CalendarComponent } from '@syncfusion/ej2-react-calendars';

var isMounted = false;

class ReportsParameterList extends Component{
    constructor(props){
        super();
        this.state={
            parameterObj:{
            IsMandatory: false,
            IsSingleSelect: false,
            ParameterControlType: "",
            ParameterDataTypeName: "",
            ParameterID: 0,
            ParameterName: "",
            ReportParameterValues: null},
            DropDnOpts:[],
            DropDnVal:'',
            DropDnValArray:[],
            DropDnValArrayS:[],
            DatePickerVal: new Date(),
            txtVal:'',
            DateFrom: new Date(),
            DateTo: new Date(),
            startDate: new Date()
        };
        this.DropDnValChanged = this.DropDnValChanged.bind(this);
        this.DateChanged = this.DateChanged.bind(this);
        this.TextValChanged = this.TextValChanged.bind(this);
    }

    TextValChanged(evt){
        const val = evt.target.value;
        if(this.state.parameterObj.ParameterDataTypeName === 'Numeric'){
            if(!isNaN(val)){
                if(val.length > this.state.parameterObj.Length){}
                else{
                this.setState({
                    txtVal: evt.target.value
                }, ()=>{
                    this.props.ParameterChanged(this.props.ind, val);
                })}
            }
        }else{
            if(val.length > this.state.parameterObj.Length){}
            else{
            this.setState({
                txtVal: evt.target.value
            }, ()=>{
                this.props.ParameterChanged(this.props.ind, val);
            })}
        }
        
    }

    DateChanged(date){
        const d = moment(date).format('YYYY-MM-DD');
        this.setState({
            DatePickerVal: date
          }, ()=>{
            this.props.ParameterChanged(this.props.ind, d);
          });
    }

    DropDnValChanged(val){
        if(this.state.parameterObj.IsSingleSelect){
        var Val = null;
        var DropDnVal = null;
        if(val === '' || val === null || val === undefined){
            Val = '';
        }else{
            Val = val.value;
            DropDnVal = val.ind;
            if(this.props.ParamObj.ParameterDataTypeName === 'Boolean'){
                if(val.label === 'Male'){
                    Val = false
                }else if(val.label === 'Female'){
                    Val = true
                }
            }}
        this.setState({DropDnVal}, ()=>{
            this.props.ParameterChanged(this.props.ind, Val);
        });}
        else{
            var DropDnValArray = null;
            var values = '';
            var valuesarray = null;
            if(val === null){
                DropDnValArray = [];
                valuesarray = [];
            }
            else{
                valuesarray = val.map(opt => ({ value: opt.value}));
                DropDnValArray = val;
            for(var i=0; i<valuesarray.length; i++){
                if (values === ''){
                  values = values + valuesarray[i].value.toString()
                }
                else{
                  values = values + ',' + valuesarray[i].value.toString();
                }
                
              }}
              this.setState({DropDnValS: valuesarray, DropDnValArray}, ()=>{
                  this.props.ParameterChanged(this.props.ind, values);
              });
        }
    }

    componentWillUnmount(){
        isMounted = false;
    }

    componentDidMount(){
        isMounted = true;
        if(isMounted){
        if(this.props.ParamObj.ParameterControlType === 'DropDown'){
            const s = this.props.ParamObj;
            var opts = s.ReportParameterValues.map((opt, index) => ({ value: opt.ParameterValueID, label: opt.ParameterValueName, ind:index, isSelected: opt.isSelected}));
            if(opts[0].value === -1){
                this.setState({DropDnOpts: opts, parameterObj:this.props.ParamObj});
            }else{
                var SelVal = -1;
                for(var i=0; i<opts.length; i++){
                    if(opts[i].isSelected){
                        SelVal = i;
                    }
                }
                this.setState({DropDnOpts: opts, DropDnVal: SelVal, parameterObj:this.props.ParamObj});
            }
        }else{
            this.setState({parameterObj:this.props.ParamObj});
        }}
    }
    
    componentDidUpdate(){
        if(this.props.ParamObj.ParameterControlType === 'DatePicker'){
            var FromDateP = new Date(this.props.DateFrom).getDate() + '/' + new Date(this.props.DateFrom).getMonth() + '/' + new Date(this.props.DateFrom).getFullYear();
            var FromDateS = new Date(this.state.DateFrom).getDate() + '/' + new Date(this.state.DateFrom).getMonth() + '/' + new Date(this.state.DateFrom).getFullYear();
            var ToDateP = new Date(this.props.DateTo).getDate() + '/' + new Date(this.props.DateTo).getMonth() + '/' + new Date(this.props.DateTo).getFullYear();
            var ToDateS = new Date(this.state.DateTo).getDate() + '/' + new Date(this.state.DateTo).getMonth() + '/' + new Date(this.state.DateTo).getFullYear();
            if(FromDateP !== FromDateS || ToDateP !== ToDateS){
                this.setState({
                    DateFrom: this.props.DateFrom,
                    DateTo: this.props.DateTo
                })
            }
        }
    }

    render(){
        var Obj = this.state.parameterObj;
        Obj = this.props.ParamObj;
        const DF = new Date(this.state.DateFrom);
        const DT = new Date(this.state.DateTo);
        if(Obj.ParameterControlType === 'TextBox')
        {return(
            <div><p className='ReportsFormLabels'>{Obj.ParameterName} {Obj.IsMandatory ? <span className='mandatory'>*</span> : null}</p>
            <input type='text' className={Obj.ObjClass} onChange={this.TextValChanged} value={this.state.txtVal}/>
            </div>
        )}else if(Obj.ParameterControlType === 'DatePicker')
        {
            if(Obj.ParameterDisplayLabel === 'From Date'){
                return(
                    <div><p className='ReportsFormLabels'>{Obj.ParameterName} {Obj.IsMandatory ? <span className='mandatory'>*</span> : null}</p>
                    
        
                    <DatePicker
                    customInput={<CustomDatepicker />}
                selected={this.state.DatePickerVal}
                onChange={this.DateChanged}
                //onChangeRaw={this.startdatesetMan}
                dateFormat={moment(this.state.DatePickerVal).format("DD/MM/YYYY")}
                className='react-datepicker'
                calendarClassName="react-datepicker"
                popperClassName="react-datepicker__current-month"
                maxDate={DT}
                fixedHeight={true}
                 />
                    </div>
                )
            }else if(Obj.ParameterDisplayLabel === 'To Date'){
                return(
                    <div><p className='ReportsFormLabels'>{Obj.ParameterName} {Obj.IsMandatory ? <span className='mandatory'>*</span> : null}</p>
                    
        
                    <DatePicker
                    customInput={<CustomDatepicker />}
                selected={this.state.DatePickerVal}
                onChange={this.DateChanged}
                //onChangeRaw={this.startdatesetMan}
                dateFormat={moment(this.state.DatePickerVal).format("DD/MM/YYYY")}
                className='react-datepicker'
                calendarClassName="react-datepicker"
                popperClassName="react-datepicker__current-month"
                minDate={DF}
                maxDate={new Date()}
                fixedHeight={true}
                 />
                    </div>
                )
            }
            }else if(Obj.ParameterControlType === 'DropDown')
        {return(
            <div><p className='ReportsFormLabels'>{Obj.ParameterDisplayLabel} {Obj.IsMandatory ? <span className='mandatory'>*</span> : null}</p>
            {Obj.IsSingleSelect ?  
            <Select isClearable={!Obj.IsMandatory} options={this.state.DropDnOpts} value={this.state.DropDnOpts[this.state.DropDnVal]} placeholder={Obj.ParameterName + '...'} styles={customStyles} className='srchselect' nocaret data-live-search='true' onChange={this.DropDnValChanged}/> : 
         <Select isClearable={!Obj.IsMandatory} options={this.state.DropDnOpts} value={this.state.DropDnValArray} placeholder={Obj.ParameterName + '...'} styles={customStyles} className='srchselect' isMulti nocaret data-live-search='true' onChange={this.DropDnValChanged}/>}
            
            </div>
        )}else{
            return(
                <p></p>
            )
        }
    }
}

const customStyles = {
    control: (base, state) => ({
      // none of react-selects styles are passed to <View />
      ...base,
      minHeight: 25,
      backgroundColor: 'white'
    }),
    valueContainer: base => ({
      ...base,
      minHeight: 25
    }),
    dropdownIndicator: base => ({
      ...base,
      width: 28
    }),
    indicatorSeparator: base => ({
      ...base,
      display: "none"
    })
  };


  class CustomDatepicker extends React.Component {

    render () {
      return (
        <div
          className="reportscustomdatepicker"
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

export default ReportsParameterList;