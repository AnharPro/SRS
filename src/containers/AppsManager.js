import { connect } from 'react-redux';
import AppsManager from '../components/AppsManagerComponent/AppsManager.js';import { toggleAppsManager } from '../actions';


const mapDispatchToProps = (dispatch) => ({
  onEllipsisClick: (value, val) => dispatch(toggleAppsManager(value, val))
  })

const mapStateToProps = state => ({
    visible: state.OpenCloseAppsManager.AppsManagerOpen,
    apps: state.UserAuthenticationInfo.AuthenticationInfo.Applications
  })

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppsManager)