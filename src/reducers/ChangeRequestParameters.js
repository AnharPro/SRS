import moment from 'moment';
const Req1 = {
    Patient: '',
    Physicians:'',
    RadGroups: '',
    RadTests: '',
    DateFrom: moment().format('DD/MM/YYYY'),
    DateTo: moment().format('DD/MM/YYYY'),
    Gender: null,
    Type: null,
    SortCol: 1,
    TestStatusID:1,
    SortMode: 2,
    BranchID: 0,
    PageSize: 5,
    PageNumber: 1,
    OrderID: null,
    UserID: 1
};

function resetTodaysOrders(state, Parameter){
    let st = Object.assign({}, state);
    st = Req1;
    st.BranchID = Parameter.BranchID;
    st.UserID = Parameter.UserId;
    return st
}

const ChangeRequestParameters = (state = Req1, action) =>{
    //const r = Object.assign({}, state);
    switch(action.type){
        case 'CHANGE_STATUS':
            return Object.assign({}, state, {Type: action.value, PageNumber: 1}) 
        case 'CHANGE_GENDER':
            return Object.assign({}, state, {Gender: action.value, PageNumber: 1}) 
        case 'CHANGE_SELECTED_DOCTOR':
            return Object.assign({}, state, {Physicians: action.value, PageNumber: 1}) 
        case 'CHANGE_END_DATE':
            return Object.assign({}, state, {DateTo: action.value, PageNumber: 1})
        case 'CHANGE_START_DATE':
            return Object.assign({}, state, {DateFrom: action.value, PageNumber: 1})
        case 'CHANGE_BRANCHPARAM':
            return Object.assign({}, state, {BranchID: action.value, PageNumber: 1})
        case 'CHANGE_RADGROUPS':
            return Object.assign({}, state, {RadGroups: action.value, PageNumber: 1})
        case 'CHANGE_RADTESTS':
            return Object.assign({}, state, {RadTests: action.value, PageNumber: 1})
        case 'CHANGE_PATIENT':
            return Object.assign({}, state, {Patient: action.value, PageNumber: 1})
        case 'CHANGE_SORTCOL':
            return Object.assign({}, state, {SortCol: action.value, PageNumber: 1})
        case 'CHANGE_SORTMODE':
            return Object.assign({}, state, {SortMode: action.value, PageNumber: 1})
        case 'CHANGE_PAGENUMBER':
            return Object.assign({}, state, {PageNumber: action.value})
        case 'CHANGE_PAGESIZE':
            return Object.assign({}, state, {PageSize: action.value, PageNumber: 1})
        case 'CHANGE_SORTSTATUS':
            return Object.assign({}, state, {TestStatusID: action.value, PageNumber: 1})
        case 'CHANGE_ORDERID':
            return Object.assign({}, state, {OrderID: action.value, PageNumber: 1})
        case 'CHANGE_TESTID':
            return Object.assign({}, state, {RadTests: action.value, PageNumber: 1})
        case 'CHANGE_PATIENTID':
            return Object.assign({}, state, {Patient: action.value, PageNumber: 1})
        case 'GET_TODAYS_ORDERS':
            //return Object.assign({}, state, resetTodaysOrders(state, action.value))
            return Object.assign({}, state, {DateFrom: moment().format('DD/MM/YYYY'), DateTo: moment().format('DD/MM/YYYY'), Patient: '', OrderID: null,  PageNumber: 1})
        default:
            return state
    }
}

  export default ChangeRequestParameters;