import { fromJS } from 'immutable';

// init state
const initialState = fromJS({
  from: '北京', // 始发站
  to: '上海', // 终点站
  isCitySelectorVisible: false, // 是否显示城市选择
  currentSelectingLeftCity: false, // 用于标识城市选择数据回填的位置
  cityData: null, // 城市选择的所有城市数据
  isLoadingCityData: false, // 是否加载城市数据
  isDateSelectorVisible: false, // 是否显示日期选择
  departDate: Date.now(),
  highSpeed: false // 是否选择 [高铁/动车] 选项
});

// action types
export const types = {
  ACTION_SET_FROM: 'HOME/ACTION_SET_FROM',
  ACTION_SET_TO: 'HOME/ACTION_SET_TO',
  ACTION_SET_IS_CITY_SELECTOR_VISIBLE:
    'HOME/ACTION_SET_IS_CITY_SELECTOR_VISIBLE',
  ACTION_SET_CURRENT_SELECTING_LEFT_CITY:
    'HOME/ACTION_SET_CURRENT_SELECTING_LEFT_CITY',
  ACTION_SET_CITY_DATA: 'HOME/ACTION_SET_CITY_DATA',
  ACTION_SET_IS_LOADING_CITY_DATA: 'HOME/ACTION_SET_IS_LOADING_CITY_DATA',
  ACTION_SET_IS_DATE_SELECTOR_VISIBLE:
    'HOME/ACTION_SET_IS_DATE_SELECTOR_VISIBLE',
  ACTION_SET_HIGH_SPEED: 'HOME/ACTION_SET_HIGH_SPEED',
  ACTION_SET_DEPART_DATE: 'HOME/ACTION_SET_DEPART_DATE'
};

// actions
export const actions = {
  setFrom: (from) => ({
    type: types.ACTION_SET_FROM,
    params: { from }
  }),
  setTo: (to) => ({
    type: types.ACTION_SET_TO,
    params: { to }
  }),
  setIsLoadingCityData: (isLoadingCityData) => ({
    type: types.ACTION_SET_IS_LOADING_CITY_DATA,
    params: { isLoadingCityData }
  }),
  setCityData: (cityData) => ({
    type: types.ACTION_SET_CITY_DATA,
    params: { cityData }
  }),
  toggleHighSpeed: () => {
    return (dispatch, getState) => {
      const highSpeed = getState().getIn(['home', 'highSpeed']);
      dispatch({
        type: types.ACTION_SET_HIGH_SPEED,
        params: { highSpeed: !highSpeed }
      });
    };
  },
  showCitySelector: (currentSelectingLeftCity) => {
    return (dispatch, getState) => {
      dispatch({
        type: types.ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
        params: { isCitySelectorVisible: true }
      });
      dispatch({
        type: types.ACTION_SET_CURRENT_SELECTING_LEFT_CITY,
        params: { currentSelectingLeftCity }
      });
    };
  },
  hideCitySelector: () => ({
    type: types.ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
    params: { isCitySelectorVisible: false }
  }),
  setSelectedCity: (city) => {
    return (dispatch, getState) => {
      const { currentSelectingLeftCity } = getState;
      if (currentSelectingLeftCity) {
        dispatch(actions.setFrom(city));
      } else {
        dispatch(actions.setTo(city));
      }
      dispatch(actions.hideCitySelector());
    };
  },
  showDateSelector: () => ({
    type: types.ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    params: { isDateSelectorVisible: true }
  }),
  hideDateSelector: () => ({
    type: types.ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    params: { isDateSelectorVisible: false }
  }),
  exchangeFromTo: () => {
    return (dispatch, getState) => {
      const from = getState().getIn(['home', 'from']);
      const to = getState().getIn(['home', 'to']);
      dispatch(actions.setFrom(to));
      dispatch(actions.setTo(from));
    };
  },
  setDepartDate: (departDate) => ({
    type: types.ACTION_SET_DEPART_DATE,
    params: { departDate }
  }),
  fetchCityData: () => {
    return (dispatch, getState) => {
      const isLoadingCityData = getState().getIn(['home', 'isLoadingCityData']);
      if (isLoadingCityData) {
        return;
      }
      const cache = JSON.parse(localStorage.getItem('city_data_cache') || '{}');
      if (Date.now() < cache.expires) {
        dispatch(actions.setCityData(cache.data));
        return;
      }
      dispatch(actions.setIsLoadingCityData(true));
      fetch('/cities?_' + Date.now())
        .then((res) => res.json())
        .then((cityData) => {
          dispatch(actions.setCityData(cityData));
          localStorage.setItem(
            'city_data_cache',
            JSON.stringify({
              expires: Date.now() + 60 * 1000,
              data: cityData
            })
          );
          dispatch(actions.setIsLoadingCityData(false));
        })
        .catch(() => {
          dispatch(actions.setIsLoadingCityData(false));
        });
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
    case types.ACTION_SET_IS_CITY_SELECTOR_VISIBLE:
      return state.set('isCitySelectorVisible', params.isCitySelectorVisible);
    case types.ACTION_SET_CURRENT_SELECTING_LEFT_CITY:
      return state.set(
        'currentSelectingLeftCity',
        params.currentSelectingLeftCity
      );
    case types.ACTION_SET_CITY_DATA:
      return state.set('cityData', params.cityData);
    case types.ACTION_SET_IS_LOADING_CITY_DATA:
      return state.set('isLoadingCityData', params.isLoadingCityData);
    case types.ACTION_SET_IS_DATE_SELECTOR_VISIBLE:
      return state.set('isDateSelectorVisible', params.isDateSelectorVisible);
    case types.ACTION_SET_DEPART_DATE:
      return state.set('departDate', params.departDate);
    case types.ACTION_SET_HIGH_SPEED:
      return state.set('highSpeed', params.highSpeed);
    default:
      return state;
  }
};

export default reducer;
