import React, { useCallback, useEffect, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import URI from 'urijs';
import dayjs from 'dayjs';
import { actions as orderActions } from '../../redux/modules/order';
import './style.css';

import Header from '../../components/Header';
import Detail from '../../components/Detail';
import Account from './components/Account';
import Choose from './components/Choose';
import Passengers from './components/Passengers';
import Ticket from './components/Ticket';
import Menu from './components/Menu';

const Order = function Order(props) {
  const {
    trainNumber,
    departStation,
    arriveStation,
    seatType,
    departDate,
    arriveDate,
    departTimeStr,
    arriveTimeStr,
    durationStr,
    price,
    passengers,
    menu,
    isMenuVisible,
    searchParsed,
    orderActions
  } = props;

  // 返回
  const onBack = useCallback(() => {
    props.history.goBack();
  }, [props.history]);

  // 获取路由跳转携带参数并设置
  useEffect(() => {
    const {
      trainNumber,
      dStation,
      aStation,
      type,
      date
    } = props.history.location.state;
    orderActions.setDepartStation(dStation);
    orderActions.setArriveStation(aStation);
    orderActions.setTrainNumber(trainNumber);
    orderActions.setSeatType(type);
    orderActions.setDepartDate(dayjs(date).valueOf());
    orderActions.setSearchParsed(true);
  }, [orderActions, props.history.location.state]);

  // 请求订单信息
  useEffect(() => {
    if (!searchParsed) return;
    const url = new URI('/order')
      .setSearch('dStation', departStation)
      .setSearch('aStation', arriveStation)
      .setSearch('type', seatType)
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .toString();
    orderActions.fetchInitial(url);
  }, [
    searchParsed,
    departStation,
    arriveStation,
    seatType,
    departDate,
    orderActions
  ]);

  const passengersCbs = useMemo(() => {
    return {
      createAdult: orderActions.createAdult,
      createChild: orderActions.createChild,
      removePassenger: orderActions.removePassenger,
      updatePassenger: orderActions.updatePassenger,
      showGenderMenu: orderActions.showGenderMenu,
      showFollowAdultMenu: orderActions.showFollowAdultMenu,
      showTicketTypeMenu: orderActions.showTicketTypeMenu
    };
  }, [
    orderActions.createAdult,
    orderActions.createChild,
    orderActions.removePassenger,
    orderActions.showFollowAdultMenu,
    orderActions.showGenderMenu,
    orderActions.showTicketTypeMenu,
    orderActions.updatePassenger
  ]);

  const menuCbs = useMemo(() => {
    return {
      hideMenu: orderActions.hideMenu
    };
  }, [orderActions.hideMenu]);

  const chooseCbs = useMemo(() => {
    return {
      updatePassenger: orderActions.updatePassenger
    };
  }, [orderActions.updatePassenger]);

  if (!searchParsed) {
    return null;
  }

  return (
    <div className="app">
      <Header title="订单填写" onBack={onBack} />
      <Detail
        departDate={departDate}
        arriveDate={arriveDate}
        departTimeStr={departTimeStr}
        arriveTimeStr={arriveTimeStr}
        trainNumber={trainNumber}
        departStation={departStation}
        arriveStation={arriveStation}
        durationStr={durationStr}
      >
        <span style={{ display: 'block' }} className="train-icon"></span>
      </Detail>
      <Ticket price={price} type={seatType} />
      <Passengers passengers={passengers} {...passengersCbs} />
      {passengers.length > 0 && (
        <Choose passengers={passengers} {...chooseCbs} />
      )}
      <Account length={passengers.length} price={price} />
      <Menu show={isMenuVisible} {...menu} {...menuCbs} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    trainNumber: state.getIn(['order', 'trainNumber']),
    departStation: state.getIn(['order', 'departStation']),
    arriveStation: state.getIn(['order', 'arriveStation']),
    seatType: state.getIn(['order', 'seatType']),
    departDate: state.getIn(['order', 'departDate']),
    arriveDate: state.getIn(['order', 'arriveDate']),
    departTimeStr: state.getIn(['order', 'departTimeStr']),
    arriveTimeStr: state.getIn(['order', 'arriveTimeStr']),
    durationStr: state.getIn(['order', 'durationStr']),
    price: state.getIn(['order', 'price']),
    passengers: state.getIn(['order', 'passengers']),
    menu: state.getIn(['order', 'menu']),
    isMenuVisible: state.getIn(['order', 'isMenuVisible']),
    searchParsed: state.getIn(['order', 'searchParsed'])
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    orderActions: bindActionCreators(orderActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
