const Statuses={
    Statuses:[],
    SelectedStatusIndex: 0
}

function changeSelectedStatus(state, Parameter){
    let st = Object.assign({}, state);
    st.Statuses.SelectedStatusIndex = Parameter;
    return st.Statuses
}

const ModifyRadStatuses = (state = {Statuses: Statuses}, action) =>{
    switch(action.type){
        case 'SAVE_STATUSES':
            return Object.assign({}, state, {Statuses: action.value})
        case 'CHANGE_SELECTED_STATUS':
            return Object.assign({}, state, {Statuses: Object.assign({}, changeSelectedStatus(state, action.value))})
        default:
            return state
    }
}

export default ModifyRadStatuses;