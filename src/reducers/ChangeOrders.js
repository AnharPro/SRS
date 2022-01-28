const Orders = {
    Orders: []
}

function checkAllOrders(state, Parameters){
    let st = Object.assign({}, state);
    for(var i = 0; i < st.Orders.Orders.length; i++){
        if(Parameters.CheckAll){
            if(!st.Orders.Orders[i].Selected && st.Orders.Orders[i].AllowMoveStatus){
                st.Orders.Orders[i].Selected = true;
                for(var ii = 0; ii < st.Orders.Orders[i].LabInvoiceGroupWithTests.length; ii++){
                    for(var iii = 0; iii < st.Orders.Orders[i].LabInvoiceGroupWithTests[ii].Tests.length; iii++){
                        if(st.Orders.Orders[i].LabInvoiceGroupWithTests[ii].Tests[iii].AllowMoveStatus){
                            st.Orders.Orders[i].LabInvoiceGroupWithTests[ii].Tests[iii].Selected = true;
                        }
                    }
                }
            }
            st.Orders.Orders[i].SelectedTests = st.Orders.Orders[i].SelectableTests;
            st.Orders.SelectedOrders = st.Orders.MovableOrders;
        }else if(!Parameters.CheckAll){
            if(st.Orders.Orders[i].Selected && st.Orders.Orders[i].AllowMoveStatus){
                st.Orders.Orders[i].Selected = false;
                for(var jj = 0; jj < st.Orders.Orders[i].LabInvoiceGroupWithTests.length; jj++){
                    for(var jjj = 0; jjj < st.Orders.Orders[i].LabInvoiceGroupWithTests[jj].Tests.length; jjj++){
                        if(st.Orders.Orders[i].LabInvoiceGroupWithTests[jj].Tests[jjj].AllowMoveStatus){
                            st.Orders.Orders[i].LabInvoiceGroupWithTests[jj].Tests[jjj].Selected = false;
                        }
                    }
                }
            }
            st.Orders.Orders[i].SelectedTests = 0;
            st.Orders.SelectedOrders = 0;
        }
    }
    return st.Orders
}

function changeOrder(state, Parameters){
    let st = Object.assign({}, state);
    let PrevState = st.Orders.Orders[Parameters.OrderIndex];
    if(PrevState.Selected && PrevState.AllowMoveStatus){
        st.Orders.Orders[Parameters.OrderIndex].Selected = false;
        st.Orders.SelectedOrders = st.Orders.SelectedOrders - 1;
        for(var i = 0; i < st.Orders.Orders[Parameters.OrderIndex].LabInvoiceGroupWithTests.length; i++){
            for(var ii = 0; ii < st.Orders.Orders[Parameters.OrderIndex].LabInvoiceGroupWithTests[i].Tests.length; ii++){
                if(st.Orders.Orders[Parameters.OrderIndex].LabInvoiceGroupWithTests[i].Tests[ii].AllowMoveStatus){
                    st.Orders.Orders[Parameters.OrderIndex].LabInvoiceGroupWithTests[i].Tests[ii].Selected = false;
                }
            }
        }
        st.Orders.Orders[Parameters.OrderIndex].SelectedTests = 0;
    }else if(!PrevState.Selected && PrevState.AllowMoveStatus){
        st.Orders.Orders[Parameters.OrderIndex].Selected = true;
        st.Orders.SelectedOrders = st.Orders.SelectedOrders + 1;
        for(var j = 0; j < st.Orders.Orders[Parameters.OrderIndex].LabInvoiceGroupWithTests.length; j++){
            for(var jj = 0; jj < st.Orders.Orders[Parameters.OrderIndex].LabInvoiceGroupWithTests[j].Tests.length; jj++){
                if(st.Orders.Orders[Parameters.OrderIndex].LabInvoiceGroupWithTests[j].Tests[jj].AllowMoveStatus){
                    st.Orders.Orders[Parameters.OrderIndex].LabInvoiceGroupWithTests[j].Tests[jj].Selected = true;
                }
            }
        }
        st.Orders.Orders[Parameters.OrderIndex].SelectedTests = st.Orders.Orders[Parameters.OrderIndex].SelectableTests;
    }
    return st.Orders
}

function changeTestSelected(state, Parameters) {
    let st = Object.assign({}, state);
    if(st.Orders.Orders[Parameters.OrderIndex].LabInvoiceGroupWithTests[Parameters.GroupsIndex].Tests[Parameters.TestIndex].Selected){
        if(st.Orders.Orders[Parameters.OrderIndex].LabInvoiceGroupWithTests[Parameters.GroupsIndex].Tests[Parameters.TestIndex].AllowMoveStatus){
            st.Orders.Orders[Parameters.OrderIndex].LabInvoiceGroupWithTests[Parameters.GroupsIndex].Tests[Parameters.TestIndex].Selected = false;
            st.Orders.Orders[Parameters.OrderIndex].SelectedTests = st.Orders.Orders[Parameters.OrderIndex].SelectedTests - 1;
        }
    }else{
        if(st.Orders.Orders[Parameters.OrderIndex].LabInvoiceGroupWithTests[Parameters.GroupsIndex].Tests[Parameters.TestIndex].AllowMoveStatus){
            st.Orders.Orders[Parameters.OrderIndex].LabInvoiceGroupWithTests[Parameters.GroupsIndex].Tests[Parameters.TestIndex].Selected = true;
            st.Orders.Orders[Parameters.OrderIndex].SelectedTests = st.Orders.Orders[Parameters.OrderIndex].SelectedTests + 1;
        }
    }

    if(st.Orders.Orders[Parameters.OrderIndex].SelectedTests === 0){
        if(st.Orders.Orders[Parameters.OrderIndex].Selected && st.Orders.Orders[Parameters.OrderIndex].AllowMoveStatus){
            st.Orders.Orders[Parameters.OrderIndex].Selected = false;
            st.Orders.SelectedOrders = st.Orders.SelectedOrders - 1;}
    }else if(st.Orders.Orders[Parameters.OrderIndex].SelectedTests > 0){
        if(!st.Orders.Orders[Parameters.OrderIndex].Selected && st.Orders.Orders[Parameters.OrderIndex].AllowMoveStatus){
            st.Orders.Orders[Parameters.OrderIndex].Selected = true;
            st.Orders.SelectedOrders = st.Orders.SelectedOrders + 1;}
    }
    return st.Orders
}

const ChangeOrders = (state = {Orders: Orders}, action) =>{
    switch(action.type){
        case 'SAVE_ORDERS':
            return Object.assign({}, state, {Orders: action.value})
        case 'CHANGE_TEST_SELECTED':
            return Object.assign({}, state, {Orders: Object.assign({}, changeTestSelected(state, action.value))})
        case 'CHANGE_ORDER':
            return Object.assign({}, state, {Orders: Object.assign({}, changeOrder(state, action.value))})
        case 'CHECK_ALL_ORDERS':
            return Object.assign({}, state, {Orders: Object.assign({}, checkAllOrders(state, action.value))})
        default:
            return state
    }
}

export default ChangeOrders;