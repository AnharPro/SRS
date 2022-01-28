import React, { Component } from "react";
import "./DropDownListStyle.css";

class DropdownList extends Component {
    constructor(props) {
      super(props);
      this.state = {
          isOpen:false
      };
      this.ShowHideDropDn = this.ShowHideDropDn.bind(this);
      this.closedropdn = this.closedropdn.bind(this);
      this.setWrapperRef = this.setWrapperRef.bind(this);
      this.handleClickOutside = this.handleClickOutside.bind(this);
      this.FilterChosen = this.FilterChosen.bind(this);
      this.Filter2Chosen = this.Filter2Chosen.bind(this);
    }

    Filter2Chosen(Ind){
        const event = {
            ID: this.props.Options2[Ind].ID,
            Label: this.props.Options2[Ind].Label
        }
        this.setState({
            isOpen:false
        }, ()=>{
            this.props.onChange1(event);
        })
    }

    FilterChosen(Ind){
        const event = {
            ID: this.props.Options1[Ind].ID,
            Label: this.props.Options1[Ind].Label
        }
        this.setState({
            isOpen:false
        }, ()=>{
            this.props.onChange(event);
        })
    }

    ShowHideDropDn(){
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    closedropdn(){
        this.setState({
            isOpen:false
        });
    }
  
    componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside);
    }
  
    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
      this.wrapperRef = node;
    }

    handleClickOutside(event) {
      if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
        this.closedropdn();
      }
    }
  
    render() {
      const {
          ComponentStyle='',
          HeaderStyle='',
          DropDnStyle='',
          ElementsStyle='',
          SelectedOption='',
          TagNameStyle='',
          Tag='',
          Options1=[],
          Options2=[]
      } = this.props || '';

      const CompStyle = 'ComponentStyle noselect ' + ComponentStyle;
      const DropDNCls = 'DropDownStyle ' + DropDnStyle;
      return (
        <div className={CompStyle} ref={this.setWrapperRef}>
            <div className={HeaderStyle} onClick={this.ShowHideDropDn}>
            <span className={TagNameStyle}>
                {Tag}
            </span>
            {SelectedOption}</div>
            {this.state.isOpen ? 
            <div className={DropDNCls}> 
                {Options1.map((opt, index) =>(
                    <div className={ElementsStyle} onClick={() => this.FilterChosen(index)}>
                    {this.props.SelectedOption === opt.Label ?  <Tiick /> : null}
                        {opt.Label}
                    </div>
                ))}

                {Options2.map((opt, index) =>(<div>
                    {index === 0 ? <div className='Separator'/> : null}
                    <div className={ElementsStyle} onClick={() => this.Filter2Chosen(index)}>
                    {this.props.SelectedOption2 === opt.Label ?  <Tiick /> : null}
                        {opt.Label}
                    </div> </div>
                ))}

                
            </div>: null}

            
          
        </div>
      );
    }
  }

  const Tiick = () => <div className="tick">&#10004;</div>;

  export default DropdownList;