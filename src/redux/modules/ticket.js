import { fromJS } from 'immutable';
import { h0 } from '../../utils/utils';

// init state
const initialState = fromJS({
  departDate: Date.now(), // 出发日期
  arriveDate: Date.now(), // 到达日期
  departTimeStr: null, // 出发时间
  arriveTimeStr: null, // 到达日期
  departStation: null, // 始发站
  arriveStation: null, // 终点站
  trainNumber: null, // 车次
  durationStr: null, // 车次运行时间
  tickets: [], // 车次信息：座次信息（一等座、二等座等）
  isScheduleVisible: false, // 是否显示时刻表
  searchParsed: false // 异步请求数据标识
});

// action types
export const types = {
  ACTION_SET_DEPART_DATE: 'TICKET/SET_DEPART_DATE',
  ACTION_SET_ARRIVE_DATE: 'TICKET/SET_ARRIVE_DATE',
  ACTION_SET_DEPART_TIME_STR: 'TICKET/SET_DEPART_TIME_STR',
  ACTION_SET_ARRIVE_TIME_STR: 'TICKET/SET_ARRIVE_TIME_STR',
  ACTION_SET_DEPART_STATION: 'TICKET/SET_DEPART_STATION',
  ACTION_SET_ARRIVE_STATION: 'TICKET/SET_ARRIVE_STATION',
  ACTION_SET_TRAIN_NUMBER: 'TICKET/SET_TRAIN_NUMBER',
  ACTION_SET_DURATION_STR: 'TICKET/SET_DURATION_STR',
  ACTION_SET_TICKETS: 'TICKET/SET_TICKETS',
  ACTION_SET_IS_SCHEDULE_VISIBLE: 'TICKET/SET_IS_SCHEDULE_VISIBLE',
  ACTION_SET_SEARCH_PARSED: 'TICKET/SET_SEARCH_PARSED'
};

// actions
export const actions = {
  setDepartDate: (departDate) => ({
    type: types.ACTION_SET_DEPART_DATE,
    params: { departDate }
  }),
  setArriveDate: (arriveDate) => ({
    type: types.ACTION_SET_ARRIVE_DATE,
    params: { arriveDate }
  }),
  setDepartTimeStr: (departTimeStr) => ({
    type: types.ACTION_SET_DEPART_TIME_STR,
    params: { departTimeStr }
  }),
  setArriveTimeStr: (arriveTimeStr) => ({
    type: types.ACTION_SET_ARRIVE_TIME_STR,
    params: { arriveTimeStr }
  }),
  setDepartStation: (departStation) => ({
    type: types.ACTION_SET_DEPART_STATION,
    params: { departStation }
  }),
  setArriveStation: (arriveStation) => ({
    type: types.ACTION_SET_ARRIVE_STATION,
    params: { arriveStation }
  }),
  setTrainNumber: (trainNumber) => ({
    type: types.ACTION_SET_TRAIN_NUMBER,
    params: { trainNumber }
  }),
  setDurationStr: (durationStr) => ({
    type: types.ACTION_SET_DURATION_STR,
    params: { durationStr }
  }),
  setTickets: (tickets) => ({
    type: types.ACTION_SET_TICKETS,
    params: { tickets }
  }),
  setIsScheduleVisible: (isScheduleVisible) => ({
    type: types.ACTION_SET_IS_SCHEDULE_VISIBLE,
    params: { isScheduleVisible }
  }),
  toggleIsScheduleVisible: () => {
    return (dispatch, getState) => {
      const isScheduleVisible = getState().getIn([
        'ticket',
        'isScheduleVisible'
      ]);
      dispatch(actions.setIsScheduleVisible(!isScheduleVisible));
    };
  },
  setSearchParsed: (searchParsed) => ({
    type: types.ACTION_SET_SEARCH_PARSED,
    params: { searchParsed }
  }),
  nextDate: () => {
    return (dispatch, getState) => {
      const departDate = getState().getIn(['ticket', 'departDate']);
      dispatch(actions.setDepartDate(h0(departDate) + 86400 * 1000));
    };
  },
  prevDate: () => {
    return (dispatch, getState) => {
      const departDate = getState().getIn(['ticket', 'departDate']);
      dispatch(actions.setDepartDate(h0(departDate) - 86400 * 1000));
    };
  }
};

// reducer
const reducer = (state = initialState, action) => {
  const { type, params } = action;
  switch (type) {
    case types.ACTION_SET_DEPART_DATE:
      return state.set('departDate', params.departDate);
    case types.ACTION_SET_ARRIVE_DATE:
      return state.set('arriveDate', params.arriveDate);
    case types.ACTION_SET_DEPART_TIME_STR:
      return state.set('departTimeStr', params.departTimeStr);
    case types.ACTION_SET_ARRIVE_TIME_STR:
      return state.set('arriveTimeStr', params.arriveTimeStr);
    case types.ACTION_SET_DEPART_STATION:
      return state.set('departStation', params.departStation);
    case types.ACTION_SET_ARRIVE_STATION:
      return state.set('arriveStation', params.arriveStation);
    case types.ACTION_SET_TRAIN_NUMBER:
      return state.set('trainNumber', params.trainNumber);
    case types.ACTION_SET_DURATION_STR:
      return state.set('durationStr', params.durationStr);
    case types.ACTION_SET_TICKETS:
      return state.set('tickets', params.tickets);
    case types.ACTION_SET_IS_SCHEDULE_VISIBLE:
      return state.set('isScheduleVisible', params.isScheduleVisible);
    case types.ACTION_SET_SEARCH_PARSED:
      return state.set('searchParsed', params.searchParsed);
    default:
      return state;
  }
};

export default reducer;
