import { fromJS } from 'immutable';
import { SET_USER_PROFILE, IS_REQUESTING } from './constants';

const initialState = fromJS({
  userProfile: {},
  isRequesting: false,
});

/**
 * Define the reducer with actions
 *
 * @param {Object} state
 * @param {Object} action
 */
function UserProfileReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_PROFILE:
      return state.set('userProfile', fromJS(action.data));

    case IS_REQUESTING:
      return state.set('isRequesting', action.data);

    default:
      return state;
  }
}

export default UserProfileReducer;
