import { combineReducers } from 'redux';

import authReducer from './auth-reducer';
import errorsReducer from './errors-reducer';

export default combineReducers({
  auth: authReducer,
  errors: errorsReducer
});
