import { fromJS } from 'immutable';

// init state
const initialState = fromJS({
  trainNumber: null, // 车次编号
  departStation: null, // 始发站
  arriveStation: null, // 终点站
  seatType: null, // 坐席类型（一等座、二等座、商务座）
  departDate: Date.now(), // 出发日期
  arriveDate: Date.now(), // 到达日期
  departTimeStr: null, // 出发时间 - 字符串类型
  arriveTimeStr: null, // 到达时间 - 字符串类型
  durationStr: null, // 行程时间
  price: null, // 票价
  passengers: [], // 乘客信息
  menu: null, // 菜单
  isMenuVisible: false, // 是否显示菜单
  searchParsed: false // 是否请求数据标识
});

// action types
export const types = {
  ACTION_SET_TRAIN_NUMBER: 'ORDER/SET_TRAIN_NUMBER',
  ACTION_SET_DEPART_STATION: 'ORDER/SET_DEPART_STATION',
  ACTION_SET_ARRIVE_STATION: 'ORDER/SET_ARRIVE_STATION',
  ACTION_SET_SEAT_TYPE: 'ORDER/SET_SEAT_TYPE',
  ACTION_SET_DEPART_DATE: 'ORDER/SET_DEPART_DATE',
  ACTION_SET_ARRIVE_DATE: 'ORDER/SET_ARRIVE_DATE',
  ACTION_SET_DEPART_TIME_STR: 'ORDER/SET_DEPART_TIME_STR',
  ACTION_SET_ARRIVE_TIME_STR: 'ORDER/SET_ARRIVE_TIME_STR',
  ACTION_SET_DURATION_STR: 'ORDER/SET_DURATION_STR',
  ACTION_SET_PRICE: 'ORDER/SET_PRICE',
  ACTION_SET_PASSENGERS: 'ORDER/SET_PASSENGERS',
  ACTION_SET_MENU: 'ORDER/SET_MENU',
  ACTION_SET_IS_MENU_VISIBLE: 'ORDER/SET_IS_MENU_VISIBLE',
  ACTION_SET_SEARCH_PARSED: 'ORDER/SET_SEARCH_PARSED'
};

let passengerIdSeed = 0;

// actions
export const actions = {
  setTrainNumber: (trainNumber) => ({
    type: types.ACTION_SET_TRAIN_NUMBER,
    params: { trainNumber }
  }),
  setDepartStation: (departStation) => ({
    type: types.ACTION_SET_DEPART_STATION,
    params: { departStation }
  }),
  setArriveStation: (arriveStation) => ({
    type: types.ACTION_SET_ARRIVE_STATION,
    params: { arriveStation }
  }),
  setSeatType: (seatType) => ({
    type: types.ACTION_SET_SEAT_TYPE,
    params: { seatType }
  }),
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
  setDurationStr: (durationStr) => ({
    type: types.ACTION_SET_DURATION_STR,
    params: { durationStr }
  }),
  setPrice: (price) => ({
    type: types.ACTION_SET_PRICE,
    params: { price }
  }),
  setPassengers: (passengers) => ({
    type: types.ACTION_SET_PASSENGERS,
    params: { passengers }
  }),
  setMenu: (menu) => ({
    type: types.ACTION_SET_MENU,
    params: { menu }
  }),
  setIsMenuVisible: (isMenuVisible) => ({
    type: types.ACTION_SET_IS_MENU_VISIBLE,
    params: { isMenuVisible }
  }),
  setSearchParsed: (searchParsed) => ({
    type: types.ACTION_SET_SEARCH_PARSED,
    params: { searchParsed }
  }),
  fetchInitial: (url) => {
    return (dispatch, getState) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const {
            departTimeStr,
            arriveTimeStr,
            arriveDate,
            durationStr,
            price
          } = data;
          dispatch(actions.setDepartTimeStr(departTimeStr));
          dispatch(actions.setArriveTimeStr(arriveTimeStr));
          dispatch(actions.setArriveDate(arriveDate));
          dispatch(actions.setDurationStr(durationStr));
          dispatch(actions.setPrice(price));
        });
    };
  },
  // 添加成人
  createAdult: () => {
    return (dispatch, getState) => {
      const passengers = getState().getIn(['order', 'passengers']);
      // 检测成人相关信息是否填写完成，如果没有，则拒绝添加下一个成人信息
      for (let passenger of passengers) {
        const keys = Object.keys(passenger);
        for (let key of keys) {
          if (!passenger[key]) {
            return;
          }
        }
      }
      dispatch(
        actions.setPassengers([
          ...passengers,
          {
            id: ++passengerIdSeed,
            name: '',
            ticketType: 'adult',
            licenceNo: '',
            seat: 'Z'
          }
        ])
      );
    };
  },
  // 添加儿童
  createChild: () => {
    return (dispatch, getState) => {
      const passengers = getState().getIn(['order', 'passengers']);
      let adultFound = null;
      for (let passenger of passengers) {
        const keys = Object.keys(passenger);
        for (let key of keys) {
          if (!passenger[key]) {
            return;
          }
        }
        // 判断儿童是否绑定成人，如果没有则拒绝添加
        if (passenger.ticketType === 'adult') {
          adultFound = passenger.id;
        }
      }
      if (!adultFound) {
        alert('请至少正确添加一个同行成人');
        return;
      }
      dispatch(
        actions.setPassengers([
          ...passengers,
          {
            id: ++passengerIdSeed,
            name: '',
            gender: 'none',
            birthday: '',
            followAdult: adultFound,
            ticketType: 'child',
            seat: 'Z'
          }
        ])
      );
    };
  },
  removePassenger: (id) => {
    return (dispatch, getState) => {
      const passengers = getState().getIn(['order', 'passengers']);
      const newPassengers = passengers.filter((passenger) => {
        return passenger.id !== id && passenger.followAdult !== id;
      });
      dispatch(actions.setPassengers(newPassengers));
    };
  },
  updatePassenger: (id, data, keysToBeRemoved = []) => {
    return (dispatch, getState) => {
      const passengers = getState().getIn(['order', 'passengers']);
      for (let i = 0; i < passengers.length; ++i) {
        if (passengers[i].id === id) {
          const newPassengers = [...passengers];
          newPassengers[i] = Object.assign({}, passengers[i], data);
          for (let key of keysToBeRemoved) {
            delete newPassengers[i][key];
          }
          dispatch(actions.setPassengers(newPassengers));
          break;
        }
      }
    };
  },
  showMenu: (menu) => {
    return (dispatch) => {
      dispatch(actions.setMenu(menu));
      dispatch(actions.setIsMenuVisible(true));
    };
  },
  // 显示性别选择菜单
  showGenderMenu: (id) => {
    return (dispatch, getState) => {
      const passengers = getState().getIn(['order', 'passengers']);
      const passenger = passengers.find((passenger) => passenger.id === id);
      if (!passenger) return;
      dispatch(
        actions.showMenu({
          onPress(gender) {
            dispatch(actions.updatePassenger(id, { gender }));
            dispatch(actions.hideMenu());
          },
          options: [
            {
              title: '男',
              value: 'male',
              active: 'male' === passenger.gender
            },
            {
              title: '女',
              value: 'female',
              active: 'female' === passenger.gender
            }
          ]
        })
      );
    };
  },
  // 显示儿童跟随成人选择菜单
  showFollowAdultMenu: (id) => {
    return (dispatch, getState) => {
      const passengers = getState().getIn(['order', 'passengers']);
      const passenger = passengers.find((passenger) => passenger.id === id);
      if (!passenger) return;
      dispatch(
        actions.showMenu({
          onPress(followAdult) {
            dispatch(actions.updatePassenger(id, { followAdult }));
            dispatch(actions.hideMenu());
          },
          options: passengers
            .filter((passenger) => passenger.ticketType === 'adult')
            .map((adult) => {
              return {
                title: adult.name,
                value: adult.id,
                active: adult.id === passenger.followAdult
              };
            })
        })
      );
    };
  },
  // 显示车票类型选择菜单：成人票，儿童票
  showTicketTypeMenu: (id) => {
    console.log('showTicketTypeMenu id', id);
    return (dispatch, getState) => {
      const passengers = getState().getIn(['order', 'passengers']);
      const passenger = passengers.find((passenger) => passenger.id === id);
      if (!passenger) return;
      dispatch(
        actions.showMenu({
          onPress(ticketType) {
            if ('adult' === ticketType) {
              dispatch(
                actions.updatePassenger(
                  id,
                  {
                    ticketType,
                    licenceNo: ''
                  },
                  ['gender', 'followAdult', 'birthday']
                )
              );
            } else {
              const adult = passengers.find(
                (passenger) =>
                  passenger.id !== id && passenger.ticketType === 'adult'
              );
              if (adult) {
                dispatch(
                  actions.updatePassenger(
                    id,
                    {
                      ticketType,
                      gender: '',
                      followAdult: adult.id,
                      birthday: ''
                    },
                    ['licenceNo']
                  )
                );
              } else {
                alert('没有其他成人乘客');
              }
            }
            dispatch(actions.hideMenu());
          },
          options: [
            {
              title: '成人票',
              value: 'adult',
              active: 'adult' === passenger.ticketType
            },
            {
              title: '儿童票',
              value: 'child',
              active: 'child' === passenger.ticketType
            }
          ]
        })
      );
    };
  },
  hideMenu: () => {
    return actions.setIsMenuVisible(false);
  }
};

// reducer
const reducer = (state = initialState, action) => {
  const { type, params } = action;
  switch (type) {
    case types.ACTION_SET_TRAIN_NUMBER:
      return state.set('trainNumber', params.trainNumber);
    case types.ACTION_SET_DEPART_STATION:
      return state.set('departStation', params.departStation);
    case types.ACTION_SET_ARRIVE_STATION:
      return state.set('arriveStation', params.arriveStation);
    case types.ACTION_SET_SEAT_TYPE:
      return state.set('seatType', params.seatType);
    case types.ACTION_SET_DEPART_DATE:
      return state.set('departDate', params.departDate);
    case types.ACTION_SET_ARRIVE_DATE:
      return state.set('arriveDate', params.arriveDate);
    case types.ACTION_SET_DEPART_TIME_STR:
      return state.set('departTimeStr', params.departTimeStr);
    case types.ACTION_SET_ARRIVE_TIME_STR:
      return state.set('arriveTimeStr', params.arriveTimeStr);
    case types.ACTION_SET_DURATION_STR:
      return state.set('durationStr', params.durationStr);
    case types.ACTION_SET_PRICE:
      return state.set('price', params.price);
    case types.ACTION_SET_PASSENGERS:
      return state.set('passengers', params.passengers);
    case types.ACTION_SET_MENU:
      return state.set('menu', params.menu);
    case types.ACTION_SET_IS_MENU_VISIBLE:
      return state.set('isMenuVisible', params.isMenuVisible);
    case types.ACTION_SET_SEARCH_PARSED:
      return state.set('searchParsed', params.searchParsed);
    default:
      return state;
  }
};

export default reducer;
