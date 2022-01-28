const ShowHideLoader = (state = {ShowLoader: false}, action) =>{
    //const r = Object.assign({}, state);
    switch(action.type){
        case 'SHOW_HIDE':
            return Object.assign({}, state, {ShowLoader: action.value})
        default:
            return state
    }
}

export default ShowHideLoader;