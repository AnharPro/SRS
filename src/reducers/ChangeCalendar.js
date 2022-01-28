const ChangeCalendar = (state = {ToDate: true}, action) =>{
    //const r = Object.assign({}, state);
    switch(action.type){
        case 'TO_DATE':
            return Object.assign({}, state, {ToDate: true}) 
        case 'BACK_ONE_YEAR':
            return Object.assign({}, state, {ToDate: false}) 
        default:
            return state
    }
}

  export default ChangeCalendar;