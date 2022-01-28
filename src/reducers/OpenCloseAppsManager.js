function OpenClose(state) {
    let st = Object.assign({}, state);
    var a = false;
    if (st.AppsManagerOpen){
        a = false;
    }else{
        a = true;
    }
    return a
}


const OpenCloseAppsManager = (state = {AppsManagerOpen: false, isClickOut: false}, action) =>{
    //const r = Object.assign({}, state);
    switch(action.type){
        case 'OPEN_CLOSE':
            return Object.assign({}, state, {AppsManagerOpen: action.value, isClickOut: action.val})
        default:
            return state
    }
}

export default OpenCloseAppsManager;