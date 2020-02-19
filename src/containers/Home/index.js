import React, { useCallback, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as homeActions } from '../../redux/modules/home';
import './style.css';
import Header from '../../components/Header';
import DepartDate from './components/DepartDate';
import HighSpeed from './components/HighSpeed';
import Journey from './components/Journey';
import Submit from './components/Submit';
import CitySelector from '../../components/CitySelector';

const Home = function(props) {
  const {
    from,
    to,
    isCitySelectorVisible,
    // isDateSelectorVisible,
    cityData,
    isLoadingCityData,
    // highSpeed,
    // departDate,
    homeActions
  } = props;

  const onBack = useCallback(() => {
    this.props.history.goBack();
  }, []);

  const cbs = useMemo(() => {
    return {
      exchangeFromTo: homeActions.exchangeFromTo,
      showCitySelector: homeActions.showCitySelector
    };
  }, [homeActions]);

  const citySelectorCbs = useMemo(() => {
    return {
      onBack: homeActions.hideCitySelector,
      fetchCityData: homeActions.fetchCityData,
      onSelect: homeActions.setSelectedCity
    };
  }, [homeActions]);

  return (
    <div>
      <Header title="火车票" isShowBack={true} onBack={onBack} />
      <form action="./query.html" className="form">
        <Journey from={from} to={to} {...cbs} />
        <DepartDate />
        <HighSpeed />
        <Submit />
      </form>
      <CitySelector
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading={isLoadingCityData}
        {...citySelectorCbs}
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
