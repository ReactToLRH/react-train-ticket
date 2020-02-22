import { combineReducers } from 'redux-immutable';
import home from './home';
import query from './query';

const rootReducer = combineReducers({
  home,
  query
});

export default rootReducer;
