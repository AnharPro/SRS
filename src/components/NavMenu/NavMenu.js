import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink as RRNavLink, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { refreshPage } from "../../actions";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  /*NavItem,*/
  NavLink
} from "reactstrap";
import './NavMenu.css';

class NavMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
        off:0,
        NavigationOpen: false,
        UserAuthority: 0,
        IsITUser: false,
        showTech: false,
        wwidth: 0,
        NewToken: -1,
        HideAll: true
    };
    this.toggleNavigation = this.toggleNavigation.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
    this.handleScreenwidth = this.handleScreenwidth.bind(this);
    this.refreshDashboard = this.refreshDashboard.bind(this);
    this.refreshWorklist = this.refreshWorklist.bind(this);
    this.refreshTechnicians = this.refreshTechnicians.bind(this);
    this.refreshReports = this.refreshReports.bind(this);
  }

  refreshReports(evt){
    if(evt.target.href === window.location.href){
    var Parameter = 0;
    Parameter = parseInt(this.props.RefreshPages.Reports, 10) + 1;
    this.props.refreshPage(Parameter, 'REFRESH_REPORTS')
  }
  }

  refreshTechnicians(evt){
    if(evt.target.href === window.location.href){
    var Parameter = 0;
    Parameter = parseInt(this.props.RefreshPages.Technicians, 10) + 1;
    this.props.refreshPage(Parameter, 'REFRESH_TECHNICIANS')
  }
  }

  refreshWorklist(evt){
    if(evt.target.href === window.location.href){
    var Parameter = 0;
    Parameter = parseInt(this.props.RefreshPages.Worklist, 10) + 1;
    this.props.refreshPage(Parameter, 'REFRESH_WORKLIST')
  }
  }

  refreshDashboard(evt){
    if(evt.target.href === window.location.href){
    var Parameter = 0;
    Parameter = parseInt(this.props.RefreshPages.Dashboard, 10) + 1;
    this.props.refreshPage(Parameter, 'REFRESH_DASHBOARD')
  }
  }

  handleScreenwidth(){
    if(window.innerWidth < 600 && parseInt(this.state.wwidth >= 600)){
      this.setState({
        wwidth: window.innerWidth
      })
    }else if(window.innerWidth > 600 && parseInt(this.state.wwidth <= 600)){
      this.setState({
        wwidth: window.innerWidth
      })
    }
  }

  refreshPage(evt){
    if(evt.target.href === window.location.href){
      //window.location.reload()
      //this.props.history.push(evt.target.href)
      //window.location.href = window.location.href;
  }
  }

  handleScroll(){
    const off = window.pageYOffset;
    try {
    } catch (error) {
      
    }
    this.setState({off})
  }

  toggleNavigation() {
    this.setState({
      NavigationOpen: !this.state.NavigationOpen
    });
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidMount(){
    const ss = sessionStorage.getItem('Tab')
    //alert(ss)
    if(sessionStorage.getItem('state') !== null){
      const s = sessionStorage.getItem('state');
      //alert(s)
    }else{
      //alert('nn')
    }
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleScreenwidth);
    if(this.state.UserAuthority !== this.props.UserAuthority || this.state.IsITUser !== this.props.IsITUser){
      var showTech = false;
      if(this.props.IsITUser){
        showTech = true;
      }else if(parseInt(this.props.UserAuthority, 10) === 2){
        showTech = true
      }
    }
    this.setState({
      UserAuthority: this.props.UserAuthority,
      IsITUser: this.props.IsITUser,
      showTech
    })
  }

  componentDidUpdate(){

    if(this.state.NewToken !== this.props.UserAuthenticationInfo.AuthenticationToken){
      if(this.props.UserAuthenticationInfo.AuthenticationToken === null || this.props.UserAuthenticationInfo.AuthenticationToken === ''){
        this.setState({
          NewToken: this.props.UserAuthenticationInfo.AuthenticationToken,
          HideAll: true
        })
      }else(
        this.setState({
          NewToken: this.props.UserAuthenticationInfo.AuthenticationToken,
          HideAll: false
        })
      )
    }
    





    if(this.state.UserAuthority !== this.props.UserAuthority || this.state.IsITUser !== this.props.IsITUser){
      var showTech = false;
      if(this.props.IsITUser){
        showTech = true;
      }else if(parseInt(this.props.UserAuthority, 10) === 2){
        showTech = true
      }
      this.setState({
        UserAuthority: this.props.UserAuthority,
        IsITUser: this.props.IsITUser,
        showTech
      })
    }
  }

  render() {
    const UserAuthorityN = parseInt(this.state.UserAuthority, 10);
    var UserAuthority = false;
    if(UserAuthorityN === 1){
      UserAuthority = true;
    }
    var off = this.state.off;
      var NavbarClass = 'labNavBar';
      var NavbarTogglerClass = 'labNavbarLinks';
      var NavClass = 'labNav';
      var NavLinkClassL = 'labNavbarLinks';
      var NavLinkClassLL = 'labNavbarLinksL';
      if(this.state.NavigationOpen){
        if(window.innerWidth  < 600){
        NavLinkClassL = 'labNavbarLinksO';
        NavLinkClassLL = 'labNavbarLinksLO';}
        if (off >= 50){
          NavbarTogglerClass = 'labNavbarTogglerOpenS';
        }else{
          NavbarTogglerClass = 'labNavbarTogglerOpen';
        }
        NavLinkClassL = 'labNavbarLinksL';
      }
      else{
        if (off >= 50){
          NavbarTogglerClass = 'labNavbarTogglerS';
        }else{
          NavbarTogglerClass = 'labNavbarToggler';
        }
        NavLinkClassL = 'labNavbarLinks';
      }

    var g = 0;
    if (off >= 50){
      g = off-50;
      NavbarClass = 'labSticky';
      if(this.state.NavigationOpen){
        NavClass='labNavSO';}else{
        NavClass='labNavS';
      }
    }else{
      NavbarClass = 'labNavBar';
      NavClass='labNav';
    }

    if(window.innerWidth < 600){
      if(off >= 50){
        NavbarClass = 'labSticky1';
      }
    }
    const showTech = this.state.showTech;
    const HideAll = this.state.HideAll;

    return (
      <Navbar expand="md" className={NavbarClass}  style={{top: g}}>
        <NavbarToggler onClick={this.toggleNavigation} className={NavbarTogglerClass}/>
        <Collapse isOpen={this.state.NavigationOpen} navbar>
          <Nav className={NavClass} navbar>
            {!this.state.HideAll ? <NavLink
              to='/dashboard'
              tag={RRNavLink}
              className={NavLinkClassL + " inactive"}
              activeClassName={NavLinkClassL + " active"}
              exact={true}
              onClick={this.refreshDashboard}
            >
              <FontAwesomeIcon icon="tachometer-alt" size="sm" /> Dashboard
            </NavLink> : null}
            {!this.state.HideAll ? <NavLink
              to='/worklist'
              tag={RRNavLink}
              className={NavLinkClassL + " inactive"}
              activeClassName={NavLinkClassL + " active"}
              exact={true}
              onClick={this.refreshWorklist}
            >
              <FontAwesomeIcon 
                  icon="ticket-alt"
                  size="sm"
                  transform={{ rotate: -45 }} /> Worklist
            </NavLink> : null}
            {(showTech && !this.state.HideAll) ? <NavLink
              to='/technicianspage'
              tag={RRNavLink}
              className={NavLinkClassL + " inactive"}
              activeClassName={NavLinkClassL + " active"}
              exact={true}
              onClick={this.refreshTechnicians}
            >
              <FontAwesomeIcon 
                  icon="ticket-alt"
                  size="sm"
                  transform={{ rotate: -45 }} /> Technicians
            </NavLink> : null}
            {!this.state.HideAll ? <NavLink
              to='/reports'
              tag={RRNavLink}
              className={NavLinkClassL + " inactive"}
              activeClassName={NavLinkClassL + " active"}
              exact={true}
              onClick={this.refreshReports}
            >
              <FontAwesomeIcon 
                  icon="th"
                  size="sm"/> Reports
            </NavLink> : null}
            {/*<NavLink
              to='/kpis'
              tag={RRNavLink}
              className={"labNavbarLinks inactive"}
              activeClassName={"labNavbarLinks active"}
              exact={true}
              onClick=''
            >
              <FontAwesomeIcon 
                  icon="th"
                  size="sm"/> KPIs
            </NavLink>*/}
            {/*<NavLink
              to='/doctorlabtests'
              tag={RRNavLink}
              className={"labNavbarLinks inactive"}
              activeClassName={"labNavbarLinks active"}
              exact={true}
              onClick=''
            >
              <FontAwesomeIcon 
                  icon="wrench"
                  size="sm"/> Doctor Lab Tests
            </NavLink>*/}
            {/*<NavLink
              to='/locationmngt'
              tag={RRNavLink}
              className={"labNavbarLinks inactive"}
              activeClassName={"labNavbarLinks active"}
              exact={true}
              onClick=''
            >
              <FontAwesomeIcon 
                  icon="ticket-alt"
                  size="sm"
                  transform={{ rotate: -45 }}/> Location Mngt
            </NavLink>*/}
            {false ? <NavLink
              to='/admin'
              tag={RRNavLink}
              className={NavLinkClassLL + " inactive"}
              activeClassName={NavLinkClassLL + " active"}
              exact={true}
              //onClick=''
            >
              <FontAwesomeIcon 
                  icon="ticket-alt"
                  size="sm"
                  transform={{ rotate: -45 }}/> Admin
            </NavLink> : null}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  refreshPage: (Parameter, Type) =>dispatch(refreshPage(Parameter, Type))
});

const mapStateToProps = state => ({
  BranchID: state.ChangeUserAssignedBranch.BranchID,
  UserAuthority: state.UserAuthenticationInfo.AuthenticationInfo.Applications[state.UserAuthenticationInfo.AuthenticationInfo.SelectedApplication].Authorities,
  IsITUser: state.UserAuthenticationInfo.AuthenticationInfo.IsITUser,
  RefreshPages: state.RefreshPages,
  UserAuthenticationInfo: state.UserAuthenticationInfo.AuthenticationInfo
  //TechniciansRefs: state.RefreshPages.TechniciansRefs
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NavMenu));