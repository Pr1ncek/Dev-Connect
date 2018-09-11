import { combineReducers } from 'redux';

import authReducer from './auth-reducer';
import errorsReducer from './errors-reducer';
import profileReducer from './profile-reducer';

export default combineReducers({
  auth: authReducer,
  profile: profileReducer,
  errors: errorsReducer
});
