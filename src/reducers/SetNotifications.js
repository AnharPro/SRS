const Notifications={
    Notifs:{
        Count: 0,
        Notifications: []
    }
}

const SetNotifications = (state = {Notifications: Notifications}, action) =>{
    switch(action.type){
        case 'SAVE_NOTIFICATIONS':
            return Object.assign({}, state, {Notifications: action.value})
        default:
            return state
    }
}

export default SetNotifications;