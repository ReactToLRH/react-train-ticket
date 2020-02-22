import { fromJS, isImmutable } from 'immutable';
import { h0 } from '../../utils/utils';

export const ORDER_DEPART = 1; // 出发 早 -> 晚
export const ORDER_DURATION = 2; // 耗时 短->长

// init state
const initialState = fromJS({
  from: null, // 始发站
  to: null, // 终点站
  departDate: h0(Date.now()), // 出发日期
  highSpeed: false, // 是否选择 [高铁/动车] 选项
  trainList: [], // 列车列表
  orderType: ORDER_DEPART, // 筛选：出发 早 -> 晚
  onlyTickets: false, // 筛选：是否只看有票
  ticketTypes: [], // 综合筛选：车票的类型列表（一等座、二等座、硬卧、硬座等）
  checkedTicketTypes: {}, // 已选择车票的类型
  trainTypes: [], // 综合筛选：车次类型列表（高铁动车、动车组、直达特快等）
  checkedTrainTypes: {}, // 已选择车次的类型
  departStations: [], // 综合筛选：出发车站列表
  checkedDepartStations: {}, // 已选择的出发车站
  arriveStations: [], // 综合筛选：到达车站列表
  checkedArriveStations: {}, // 已选择的到达车站
  departTimeStart: 0, // 综合筛选：出发时间 - 开始时间
  departTimeEnd: 24, // 综合筛选：出发时间 - 结束时间
  arriveTimeStart: 0, // 综合筛选：到达时间 - 开始时间
  arriveTimeEnd: 24, // 综合筛选：到达时间 - 结束时间
  isFiltersVisible: false, // 是否显示综合筛选弹出层
  searchParsed: false // 用于标识是否可以发送请求（因为需要相关数据解析完成之后进行请求）
});

// action types
export const types = {
  ACTION_SET_TO: 'QUERY/SET_TO',
  ACTION_SET_FROM: 'QUERY/SET_FROM',
  ACTION_SET_DEPART_DATE: 'QUERY/SET_DEPART_DATE',
  ACTION_SET_HIGH_SPEED: 'QUERY/SET_HIGH_SPEED',
  ACTION_SET_FILTER_HIGH_SPEED: 'QUERY/ACTION_SET_FILTER_HIGH_SPEED',
  ACTION_SET_TRAIN_LIST: 'QUERY/SET_TRAIN_LIST',
  ACTION_SET_ORDER_TYPE: 'QUERY/SET_ORDER_TYPE',
  ACTION_SET_ONLY_TICKETS: 'QUERY/SET_ONLY_TICKETS',
  ACTION_SET_TICKET_TYPES: 'QUERY/SET_TICKET_TYPES',
  ACTION_SET_CHECKED_TICKET_TYPES: 'QUERY/SET_CHECKED_TICKET_TYPES',
  ACTION_SET_TRAIN_TYPES: 'QUERY/SET_TRAIN_TYPES',
  ACTION_SET_CHECKED_TRAIN_TYPES: 'QUERY/SET_CHECKED_TRAIN_TYPES',
  ACTION_SET_RESET_CHECKED_TRAIN_TYPES:
    'QUERY/ACTION_SET_RESET_CHECKED_TRAIN_TYPES',
  ACTION_SET_DEPART_STATIONS: 'QUERY/SET_DEPART_STATIONS',
  ACTION_SET_CHECKED_DEPART_STATIONS: 'QUERY/SET_CHECKED_DEPART_STATIONS',
  ACTION_SET_ARRIVE_STATIONS: 'QUERY/SET_ARRIVE_STATIONS',
  ACTION_SET_CHECKED_ARRIVE_STATIONS: 'QUERY/SET_CHECKED_ARRIVE_STATIONS',
  ACTION_SET_DEPART_TIME_START: 'QUERY/SET_DEPART_TIME_START',
  ACTION_SET_DEPART_TIME_END: 'QUERY/SET_DEPART_TIME_END',
  ACTION_SET_ARRIVE_TIME_START: 'QUERY/SET_ARRIVE_TIME_START',
  ACTION_SET_ARRIVE_TIME_END: 'QUERY/SET_ARRIVE_TIME_END',
  ACTION_SET_IS_FILTERS_VISIBLE: 'QUERY/SET_IS_FILTERS_VISIBLE',
  ACTION_SET_SEARCH_PARSED: 'QUERY/SET_SEARCH_PARSED'
};

// action
export const actions = {
  setFrom: (from) => ({
    type: types.ACTION_SET_FROM,
    params: { from }
  }),
  setTo: (to) => ({
    type: types.ACTION_SET_TO,
    params: { to }
  }),
  setDepartDate: (departDate) => ({
    type: types.ACTION_SET_DEPART_DATE,
    params: { departDate }
  }),
  setHighSpeed: (highSpeed) => ({
    type: types.ACTION_SET_HIGH_SPEED,
    params: { highSpeed }
  }),
  setFilterHighSpeed: (highSpeed, checkedTrainTypes) => ({
    type: types.ACTION_SET_FILTER_HIGH_SPEED,
    params: { highSpeed, checkedTrainTypes }
  }),
  toggleHighSpeed: () => {
    return (dispatch, getState) => {
      const highSpeed = getState().getIn(['query', 'highSpeed']);
      let checkedTrainTypes = getState().getIn(['query', 'checkedTrainTypes']);
      checkedTrainTypes = isImmutable(checkedTrainTypes)
        ? checkedTrainTypes.toJS()
        : checkedTrainTypes;
      dispatch(actions.setHighSpeed(!highSpeed));
      dispatch(actions.setFilterHighSpeed(!highSpeed, checkedTrainTypes));
    };
  },
  setTrainList: (trainList) => ({
    type: types.ACTION_SET_TRAIN_LIST,
    params: { trainList }
  }),
  toggleOrderType: () => {
    return (dispatch, getState) => {
      const orderType = getState().getIn(['query', 'orderType']);
      if (orderType === ORDER_DEPART) {
        dispatch({
          type: types.ACTION_SET_ORDER_TYPE,
          params: { orderType: ORDER_DURATION }
        });
      } else {
        dispatch({
          type: types.ACTION_SET_ORDER_TYPE,
          params: { orderType: ORDER_DEPART }
        });
      }
    };
  },
  toggleOnlyTickets: () => {
    return (dispatch, getState) => {
      const onlyTickets = getState().getIn(['query', 'onlyTickets']);
      dispatch({
        type: types.ACTION_SET_ONLY_TICKETS,
        params: { onlyTickets: !onlyTickets }
      });
    };
  },
  setTicketTypes: (ticketTypes) => ({
    type: types.ACTION_SET_TICKET_TYPES,
    params: { ticketTypes }
  }),
  setCheckedTicketTypes: (checkedTicketTypes) => ({
    type: types.ACTION_SET_CHECKED_TICKET_TYPES,
    params: { checkedTicketTypes }
  }),
  setTrainTypes: (trainTypes) => ({
    type: types.ACTION_SET_TRAIN_TYPES,
    params: { trainTypes }
  }),
  setCheckedTrainTypes: (checkedTrainTypes) => ({
    type: types.ACTION_SET_CHECKED_TRAIN_TYPES,
    params: { checkedTrainTypes }
  }),
  setResetCheckedTrainTypes: (checkedTrainTypes) => ({
    type: types.ACTION_SET_RESET_CHECKED_TRAIN_TYPES,
    params: { checkedTrainTypes }
  }),
  resetCheckedTrainTypes: () => {
    return (dispatch, getState) => {
      let checkedTrainTypes = getState().getIn(['query', 'checkedTrainTypes']);
      checkedTrainTypes = isImmutable(checkedTrainTypes)
        ? checkedTrainTypes.toJS()
        : checkedTrainTypes;
      dispatch(actions.setResetCheckedTrainTypes(checkedTrainTypes));
    };
  },
  setDepartStations: (departStations) => ({
    type: types.ACTION_SET_DEPART_STATIONS,
    params: { departStations }
  }),
  setCheckedDepartStations: (checkedDepartStations) => ({
    type: types.ACTION_SET_CHECKED_DEPART_STATIONS,
    params: { checkedDepartStations }
  }),
  setArriveStations: (arriveStations) => ({
    type: types.ACTION_SET_ARRIVE_STATIONS,
    params: { arriveStations }
  }),
  setCheckedArriveStations: (checkedArriveStations) => ({
    type: types.ACTION_SET_CHECKED_ARRIVE_STATIONS,
    params: { checkedArriveStations }
  }),
  setDepartTimeStart: (departTimeStart) => ({
    type: types.ACTION_SET_DEPART_TIME_START,
    params: { departTimeStart }
  }),
  setDepartTimeEnd: (departTimeEnd) => ({
    type: types.ACTION_SET_DEPART_TIME_END,
    params: { departTimeEnd }
  }),
  setArriveTimeStart: (arriveTimeStart) => ({
    type: types.ACTION_SET_ARRIVE_TIME_START,
    params: { arriveTimeStart }
  }),
  setArriveTimeEnd: (arriveTimeEnd) => ({
    type: types.ACTION_SET_ARRIVE_TIME_END,
    params: { arriveTimeEnd }
  }),
  toggleIsFiltersVisible: () => {
    return (dispatch, getState) => {
      const isFiltersVisible = getState().getIn(['query', 'isFiltersVisible']);
      dispatch({
        type: types.ACTION_SET_IS_FILTERS_VISIBLE,
        params: { isFiltersVisible: !isFiltersVisible }
      });
    };
  },
  setSearchParsed: (searchParsed) => ({
    type: types.ACTION_SET_SEARCH_PARSED,
    params: { searchParsed }
  }),
  nextDate: () => {
    return (dispatch, getState) => {
      const departDate = getState().getIn(['query', 'departDate']);
      dispatch(actions.setDepartDate(h0(departDate) + 86400 * 1000));
    };
  },
  prevDate: () => {
    return (dispatch, getState) => {
      const departDate = getState().getIn(['query', 'departDate']);
      dispatch(actions.setDepartDate(h0(departDate) - 86400 * 1000));
    };
  }
};

// reducer
const reducer = (state = initialState, action) => {
  const { type, params } = action;
  switch (type) {
    case types.ACTION_SET_FROM:
      return state.set('from', params.from);
    case types.ACTION_SET_TO:
      return state.set('to', params.to);
    case types.ACTION_SET_DEPART_DATE:
      return state.set('departDate', params.departDate);
    case types.ACTION_SET_HIGH_SPEED:
      return state.set('highSpeed', params.highSpeed);
    case types.ACTION_SET_FILTER_HIGH_SPEED:
      let highSpeed = params.highSpeed;
      let checkedTrainTypes = params.checkedTrainTypes;
      if (highSpeed) {
        checkedTrainTypes[1] = true;
        checkedTrainTypes[5] = true;
      } else {
        delete checkedTrainTypes[1];
        delete checkedTrainTypes[5];
      }
      return state.set('checkedTrainTypes', checkedTrainTypes);
    case types.ACTION_SET_CHECKED_TRAIN_TYPES:
      return state.set('checkedTrainTypes', params.checkedTrainTypes);
    case types.ACTION_SET_RESET_CHECKED_TRAIN_TYPES:
      let resetCheckedTrainTypes = params.checkedTrainTypes;
      let isResetCheckedTrainTypes = Boolean(
        resetCheckedTrainTypes[1] && resetCheckedTrainTypes[5]
      );
      return state.set('highSpeed', isResetCheckedTrainTypes);
    case types.ACTION_SET_TRAIN_LIST:
      return state.set('trainList', params.trainList);
    case types.ACTION_SET_ORDER_TYPE:
      return state.set('orderType', params.orderType);
    case types.ACTION_SET_ONLY_TICKETS:
      return state.set('onlyTickets', params.onlyTickets);
    case types.ACTION_SET_TICKET_TYPES:
      return state.set('ticketTypes', params.ticketTypes);
    case types.ACTION_SET_CHECKED_TICKET_TYPES:
      return state.set('checkedTicketTypes', params.checkedTicketTypes);
    case types.ACTION_SET_TRAIN_TYPES:
      return state.set('trainTypes', params.trainTypes);
    case types.ACTION_SET_DEPART_STATIONS:
      return state.set('departStations', params.departStations);
    case types.ACTION_SET_CHECKED_DEPART_STATIONS:
      return state.set('checkedDepartStations', params.checkedDepartStations);
    case types.ACTION_SET_ARRIVE_STATIONS:
      return state.set('arriveStations', params.arriveStations);
    case types.ACTION_SET_CHECKED_ARRIVE_STATIONS:
      return state.set('checkedArriveStations', params.checkedArriveStations);
    case types.ACTION_SET_DEPART_TIME_START:
      return state.set('departTimeStart', params.departTimeStart);
    case types.ACTION_SET_DEPART_TIME_END:
      return state.set('departTimeEnd', params.departTimeEnd);
    case types.ACTION_SET_ARRIVE_TIME_START:
      return state.set('arriveTimeStart', params.arriveTimeStart);
    case types.ACTION_SET_ARRIVE_TIME_END:
      return state.set('arriveTimeEnd', params.arriveTimeEnd);
    case types.ACTION_SET_IS_FILTERS_VISIBLE:
      return state.set('isFiltersVisible', params.isFiltersVisible);
    case types.ACTION_SET_SEARCH_PARSED:
      return state.set('searchParsed', params.searchParsed);
    default:
      return state;
  }
};

export default reducer;
