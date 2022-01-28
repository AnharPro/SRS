const Loaded = {
    PhysiciansLoaded: false,
    RadGroupsLoaded: false,
    RadTestsLoaded: false,
    BranchesLoaded: false,
    StatusesLoaded: false
};

const UpdateLoadedParameters = (state = Loaded, action) =>{
    //const r = Object.assign({}, state);
    switch(action.type){
        case 'UPDATE_PHYSICIANS':
            return Object.assign({}, state, {PhysiciansLoaded: action.value}) 
        case 'UPDATE_GROUPS':
            return Object.assign({}, state, {RadGroupsLoaded: action.value}) 
        case 'UPDATE_TESTS':
            return Object.assign({}, state, {RadTestsLoaded: action.value}) 
        case 'UPDATE_BRANCHES':
            return Object.assign({}, state, {BranchesLoaded: action.value})
        case 'UPDATE_STATUSES':
            return Object.assign({}, state, {StatusesLoaded: action.value})
        default:
            return state
    }
}

  export default UpdateLoadedParameters;