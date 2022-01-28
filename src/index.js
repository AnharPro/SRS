import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';
import './index.css';
import './bootstrap.min.css';
import App from './components/App';
import { loadState, saveState } from './localStorageSaveLoad';
import * as serviceWorker from './serviceWorker';
import './bootstrap-theme.css';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
global.jQuery = $;


const persistedState = loadState();
const store = createStore(
    rootReducer,
    persistedState
    );

store.subscribe(() => {
    const UserAuthenticationInfo = store.getState().UserAuthenticationInfo;
    const ChangeUserAssignedBranch = store.getState().ChangeUserAssignedBranch;
    if(persistedState === undefined){
        saveState({
            UserAuthenticationInfo: store.getState().UserAuthenticationInfo,
            ChangeUserAssignedBranch: store.getState().ChangeUserAssignedBranch
        });
    }else{
    if(persistedState.UserAuthenticationInfo !== UserAuthenticationInfo || persistedState.ChangeUserAssignedBranch !== ChangeUserAssignedBranch ){
        saveState({
            UserAuthenticationInfo: store.getState().UserAuthenticationInfo,
            ChangeUserAssignedBranch: store.getState().ChangeUserAssignedBranch
        });
    }
}
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
     document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
if (module.hot) { module.hot.accept(); }
