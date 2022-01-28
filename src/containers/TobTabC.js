import { connect } from 'react-redux';
import { toggleAppsManager, changeSelectedUserBranch, saveNotifications, changeBrPermissions} from '../actions';
import TopTab from '../components/TopTabComponent/TopTab.js';

const mapDispatchToProps = (dispatch) => ({
  onEllipsisClick: (value, val) => dispatch(toggleAppsManager(value, val)),
  saveNotifications: (Parameter, Type) => dispatch(saveNotifications(Parameter, Type)),
  onBranchChanged: (Branches, BranchID, BranchName) => dispatch(changeSelectedUserBranch(Branches, BranchID, BranchName, 'CHANGE_BRANCH')),
  changeBrPermissions: (Parameter, Type) => dispatch(changeBrPermissions(Parameter, Type)),
  })

  const mapStateToProps = state => ({
    showLoader: state.ShowHideLoader.ShowLoader,
    visible: state.OpenCloseAppsManager.AppsManagerOpen,
    isClickOut: state.OpenCloseAppsManager.isClickOut,
    UserAuthInfo: state.UserAuthenticationInfo.AuthenticationInfo,
    BranchName: state.ChangeUserAssignedBranch.BranchName,
    BranchID: state.ChangeUserAssignedBranch.BranchID,
    Branches: state.ChangeUserAssignedBranch.Branches,
    UserToken: state.UserAuthenticationInfo.AuthenticationInfo.AuthenticationToken,
    Notifications: state.SetNotifications.Notifications.Notifs
  })

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(TopTab)