import React, { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isImmutable } from 'immutable';
import classnames from 'classnames';
import './style.css';
import { actions as queryActions } from '../../../../redux/modules/query';

import { ORDER_DEPART } from '../../../../redux/modules/query';
import BottomModal from '../ButtomModal';

// 底部筛选栏
const Bottom = function Bottom(props) {
  const {
    highSpeed,
    orderType,
    onlyTickets,
    isFiltersVisible,
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    queryActions
  } = props;

  let newCheckedTicketTypes = isImmutable(checkedTicketTypes)
    ? checkedTicketTypes.toJS()
    : checkedTicketTypes;
  let newCheckedTrainTypes = isImmutable(checkedTrainTypes)
    ? checkedTrainTypes.toJS()
    : checkedTrainTypes;
  let newCheckedDepartStations = isImmutable(checkedDepartStations)
    ? checkedDepartStations.toJS()
    : checkedDepartStations;
  let newCheckedArriveStations = isImmutable(checkedArriveStations)
    ? checkedArriveStations.toJS()
    : checkedArriveStations;

  // 判断综合筛选是否没有筛选项
  const noChecked = useMemo(() => {
    return (
      Object.keys(newCheckedTicketTypes).length === 0 &&
      Object.keys(newCheckedTrainTypes).length === 0 &&
      Object.keys(newCheckedDepartStations).length === 0 &&
      Object.keys(newCheckedArriveStations).length === 0 &&
      departTimeStart === 0 &&
      departTimeEnd === 24 &&
      arriveTimeStart === 0 &&
      arriveTimeEnd === 24
    );
  }, [
    newCheckedTicketTypes,
    newCheckedTrainTypes,
    newCheckedDepartStations,
    newCheckedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd
  ]);

  return (
    <div className="bottom">
      <div className="bottom-filters">
        <span className="item" onClick={queryActions.toggleOrderType}>
          <i className="icon">&#xf065;</i>
          {orderType === ORDER_DEPART ? '出发 早→晚' : '耗时 短→长'}
        </span>
        <span
          className={classnames('item', { 'item-on': highSpeed })}
          onClick={queryActions.toggleHighSpeed}
        >
          <i className="icon">{highSpeed ? '\uf43f' : '\uf43e'}</i>
          只看高铁动车
        </span>
        <span
          className={classnames('item', { 'item-on': onlyTickets })}
          onClick={queryActions.toggleOnlyTickets}
        >
          <i className="icon">{onlyTickets ? '\uf43d' : '\uf43c'}</i>
          只看有票
        </span>
        <span
          className={classnames('item', {
            'item-on': isFiltersVisible || !noChecked
          })}
          onClick={queryActions.toggleIsFiltersVisible}
        >
          <i className="icon">{noChecked ? '\uf0f7' : '\uf446'}</i>
          综合筛选
        </span>
      </div>
      {isFiltersVisible && <BottomModal />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    highSpeed: state.getIn(['query', 'highSpeed']),
    orderType: state.getIn(['query', 'orderType']),
    onlyTickets: state.getIn(['query', 'onlyTickets']),
    isFiltersVisible: state.getIn(['query', 'isFiltersVisible']),
    checkedTicketTypes: state.getIn(['query', 'checkedTicketTypes']),
    checkedTrainTypes: state.getIn(['query', 'checkedTrainTypes']),
    checkedDepartStations: state.getIn(['query', 'checkedDepartStations']),
    checkedArriveStations: state.getIn(['query', 'checkedArriveStations']),
    departTimeStart: state.getIn(['query', 'departTimeStart']),
    departTimeEnd: state.getIn(['query', 'departTimeEnd']),
    arriveTimeStart: state.getIn(['query', 'arriveTimeStart']),
    arriveTimeEnd: state.getIn(['query', 'arriveTimeEnd'])
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    queryActions: bindActionCreators(queryActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Bottom);
