const IDParams = {
    PatientID: '',
    Counter: 0
};

function changeID(state, Parameter){
    let st = Object.assign({}, state);
    st.PatientID = Parameter;
    st.Counter = parseInt(st.Counter, 10) + 1;
    return st
}

function resetID(state){
    let st = Object.assign({}, state);
    st.PatientID = '';
    st.Counter = 0;
    return st
}

const SetPatientID = (state = IDParams, action) =>{
    //const r = Object.assign({}, state);
    switch(action.type){
        case 'SET_PATIENTID':
        return Object.assign({}, state, changeID(state, action.value))
        case 'RESET_PATIENTID':
        return Object.assign({}, state, resetID(state))
        default:
            return state
    }
}

export default SetPatientID;