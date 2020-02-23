import React, { useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isImmutable } from 'immutable';
import URI from 'urijs';
import dayjs from 'dayjs';
import { h0 } from '../../utils/utils';
import { actions as ticketActions } from './../../redux/modules/ticket';

import useNav from '../../components/useNav';
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import Detail from '../../components/Detail';
import Candidate from './components/Candidate';
import { TrainContext } from './content';
import './style.css';

const Schedule = lazy(() => import('./components/Schedule'));

const Ticket = function Ticket(props) {
  console.log('Ticket props', props);
  console.log('Ticket History', props.history);

  let {
    departDate,
    arriveDate,
    departTimeStr,
    arriveTimeStr,
    departStation,
    arriveStation,
    trainNumber,
    durationStr,
    tickets,
    isScheduleVisible,
    searchParsed,
    ticketActions
  } = props;

  tickets = isImmutable(tickets) ? tickets.toJS() : tickets;

  // 返回
  const onBack = useCallback(() => {
    props.history.goBack();
  }, [props.history]);

  // 获取路由跳转携带参数并设置
  useEffect(() => {
    const {
      aStation,
      dStation,
      date,
      trainNumber
    } = props.history.location.state;
    ticketActions.setDepartStation(dStation);
    ticketActions.setArriveStation(aStation);
    ticketActions.setTrainNumber(trainNumber);
    ticketActions.setDepartDate(h0(dayjs(date).valueOf()));
    ticketActions.setSearchParsed(true);
  }, [props.history.location.state, ticketActions]);

  useEffect(() => {
    document.title = trainNumber;
  }, [trainNumber]);

  // 请求车次信息
  useEffect(() => {
    if (!searchParsed) return;

    const url = new URI('/ticket')
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .setSearch('trainNumber', trainNumber)
      .toString();

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const { detail, candidates } = result;
        const {
          departTimeStr,
          arriveTimeStr,
          arriveDate,
          durationStr
        } = detail;

        ticketActions.setDepartTimeStr(departTimeStr);
        ticketActions.setArriveTimeStr(arriveTimeStr);
        ticketActions.setArriveDate(arriveDate);
        ticketActions.setDurationStr(durationStr);
        ticketActions.setTickets(candidates);
      });
  }, [searchParsed, departDate, trainNumber, ticketActions]);

  const { isPrevDisabled, isNextDisabled, prev, next } = useNav(
    departDate,
    ticketActions.prevDate,
    ticketActions.nextDate
  );

  // 时刻表回调函数
  const detailCbs = useMemo(() => {
    return {
      toggleIsScheduleVisible: ticketActions.toggleIsScheduleVisible
    };
  }, [ticketActions.toggleIsScheduleVisible]);

  if (!searchParsed) {
    return null;
  }

  return (
    <div className="app">
      <Header title={trainNumber} onBack={onBack} />
      <Nav
        date={departDate}
        isPrevDisabled={isPrevDisabled}
        isNextDisabled={isNextDisabled}
        prev={prev}
        next={next}
      />
      <div className="detail-wrapper">
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
          <span className="left"></span>
          <span
            className="schedule"
            onClick={() => detailCbs.toggleIsScheduleVisible()}
          >
            时刻表
          </span>
          <span className="right"></span>
        </Detail>
      </div>
      <TrainContext.Provider
        value={{
          trainNumber,
          departStation,
          arriveStation,
          departDate
        }}
      >
        <Candidate tickets={tickets} />
      </TrainContext.Provider>
      {isScheduleVisible && (
        <div
          className="mask"
          onClick={() => ticketActions.toggleIsScheduleVisible()}
        >
          <Suspense fallback={<div>loading</div>}>
            <Schedule
              date={departDate}
              trainNumber={trainNumber}
              departStation={departStation}
              arriveStation={arriveStation}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    departDate: state.getIn(['ticket', 'departDate']),
    arriveDate: state.getIn(['ticket', 'arriveDate']),
    departTimeStr: state.getIn(['ticket', 'departTimeStr']),
    arriveTimeStr: state.getIn(['ticket', 'arriveTimeStr']),
    departStation: state.getIn(['ticket', 'departStation']),
    arriveStation: state.getIn(['ticket', 'arriveStation']),
    trainNumber: state.getIn(['ticket', 'trainNumber']),
    durationStr: state.getIn(['ticket', 'durationStr']),
    tickets: state.getIn(['ticket', 'tickets']),
    isScheduleVisible: state.getIn(['ticket', 'isScheduleVisible']),
    searchParsed: state.getIn(['ticket', 'searchParsed'])
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ticketActions: bindActionCreators(ticketActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Ticket);
