import React, { memo, useState, useMemo, useReducer } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isImmutable } from 'immutable';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.css';
import { actions as queryActions } from '../../../../redux/modules/query';
import Slider from '../Slider';

function checkedReducer(state, action) {
  const { type, params } = action;
  let newState;

  switch (type) {
    case 'toggle':
      newState = { ...state };
      if (params in newState) {
        delete newState[params];
      } else {
        newState[params] = true;
      }
      return newState;
    case 'reset':
      return {};
    default:
  }

  return state;
}

// 筛选项
const Filter = memo(function Filter(props) {
  const { name, checked, value, dispatch } = props;

  return (
    <li
      className={classnames({ checked })}
      onClick={() => dispatch({ params: value, type: 'toggle' })}
    >
      {name}
    </li>
  );
});

Filter.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

// 筛选组
const Option = memo(function Option(props) {
  const { title, options, checkedMap, dispatch } = props;

  return (
    <div className="option">
      <h3>{title}</h3>
      <ul>
        {options.map((option) => {
          return (
            <Filter
              key={option.value}
              {...option}
              checked={option.value in checkedMap}
              dispatch={dispatch}
            />
          );
        })}
      </ul>
    </div>
  );
});

Option.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  checkedMap: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

// 筛选弹出层
const BottomModal = memo(function BottomModal(props) {
  console.log('BottomModal props', props);
  let {
    ticketTypes,
    trainTypes,
    departStations,
    arriveStations,
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

  // 数据缓冲区 - 已选择车票的类型
  const [localCheckedTicketTypes, localCheckedTicketTypesDispatch] = useReducer(
    checkedReducer,
    newCheckedTicketTypes,
    (newCheckedTicketTypes) => {
      return {
        ...newCheckedTicketTypes
      };
    }
  );
  console.log('newCheckedTrainTypes', newCheckedTrainTypes);
  // 数据缓冲区 - 已选择车次的类型
  const [localCheckedTrainTypes, localCheckedTrainTypesDispatch] = useReducer(
    checkedReducer,
    newCheckedTrainTypes
  );
  console.log('localCheckedTrainTypes', localCheckedTrainTypes);
  // 数据缓冲区 - 已选择的出发车站
  const [
    localCheckedDepartStations,
    localCheckedDepartStationsDispatch
  ] = useReducer(
    checkedReducer,
    newCheckedDepartStations,
    (newCheckedDepartStations) => {
      return {
        ...newCheckedDepartStations
      };
    }
  );
  // 数据缓冲区 - 已选择的到达车站
  const [
    localCheckedArriveStations,
    localCheckedArriveStationsDispatch
  ] = useReducer(
    checkedReducer,
    newCheckedArriveStations,
    (newCheckedArriveStations) => {
      return {
        ...newCheckedArriveStations
      };
    }
  );

  // 数据缓冲区 - 综合筛选：出发时间 - 开始时间
  const [localDepartTimeStart, setLocalDepartTimeStart] = useState(
    departTimeStart
  );
  // 数据缓冲区 - 综合筛选：出发时间 - 结束时间
  const [localDepartTimeEnd, setLocalDepartTimeEnd] = useState(departTimeEnd);
  // 数据缓冲区 - 综合筛选：到达时间 - 开始时间
  const [localArriveTimeStart, setLocalArriveTimeStart] = useState(
    arriveTimeStart
  );
  // 数据缓冲区 - 综合筛选：到达时间 - 结束时间
  const [localArriveTimeEnd, setLocalArriveTimeEnd] = useState(arriveTimeEnd);

  // 筛选组数据
  const optionGroup = [
    {
      title: '坐席类型',
      options: ticketTypes,
      checkedMap: localCheckedTicketTypes,
      dispatch: localCheckedTicketTypesDispatch
    },
    {
      title: '车次类型',
      options: trainTypes,
      checkedMap: localCheckedTrainTypes,
      dispatch: localCheckedTrainTypesDispatch
    },
    {
      title: '出发车站',
      options: departStations,
      checkedMap: localCheckedDepartStations,
      dispatch: localCheckedDepartStationsDispatch
    },
    {
      title: '到达车站',
      options: arriveStations,
      checkedMap: localCheckedArriveStations,
      dispatch: localCheckedArriveStationsDispatch
    }
  ];

  // 筛选弹出层 - 确定操作
  function sure() {
    queryActions.setCheckedTicketTypes(localCheckedTicketTypes);
    queryActions.setCheckedTrainTypes(localCheckedTrainTypes);
    queryActions.setCheckedDepartStations(localCheckedDepartStations);
    queryActions.setCheckedArriveStations(localCheckedArriveStations);
    queryActions.setDepartTimeStart(localDepartTimeStart);
    queryActions.setDepartTimeEnd(localDepartTimeEnd);
    queryActions.setArriveTimeStart(localArriveTimeStart);
    queryActions.setArriveTimeEnd(localArriveTimeEnd);
    queryActions.resetCheckedTrainTypes();
    queryActions.toggleIsFiltersVisible();
  }

  // 判断是否存在筛选项，用于重置按钮的样式以及是否可操作重置筛选项功能
  const isResetDisabled = useMemo(() => {
    return (
      Object.keys(localCheckedTicketTypes).length === 0 &&
      Object.keys(localCheckedTrainTypes).length === 0 &&
      Object.keys(localCheckedDepartStations).length === 0 &&
      Object.keys(localCheckedArriveStations).length === 0 &&
      localDepartTimeStart === 0 &&
      localDepartTimeEnd === 24 &&
      localArriveTimeStart === 0 &&
      localArriveTimeEnd === 24
    );
  }, [
    localCheckedTicketTypes,
    localCheckedTrainTypes,
    localCheckedDepartStations,
    localCheckedArriveStations,
    localDepartTimeStart,
    localDepartTimeEnd,
    localArriveTimeStart,
    localArriveTimeEnd
  ]);

  // 筛选弹出层 - 重置操作
  function reset() {
    if (isResetDisabled) return;
    localCheckedTicketTypesDispatch({ type: 'reset' });
    localCheckedTrainTypesDispatch({ type: 'reset' });
    localCheckedDepartStationsDispatch({ type: 'reset' });
    localCheckedArriveStationsDispatch({ type: 'reset' });
    setLocalDepartTimeStart(0);
    setLocalDepartTimeEnd(24);
    setLocalArriveTimeStart(0);
    setLocalArriveTimeEnd(24);
  }

  return (
    <div className="bottom-modal">
      <div className="bottom-dialog">
        <div className="bottom-dialog-content">
          <div className="title">
            <span
              className={classnames('reset', {
                disabled: isResetDisabled
              })}
              onClick={reset}
            >
              重置
            </span>
            <span className="ok" onClick={sure}>
              确定
            </span>
          </div>
          <div className="options">
            {optionGroup.map((group) => (
              <Option {...group} key={group.title} />
            ))}
            <Slider
              title="出发时间"
              currentStartHours={localDepartTimeStart}
              currentEndHours={localDepartTimeEnd}
              onStartChanged={setLocalDepartTimeStart}
              onEndChanged={setLocalDepartTimeEnd}
            />
            <Slider
              title="到达时间"
              currentStartHours={localArriveTimeStart}
              currentEndHours={localArriveTimeEnd}
              onStartChanged={setLocalArriveTimeStart}
              onEndChanged={setLocalArriveTimeEnd}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

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

export default connect(mapStateToProps, mapDispatchToProps)(BottomModal);
