const Refreshes = {
    Dashboard: 0,
    Worklist: 0,
    Technicians: 0,
    Reports: 0
};

const RefreshPages = (state = Refreshes, action) =>{
    //const r = Object.assign({}, state);
    switch(action.type){
        case 'REFRESH_DASHBOARD':
            return Object.assign({}, state, {Dashboard: action.value})
        case 'REFRESH_WORKLIST':
            return Object.assign({}, state, {Worklist: action.value})
        case 'REFRESH_TECHNICIANS':
            return Object.assign({}, state, {Technicians: action.value})
        case 'REFRESH_REPORTS':
            return Object.assign({}, state, {Reports: action.value})
        default:
            return state
    }
}

export default RefreshPages;