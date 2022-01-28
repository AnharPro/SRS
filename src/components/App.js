import React, { Component } from 'react';
import { HashRouter as Router, Route, /*hashHistory*/ } from "react-router-dom";
import * as routes from '../constants/routes.js';
import TopTabC from '../containers/TobTabC.js';
import AppsManager from '../containers/AppsManager.js';
import NavMenu from '../components/NavMenu/NavMenu.js';
import MainPage from '../components/MainPage/MainPage.js';
import Dashboard from './DashBoard/DashBoard.js';
import WorkList from './WorkList/WorkList.js';
import TechniciansPage from './Technicians/TechniciansPage.js';
import NotAuthorizedPage from './NotAuthorizedPage/NotAuthorizedPage.js';
import NotificationsPage from '../components/Notifications/NotificationsPage';
import ReportPage from '../components/ReportPage/ReportPage.js';
import Footer from '../components/Footer/Footer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { connect } from "react-redux";
import { faEnvelope, faKey, faCubes, faGlobeAmericas, faEllipsisV, faTachometerAlt, faTicketAlt, faTh, faWrench, faAlignLeft, faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import '../App.css';


library.add(faEnvelope, faKey, faCubes, faGlobeAmericas, faEllipsisV, faTachometerAlt, faTicketAlt, faTh, faWrench, faAlignLeft, faUser, faBell );



class App extends Component {
  constructor(props){
    if (window.performance) {
      if (performance.navigation.type == 1) {
        //alert( "This page is reloaded" );
      } else {
      }
    }
    super(props);
    this.state={
      loading: true
    };
    this.BefUnl = this.BefUnl.bind(this);
    this.checkForRef = this.checkForRef.bind(this);
  }

  checkForRef(){
    const l = performance.navigation.type;
    if(parseInt(l, 10) === 1){
    }
  }

  BefUnl(){
    var Count = parseInt(localStorage.getItem('AppsCount'), 10);
    if(Count === 1){
      //localStorage.removeItem('state');
    }
    Count = Count - 1;
    localStorage.setItem('AppsCount', Count)
    if(Count === 0){
      //localStorage.removeItem('state');
      //alert('aa')
    }
    //alert(Count)
  }

  componentDidMount(){
    //const ls = localStorage;
    if(localStorage.getItem('AppsCount')){
      var Count = parseInt(localStorage.getItem('AppsCount'), 10);
      Count = Count + 1;
      if(Count < 1 || isNaN(Count)){
        Count = 1;
      }
      localStorage.setItem('AppsCount', Count)
      //alert(Count)
    }
    else{
      localStorage.setItem('AppsCount', 1)
      const Count = parseInt(localStorage.getItem('AppsCount'), 10);
      //alert(Count)
    }
    window.addEventListener('unload', this.BefUnl)
    window.addEventListener('load', this.checkForRef)
  }

  componentWillUnmount(){
    //localStorage.removeItem('state');
  }

  render() {
    return (
      <div className="fullpage">
      <Router>
        <div className='maindiv1 clearer'>
      <TopTabC />
      <AppsManager/>
      <NavMenu />
      
      <Route
            exact
            path={routes.MAINPAGE}
            component={() => <MainPage/>}
          />

      <Route
            exact
            path={routes.DASHBOARD}
            component={() => <Dashboard/>}
          />
      <Route
            exact
            path={routes.WORKLIST}
            component={() => <WorkList/>}
          />
      <Route
            exact
            path={routes.TECHNICIANSPAGE}
            component={() => <TechniciansPage/>}
          />
      <Route
            exact
            path={routes.NOTAUTHORIZEDPAGE}
            component={() => <NotAuthorizedPage/>}
          />
      <Route
            exact
            path={routes.NOTIFICATIONS}
            component={() => <NotificationsPage/>}
          />
      <Route
            exact
            path={routes.REPORTS}
            component={() => <ReportPage/>}
          />
      </div>
      </Router>
      <div className="push"></div>
      {<Footer/>}
      </div>
    );
  }
}


const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default App;

