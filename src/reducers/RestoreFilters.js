function modifyChangeFilters(state) {
    var a = false;
    if (state.ChangeFilters){
        a = false;
    }else{
        a = true;
    }
    return a
}

const RestoreFilters = (state = {ChangeFilters: false}, action) =>{
    //const r = Object.assign({}, state);
    switch(action.type){
        case 'RESET_FILTERS':
            return Object.assign({}, state, {ChangeFilters: modifyChangeFilters(state)})
        default:
            return state
    }
}

export default RestoreFilters;