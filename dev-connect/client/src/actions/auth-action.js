import { TEST_DISPATCH } from './types';

export const registerUser = function(userData) {
  return {
    type: TEST_DISPATCH,
    payload: userData
  };
};
