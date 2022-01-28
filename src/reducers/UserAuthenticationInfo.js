const AuthenticationInfo={
    Applications: [{
        Authorities: 0
    },{
        Authorities: 0
    },{
        Authorities: 0
    }],
    ArabicName: "",
    AuthenticationToken: "",
    Branches: [],
    Culture: null,
    EnglishName: "",
    ExpiryDateTime: "",
    ITUserIconUrl: "",
    IsITUser: false,
    SelectedApplication: 0,
    Permissions:[]
}

const UserAuthenticationInfo = (state = {AuthenticationInfo: AuthenticationInfo}, action) =>{
    switch(action.type){
        case 'SAVE_AUTHENTICATIONINFO':
            return Object.assign({}, state, {AuthenticationInfo: action.value})
        default:
            return state
    }
}

export default UserAuthenticationInfo;