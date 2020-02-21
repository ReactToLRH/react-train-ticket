import React, { useCallback, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as homeActions } from '../../redux/modules/home';
import './style.css';
import { h0 } from '../../utils/utils';
import Header from '../../components/Header';
import DepartDate from './components/DepartDate';
import HighSpeed from './components/HighSpeed';
import Journey from './components/Journey';
import Submit from './components/Submit';
import CitySelector from '../../components/CitySelector';
import DateSelector from '../../components/DateSelector';

const Home = function(props) {
  const {
    from,
    to,
    isCitySelectorVisible,
    isDateSelectorVisible,
    cityData,
    isLoadingCityData,
    highSpeed,
    departDate,
    homeActions
  } = props;

  // 始发站与终点站组件的回调函数
  const journeyCbs = useMemo(() => {
    return {
      exchangeFromTo: homeActions.exchangeFromTo, // 切换始发站与终点站
      showCitySelector: homeActions.showCitySelector // 显示城市选择弹出层
    };
  }, [homeActions.exchangeFromTo, homeActions.showCitySelector]);

  // 出发日期组件回调函数
  const departDateCbs = useMemo(() => {
    return {
      onClick: homeActions.showDateSelector // 显示选择日期弹窗层
    };
  }, [homeActions.showDateSelector]);

  // 是否只看高铁/动车组件回调函数
  const highSpeedCbs = useMemo(() => {
    return {
      toggle: homeActions.toggleHighSpeed // 勾选/取消 - 只看高铁/动车
    };
  }, [homeActions.toggleHighSpeed]);

  // 城市选择组件回调函数
  const citySelectorCbs = useMemo(() => {
    return {
      onBack: homeActions.hideCitySelector, // 隐藏城市选择弹窗层
      fetchCityData: homeActions.fetchCityData, // 请求城市数据
      onSelect: homeActions.setSelectedCity // 选择城市
    };
  }, [
    homeActions.fetchCityData,
    homeActions.hideCitySelector,
    homeActions.setSelectedCity
  ]);

  // 时间选择组件回调函数 - 选择时间日期
  const onSelectDate = useCallback(
    (day) => {
      if (!day) {
        return;
      }
      if (day < h0()) {
        return;
      }
      homeActions.setDepartDate(day); // 设置出发时间
      homeActions.hideDateSelector(); // 隐藏时间选择弹出层
    },
    [homeActions]
  );

  const dateSelectorCbs = useMemo(() => {
    return {
      onBack: homeActions.hideDateSelector
    };
  }, [homeActions.hideDateSelector]);

  const onSubmit = useCallback(() => {
    console.log('onSubmit', props);
    props.history.push({
      pathname: '/query',
      state: {
        from,
        to,
        date: departDate,
        highSpeed
      }
    });
  }, [departDate, from, highSpeed, props, to]);

  return (
    <div>
      <Header title="火车票" isShowBack={false} />
      <div className="form">
        <Journey from={from} to={to} {...journeyCbs} />
        <DepartDate time={departDate} {...departDateCbs} />
        <HighSpeed highSpeed={highSpeed} {...highSpeedCbs} />
        <Submit onSubmit={onSubmit} />
      </div>
      <CitySelector
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading={isLoadingCityData}
        {...citySelectorCbs}
      />
      <DateSelector
        show={isDateSelectorVisible}
        onSelect={onSelectDate}
        {...dateSelectorCbs}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    from: state.getIn(['home', 'from']),
    to: state.getIn(['home', 'to']),
    isCitySelectorVisible: state.getIn(['home', 'isCitySelectorVisible']),
    isDateSelectorVisible: state.getIn(['home', 'isDateSelectorVisible']),
    cityData: state.getIn(['home', 'cityData']),
    isLoadingCityData: state.getIn(['home', 'isLoadingCityData']),
    highSpeed: state.getIn(['home', 'highSpeed']),
    departDate: state.getIn(['home', 'departDate'])
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    homeActions: bindActionCreators(homeActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
