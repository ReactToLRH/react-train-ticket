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

  const onBack = useCallback(() => {
    props.history.goBack();
  }, [props.history]);

  const cbs = useMemo(() => {
    return {
      exchangeFromTo: homeActions.exchangeFromTo,
      showCitySelector: homeActions.showCitySelector
    };
  }, [homeActions.exchangeFromTo, homeActions.showCitySelector]);

  const departDateCbs = useMemo(() => {
    return {
      onClick: homeActions.showDateSelector
    };
  }, [homeActions.showDateSelector]);

  const highSpeedCbs = useMemo(() => {
    return {
      toggle: homeActions.toggleHighSpeed
    };
  }, [homeActions.toggleHighSpeed]);

  const citySelectorCbs = useMemo(() => {
    return {
      onBack: homeActions.hideCitySelector,
      fetchCityData: homeActions.fetchCityData,
      onSelect: homeActions.setSelectedCity
    };
  }, [
    homeActions.fetchCityData,
    homeActions.hideCitySelector,
    homeActions.setSelectedCity
  ]);

  const onSelectDate = useCallback(
    (day) => {
      if (!day) {
        return;
      }
      if (day < h0()) {
        return;
      }
      homeActions.setDepartDate(day);
      homeActions.hideDateSelector();
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
      query: {
        from,
        to,
        date: departDate,
        highSpeed
      }
    });
  }, [departDate, from, highSpeed, props, to]);

  return (
    <div>
      <Header title="火车票" isShowBack={true} onBack={onBack} />
      <div className="form">
        <Journey from={from} to={to} {...cbs} />
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
