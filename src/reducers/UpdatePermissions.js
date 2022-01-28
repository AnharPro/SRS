const Permissions={
    RegOpen : false,
    ExOpen : false,
    RepOpen : false,
    AppOpen : false,
}

const UpdatePermissions = (state = {Permissions: Permissions}, action) =>{
    switch(action.type){
        case 'UPDATE_PERMISSIONS':
            return Object.assign({}, state, {Permissions: action.value})
        default:
            return state
    }
}

export default UpdatePermissions;