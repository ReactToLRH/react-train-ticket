import { combineReducers } from 'redux-immutable';
import home from './home';
import query from './query';
import ticket from './ticket';

const rootReducer = combineReducers({
  home,
  query,
  ticket
});

export default rootReducer;
