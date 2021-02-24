import {combineReducers, createStore} from 'redux';
import {devToolsEnhancer} from 'redux-devtools-extension';
import authReducer from './components/auth/state/authReducer';
import descReducer from './components/desc/state/descReducer';
import personalReducer from './components/personal/state/personalReducer';
import videoReducer from './components/video/state/videoReducer';
import moveReducer from './components/move/state/moveReducer';

const rootReducer = combineReducers({
    authReducer,
    moveReducer,
    personalReducer
});

export default createStore(rootReducer, devToolsEnhancer());