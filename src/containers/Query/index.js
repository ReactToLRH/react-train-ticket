import React, { useCallback, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isImmutable } from 'immutable';
import dayjs from 'dayjs';
import URI from 'urijs';
import { actions as queryActions } from '../../redux/modules/query';

import { h0 } from '../../utils/utils';
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import List from './components/List';
import Bottom from './components/Buttom';
import useNav from '../../components/useNav';

const Query = function Query(props) {
  let {
    from,
    to,
    departDate,
    highSpeed,
    trainList,
    orderType,
    onlyTickets,
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    searchParsed,
    queryActions
  } = props;

  trainList = isImmutable(trainList) ? trainList.toJS() : trainList;

  // 获取url传递参数，并设置相关参数值
  useEffect(() => {
    const { from, to, date, highSpeed } = props.history.location.state;
    queryActions.setFrom(from);
    queryActions.setTo(to);
    queryActions.setDepartDate(h0(dayjs(date).valueOf()));
    queryActions.setHighSpeed(highSpeed === 'true');
    queryActions.setSearchParsed(true);
  }, [props.history.location.state, queryActions]);

  // 请求车次列表数据
  useEffect(() => {
    if (!searchParsed) return;
    const url = new URI('/query')
      .setSearch('from', from)
      .setSearch('to', to)
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .setSearch('highSpeed', highSpeed)
      .setSearch('orderType', orderType)
      .setSearch('onlyTickets', onlyTickets)
      .setSearch('checkedTicketTypes', Object.keys(checkedTicketTypes).join())
      .setSearch('checkedTrainTypes', Object.keys(checkedTrainTypes).join())
      .setSearch(
        'checkedDepartStations',
        Object.keys(checkedDepartStations).join()
      )
      .setSearch(
        'checkedArriveStations',
        Object.keys(checkedArriveStations).join()
      )
      .setSearch('departTimeStart', departTimeStart)
      .setSearch('departTimeEnd', departTimeEnd)
      .setSearch('arriveTimeStart', arriveTimeStart)
      .setSearch('arriveTimeEnd', arriveTimeEnd)
      .toString();
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const {
          dataMap: {
            directTrainInfo: {
              trains,
              filter: { ticketType, trainType, depStation, arrStation }
            }
          }
        } = result;

        queryActions.setTrainList(trains);
        queryActions.setTicketTypes(ticketType);
        queryActions.setTrainTypes(trainType);
        queryActions.setDepartStations(depStation);
        queryActions.setArriveStations(arrStation);
      });
  }, [
    arriveTimeEnd,
    arriveTimeStart,
    checkedArriveStations,
    checkedDepartStations,
    checkedTicketTypes,
    checkedTrainTypes,
    departDate,
    departTimeEnd,
    departTimeStart,
    from,
    highSpeed,
    onlyTickets,
    orderType,
    queryActions,
    searchParsed,
    to
  ]);

  // 返回
  const onBack = useCallback(() => {
    props.history.goBack();
  }, [props.history]);

  // 前一天/后一天 - 切换
  const { isPrevDisabled, isNextDisabled, prev, next } = useNav(
    departDate,
    queryActions.prevDate,
    queryActions.nextDate
  );

  return (
    <div>
      <Header title={`${from} ⇀ ${to}`} onBack={onBack} />
      <Nav
        date={departDate}
        isPrevDisabled={isPrevDisabled}
        isNextDisabled={isNextDisabled}
        prev={prev}
        next={next}
      />
      <List list={trainList} />
      <Bottom />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    from: state.getIn(['query', 'from']),
    to: state.getIn(['query', 'to']),
    departDate: state.getIn(['query', 'departDate']),
    highSpeed: state.getIn(['query', 'highSpeed']),
    trainList: state.getIn(['query', 'trainList']),
    orderType: state.getIn(['query', 'orderType']),
    onlyTickets: state.getIn(['query', 'onlyTickets']),
    ticketTypes: state.getIn(['query', 'ticketTypes']),
    checkedTicketTypes: state.getIn(['query', 'checkedTicketTypes']),
    trainTypes: state.getIn(['query', 'trainTypes']),
    checkedTrainTypes: state.getIn(['query', 'checkedTrainTypes']),
    departStations: state.getIn(['query', 'departStations']),
    checkedDepartStations: state.getIn(['query', 'checkedDepartStations']),
    arriveStations: state.getIn(['query', 'arriveStations']),
    checkedArriveStations: state.getIn(['query', 'checkedArriveStations']),
    departTimeStart: state.getIn(['query', 'departTimeStart']),
    departTimeEnd: state.getIn(['query', 'departTimeEnd']),
    arriveTimeStart: state.getIn(['query', 'arriveTimeStart']),
    arriveTimeEnd: state.getIn(['query', 'arriveTimeEnd']),
    isFiltersVisible: state.getIn(['query', 'isFiltersVisible']),
    searchParsed: state.getIn(['query', 'searchParsed'])
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    queryActions: bindActionCreators(queryActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Query);
