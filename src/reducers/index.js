import { combineReducers } from 'redux';
import OpenCloseAppsManager from './OpenCloseAppsManager.js';
import ChangeUserAssignedBranch from './ChangeUserAssignedBranch.js';
import ChangeRequestParameters from './ChangeRequestParameters.js';
import ModifyRadStatuses from './ModifyRadStatuses.js';
import RestoreFilters from './RestoreFilters.js';
import ChangeOrders from './ChangeOrders.js';
import UserAuthenticationInfo from './UserAuthenticationInfo.js';
import SetNotifications from './SetNotifications.js';
import UpdateLoadedParameters from './UpdateLoadedParameters.js';
import SetPatientID from './SetPatientID.js';
import RefreshPages from './RefreshPages.js';
import ChangeCalendar from './ChangeCalendar.js';
import UpdatePermissions from './UpdatePermissions.js';
import ShowHideLoader from './ShowHideLoader.js';

export default combineReducers({
    OpenCloseAppsManager,
    ChangeUserAssignedBranch,
    ChangeRequestParameters,
    ModifyRadStatuses,
    RestoreFilters,
    ChangeOrders,
    SetNotifications,
    UserAuthenticationInfo,
    UpdateLoadedParameters,
    SetPatientID,
    RefreshPages,
    ChangeCalendar,
    UpdatePermissions,
    ShowHideLoader
  });