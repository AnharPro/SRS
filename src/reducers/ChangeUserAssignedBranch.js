const ChangeUserAssignedBranch = (state = {Branches: [], BranchID: 0, BranchName:''}, action) =>{
    switch(action.type){
        case 'SAVE_BRANCHES':
            return Object.assign({}, state, {Branches: action.Branches, BranchID: action.BrID, BranchName: action.BrName})
        case 'CHANGE_BRANCH':
            return Object.assign({}, state, {BranchID: action.BrID, BranchName: action.BrName})
        default:
            return state
    }
}

export default ChangeUserAssignedBranch;